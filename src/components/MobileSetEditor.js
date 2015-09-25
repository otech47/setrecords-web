import React from 'react/addons';
var moment = require("moment");
import MockSetTile from './MockSetTile';
var Dropzone = require("react-dropzone");
import _ from 'underscore';
import async from 'async';

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
			tile_image: [],
			changes: false
		}
	},
	componentWillMount: function() {
		var setCopy = _.clone(this.props.set);
		this.setState({
			pendingSet: setCopy
		});
	},
	newImage: function(callback) {
		// console.log("New tile image pending:")
		// console.log(this.state.tile_image);
		async.waterfall([this.registerTileImage, this.updateTileImageDatabase],
			function(err, results) {
				if (err) {
					// console.log("Error occurred while updating image. ", err);
					callback(err);
				} else {
					// console.log("Tile image updated.");
					callback(null);
				}
		});
	},
	registerTileImage: function(callback) {
		var file = this.state.tile_image[0];
		var self = this;
		// console.log("Requesting encoding from AWS...");
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/aws/configureAWS?filename=" + encodeURIComponent(file.name),
			contentType: "application/json",
			success: function(response) {
				// console.log("Encoding successful.");
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
					// console.log("Uploading image: " + percent);
				});

				// console.log("Uploading file to S3...");
				upload.send(function(err, data) {
					if (err) {
						// console.log("An error occurred uploading the file to S3.");
						callback(err);
					} else {
						// console.log("Upload successful. File located at: " + data.Location);
						callback(null, response.encoded);
					}
				});
			},
			error: function(err) {
				// console.log("There was an error encoding the file.");
				callback(err);
			}
		});
	},
	updateTileImageDatabase: function(imageURL, callback) {
		// console.log("Adding tile image to databases...");
		var requestURL = "http://localhost:3000/api/v/7/setrecords/mix/image/" + this.props.set.id;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				image_url: imageURL
			},
			success: function(res) {
				// console.log("Image successfully added to database.")
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when updating the database.");
				callback(err);
			}
		});
	},
	newTitle: function(callback) {
		// console.log("New set title pending.");
		// console.log(this.state.pendingSet.event);
		var requestURL = "http://localhost:3000/api/v/7/setrecords/mix/title/" + this.props.set.id;
		var newTitle = this.state.pendingSet.event;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				event: newTitle
			},
			success: function(res) {
				// console.log("Set title updated on database.");
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when adding new title to database.", err);
				callback(err);
			}
		});
	},
	applyChanges: function() {
		if (this.state.changes) {
			// console.log("Pending changes found.");
			var changeFunctions = [];
			var pendingSet = this.state.pendingSet;
			var self = this;
			if (this.state.tile_image.length > 0) {
				changeFunctions.push(this.newImage);
				// console.log("Changes to do");
				// console.log(changeFunctions);
			}
			if (this.state.pendingSet.event != this.props.set.event) {
				changeFunctions.push(this.newTitle);
				// console.log("Changes to do");
				// console.log(changeFunctions);
			}

			// console.log("Applying changes...");
			async.parallel(changeFunctions, function(err, results) {
				if (err) {
					// console.log("There was an error when applying changes to this set.");
					// console.log(err);
					// console.log("Closing window...");
					self.props.close(true);
				} else {
					// console.log("All changes applied successfully.");
					// console.log("Closing window...");
					self.props.close(true);
				}
			});

		} else {
			// console.log("No pending changes. Closing window...");
			this.props.close(false);
		}
	},
	revertChanges: function() {
		var self = this;
		// console.log("Reverting...");
		var setCopy = _.clone(this.props.set);
		this.setState({
			pendingSet: setCopy,
			tile_image: [],
			changes: false
		});
	},
	cancelChanges: function() {
		var self = this;
		var setCopy = _.clone(this.props.set);
		// console.log("Clicked cancel. Reverting...")
		this.setState({
			pendingSet: setCopy,
			tile_image: [],
			changes: false
		}, function() {
			// console.log("Closing...");
			self.props.close(false);
		});
	},
	changeTitleText: function(event) {
		var pendingSet = this.state.pendingSet;
		pendingSet["event"] = event.target.value;
		this.setState({
			pendingSet: pendingSet,
			changes: true
		});
	},
	onDrop: function(file) {
		this.setState({
			tile_image: file,
			changes: true
		});
	},
	showEditImage: function() {
		if (this.props.set.is_radiomix) {
			return (
				<div className="set-tile-preview">
			    	<MockSetTile setData={this.state.pendingSet} episodeImage={this.state.tile_image} />
			    	<Dropzone onDrop={this.onDrop} className="upload-image set-flex"  multiple={false}>
			    		<p>Click or drag file here to upload new {this.state.pendingSet.episode ? "episode":"mix"} image</p>
			    	</Dropzone>
			    </div>
			);
		}
		else {
			return "";
		}
	},
	showSetTitle: function() {
		var pendingSet = this.state.pendingSet;
		if (this.props.set.is_radiomix) {
			return (
				<div className="edit-set-name flex-row">
					<input type="text" value={pendingSet.event} onChange={this.changeTitleText} />
				</div>
			);
		} else {
			return (
				<div className="edit-set-name flex-row">
					<span className="event-title">{pendingSet.event}</span>
				</div>
			);
		}
	},
	showEpisodeName: function() {
		var pendingSet = this.state.pendingSet;
		if (this.props.set.episode) {
			return (
				<div className="edit-episode-name flex-row">
					<span className="episode-name">Episode: {pendingSet.episode}</span>
				</div>
			);
		} else {
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
				{this.showSetTitle()}				
				{this.showEpisodeName()}
				<p className="uploaded-date">Uploaded: {moment(pendingSet.datetime).format("M[/]D[/]YYYY")}</p>

		    	{this.showEditImage()}
			</div>
		);
	}
});

module.exports = MobileSetEditor;