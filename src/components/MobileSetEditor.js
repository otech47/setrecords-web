import React from 'react/addons';
var moment = require("moment");
import MockSetTile from './MockSetTile';
var Dropzone = require("react-dropzone");

var MobileSetEditor = React.createClass({
	getInitialState: function() {
		return {
			pendingSet: {
				"id": 2163,
				"artist_id": [40],
				"artist": "Calvin Harris",
				"event": "Lollapalooza Chicago 2014",
				"event_id": 125,
				"episode": "",
				"genre": "Progressive House",
				"episode_imageURL": null,
				"eventimageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
				"main_eventimageURL": "8035464a1f8870cce06b320fbab09a73d4994b54.jpg",
				"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
				"songURL": "850123b85fd2246c014fc6f9ce427708b72a97da.mp3",
				"datetime": "2014-08-06T03:31:35.000Z",
				"popularity": 7686,
				"is_radiomix": 0,
				"set_length": "48:49",
				"tracklistURL": null,
				"imageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
				"artist_preview": [
					{
					"id": 40,
					"artist": "Calvin Harris",
					"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
					"set_count": 14,
					"event_count": 5
					}
				],
				"model_type": "set"
			},
			episode_image: [],
			pendingChanges: false
		}
	},
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	componentWillMount: function() {
		this.setState({
			pendingSet: this.props.set,
		});
	},
	uploadEpisodeImage: function(callback) {
		var file = this.state.episode_image[0];
		var self = this;
		console.log("Requesting encoding from AWS...");
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/aws/configureAWS?filename=" + encodeURIComponent(file.name),
			contentType: "application/json",
			success: function(response) {
				console.log("Encoding successful.");
				AWS.config.update(response.settings);
				var encodedFilename = response.encoded;
				var filesize = file.size;
				var s3 = new AWS.S3();

				s3.timeout = 50000;
				var params = {
					Bucket: "stredm",
					Key: "namecheap/" + encodedFilename,
					ContentType: file.type,
					Body: file
				};
				var upload = s3.upload(params);
				upload.on("httpUploadProgress", function(event) {
					var percentage = (event.loaded / filesize) * 100;
					var percent = parseInt(percentage).toString() + "%";
					console.log("Uploading image: " + percent);
				});

				console.log("Uploading file to S3...");
				upload.send(function(err, data) {
					if (err) {
						console.log("An error occurred.");
						console.log(err);
						callback(err);
					} else {
						console.log("Upload successful. File located at: " + data.Location);
						self.updateEpisodeImageDatabase(response.encoded, callback);
					}
				});
			}
		});
	},
	updateEpisodeImageDatabase: function(imageURL, callback) {
		console.log("Adding episode image to databases...");
		var requestURL = "http://localhost:3000/api/v/7/setrecords/episodes/image/" + this.state.pendingSet.id;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				image_url: imageURL
			},
			success: function(res) {
				console.log("Image successfully added.")
				callback(null);
			}
		});
	},
	applyChanges: function() {
		if (this.state.pendingChanges) {
			console.log("Pending changes found.");
			var setInfo = {};
			var pendingSet = this.state.pendingSet;
			var self = this;
			setInfo["pendingSet"] = pendingSet;

			if (this.state.episode_image.length > 0) {
				console.log("New episode image pending:")
				console.log(this.state.episode_image);
				this.uploadEpisodeImage(function(err) {
					if (err) {
						console.log("Error occurred.", err);
						console.log("Closing window...");
						self.props.close();
					} else {
						console.log("Episode image for this mix updated.");
						console.log("Closing window...");
						self.props.close();
					}
				});
			} else {
				this.props.close();
			}
		} else {
			console.log("No pending changes. Closing window...");
			this.props.close();
		}
	},
	revertChanges: function() {
		this.setState({
			pendingSet: this.props.set,
			episode_image: [],
			pendingChanges: false
		});
	},
	cancelChanges: function() {
		var self = this;
		this.setState({
			pendingSet: this.props.set,
			episode_image: [],
			pendingChanges: false
		}, function() {
			self.props.close();
		});
	},
	onDrop: function(file) {
		this.setState({
			episode_image: file,
			pendingChanges: true
		});
	},
	showEditImage: function() {
		if (this.state.pendingSet.is_radiomix) {
			return (
				<div className="set-tile-preview">
			    	<MockSetTile setData={this.state.pendingSet} episodeImage={this.state.episode_image} multiple="false" />
			    	<Dropzone onDrop={this.onDrop} className="upload-image set-flex">
			    		<p>Click or drag file here to upload new episode image</p>
			    	</Dropzone>
			    </div>
			);
		}
		else {
			return "";
		}
	},
	render: function() {
		var pendingSet = this.state.pendingSet;
		return (
			<div className="mobile-set-editor flex-column">
				<div className="flex-row apply-editor">
					<button className="flex-fixed apply set-flex" onClick={this.applyChanges}>
						Apply
					</button>
					<button className="flex-fixed revert set-flex" onClick={this.revertChanges}>
						Revert
					</button>
					<button className="flex-fixed cancel set-flex" onClick={this.cancelChanges}>
						Cancel
					</button>					
				</div>				
				<div className="edit-set-name flex-row">
					<span className="event-title">{pendingSet.event}</span>
					<span className="edit-button">edit<i className="fa fa-pencil"></i></span>
				</div>
				<p className="uploaded-date">Uploaded: {moment(pendingSet.datetime).format("M[/]D[/]YYYY")}</p>

		    	{this.showEditImage()}
			</div>
		);
	}
});

module.exports = MobileSetEditor;