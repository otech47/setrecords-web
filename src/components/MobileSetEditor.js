import React from 'react/addons';
var moment = require("moment");
import MockSetTile from './MockSetTile';
var Dropzone = require("react-dropzone");
import _ from 'underscore';
import async from 'async';
var Loader = require("react-loader");
import Tracklist from './Tracklist';

var MobileSetEditor = React.createClass({
	getInitialState: function() {
		var setCopy = this.props.cloneObject(this.props.set);
		setCopy["tracklistURL"] = null;
		setCopy["tile_image"] = [];
		setCopy["changes"] = false;
		setCopy["busy"] = false;
		setCopy["applying"] = false;
		setCopy["success"] = false;
		setCopy["failure"] = false;
		return setCopy;
	},
	render: function() {
		return (
			<div className="mobile-set-editor flex-column">
				{this.showApplyingStatus()}
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
				{this.showSetName()}				
				{this.showEpisodeName()}
				<p className="uploaded-date">Uploaded: {moment(this.props.set.datetime).format("M[/]D[/]YYYY")}</p>
		    	{this.showEditImage()}
		    	<Tracklist tracks={this.state.tracklist} listURL={this.state.tracklistURL} changeTrack={this.changeTrack} addTrack={this.addTrack} loadTracksFromURL={this.loadTracksFromURL} deleteTrack={this.deleteTrack} changeTracklistURL={this.changeTracklistURL} />
			</div>
		);
	},

	addTrack: function() {
		var artistName = this.props.appState.get("artist_data").artist;
		var tracklist = this.state.tracklist;
		var tracklistLength = _.size(tracklist);
		if (tracklistLength > 0) {
			var nextStartTime = moment(tracklist[tracklistLength - 1].start_time, "mm:ss").add(1, "seconds").format("mm:ss");
		} else {
			var nextStartTime = "00:00";
		}
		var newTracklist = this.props.cloneObject(tracklist);
		newTracklist[tracklistLength] = {
			"track_id": -1,
			"start_time": nextStartTime,
			"artist": artistName,
			"song": "untitled"
		};
		this.setState({
			tracklist: newTracklist,
			changes: true,
			tracklistURL: null
		});
	},
	changeTitleText: function(event) {
		this.setState({
			event: event.target.value,
			changes: true
		});
	},
	changeTrack: function(fieldName, newVal, trackIndex) {
		var clonedTracklist = this.props.cloneObject(this.state.tracklist);
		clonedTracklist[trackIndex][fieldName] = newVal;

		this.setState({
			tracklist: clonedTracklist,
			changes: true,
			tracklistURL: null
		});
	},
	changeTracklistURL: function(event) {
		this.setState({
			tracklistURL: event.target.value,
			changes: true
		});
	},
	changeEpisodeText: function(event) {
		this.setState({
			episode: event.target.value,
			changes: true
		});
	},
	deleteTrack: function(trackIndex) {
		var clonedTracklist = this.props.cloneObject(this.state.tracklist);
		var counter = 0;
		var updatedTracklist = {};
		_.each(clonedTracklist, function(value, key) {
			if (key != trackIndex) {
				updatedTracklist[counter] = value;
				counter++;
			}
		});
		this.setState({
			tracklist: updatedTracklist,
			changes: true,
			tracklistURL: null
		});
	},
	pullTracks: function(callback) {
		var tracklistURL = this.state.tracklistURL;
		if (tracklistURL == null) {
			callback(null);
		} else {
			var requestURL = "http://localhost:3000/api/v/7/setrecords/set/tracklist/";
			$.ajax({
				type: "GET",
				url: requestURL,
				data: {
					tracklist_url: tracklistURL
				},
				success: function(res) {
					if (res.status == "failure") {
						callback(null);
					} else {
						callback(res.payload.set_tracklist);
					}
				},
				error: function(err) {
					callback(null);
				}
			});
		}
	},
	loadTracksFromURL: function(event) {
		var self = this;
		this.pullTracks(function(tracks) {
			if (tracks == null) {
				alert("Please enter a valid 1001 tracklists URL.");
			} else {
				var clonedTracks = this.props.cloneObject(tracks);
				self.setState({
					tracklist: clonedTracks,
					changes: true
				});
			}
		});
	},
	newEpisodeTitle: function(callback) {
		// console.log("New episode title pending.");
		// console.log(this.state.episode);
		var requestURL = "http://localhost:3000/api/v/7/setrecords/mix/episode/" + this.state.episode_id;
		var pendingEpisode = this.state.episode;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				episode: pendingEpisode
			},
			success: function(res) {
				// console.log("Episode title updated on database.");
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when updating episode title on database.");
				callback(err);
			}
		});
	},	
	newImage: function(callback) {
		// console.log("New tile image pending:")
		// console.log(this.state.tile_image);
		async.waterfall([this.registerImageS3, this.updateImageDatabase],
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
	newTitle: function(callback) {
		// console.log("New set title pending.");
		// console.log(this.state.event);
		var requestURL = "http://localhost:3000/api/v/7/setrecords/mix/title/" + this.props.set.id;
		var pendingTitle = this.state.event;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				event: pendingTitle
			},
			success: function(res) {
				// console.log("Set title updated on database.");
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when updating title on database.", err);
				callback(err);
			}
		});
	},
	newTracks: function(callback) {
		// console.log("New tracks pending.");
		// console.log(this.state.tracklist);
		var pendingTracklist = this.state.tracklist;
		var requestURL = "http://localhost:3000/api/v/7/setrecords/mix/tracklist/" + this.props.set.id;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				tracklist: pendingTracklist
			},
			success: function(res) {
				// console.log("Tracks updated on database.");
				// console.log(res);
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when updating tracks on the database.", err);
				callback(err);
			}
		});
	},
	onDrop: function(file) {
		if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
			this.setState({
				tile_image: file,
				changes: true
			});
		} else {
			alert("Please upload a png, jpeg, or gif image.");
		}
	},
	showApplyingStatus: function() {
		if (this.state.busy) {
			var statusMessage;

			if (this.state.success) {
				statusMessage = "Your changes have been applied.";
			} else if (this.state.failure) {
				statusMessage = "There was an error applying your changes. Please try again.";
			} else {
				statusMessage = "Applying changes...";
			}

			return (
				<div className="applying-changes-overlay set-flex">
					{statusMessage}
				</div>
			);
		}
	},
	showEditImage: function() {
		if (this.props.set.is_radiomix) {
			return (
				<div className="set-tile-preview">
			    	<MockSetTile setData={this.state} episodeImage={this.state.tile_image} />
			    	<Dropzone onDrop={this.onDrop} className="upload-image set-flex"  multiple={false}>
			    		<p>Click or drag file here to upload new {this.state.episode ? "episode":"mix"} image</p>
			    	</Dropzone>
			    </div>
			);
		}
		else {
			return "";
		}
	},
	showEpisodeName: function() {
		var pendingSet = this.state;
		if (this.props.set.episode) {
			return (
				<div className="edit-episode-name flex-row">
					Episode Title
					<input type="text" value={pendingSet.episode} onChange={this.changeEpisodeText} />
				</div>
			);
		} else {
			return "";
		}
	},
	showSetName: function() {
		var pendingSet = this.state;
		if (this.props.set.is_radiomix) {
			return (
				<div className="edit-set-name flex-row">
					{pendingSet.is_radiomix ? "Mix" : "Event"} Title:
					<input type="text" className="MixTitle" value={pendingSet.event} onChange={this.changeTitleText} />
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
	registerImageS3: function(callback) {
		var file = this.state.tile_image[0];
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
				// upload.on("httpUploadProgress", function(event) {
				// 	var percentage = (event.loaded / filesize) * 100;
				// 	var percent = parseInt(percentage).toString() + "%";
				// 	console.log("Uploading image: " + percent);
				// });

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
	updateImageDatabase: function(imageURL, callback) {
		// console.log("Adding image to databases...");
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

	applyChanges: function() {
		var pendingSet = this.state;

		if (pendingSet.changes) {
			console.log("Pending changes found.");
			var changeFunctions = [];
			if (pendingSet.tile_image.length > 0) {
				changeFunctions.push(this.newImage);
			}
			if (pendingSet.event != this.props.set.event) {
				changeFunctions.push(this.newTitle);
			}
			if (pendingSet.episode != this.props.set.episode) {
				changeFunctions.push(this.newEpisodeTitle);
			}
			// console.log("Comparing tracklists to determine a change...");
			var originalTracklist = this.props.cloneObject(this.props.set.tracklist);
			var pendingTracklist = this.state.tracklist;
			// console.log("PENDING");
			// console.log(pendingTracklist);
			// console.log("ORIGINAL");
			// console.log(originalTracklist);
			var tracklistChanged = !(_.isEqual(pendingTracklist, originalTracklist));

			// console.log("Change?");
			// console.log(tracklistChanged);

			if (tracklistChanged) {
				changeFunctions.push(this.newTracks);
			}
			console.log("Changes to do");
			console.log(changeFunctions);
			console.log("Applying changes...");
			var self = this;
			this.setState({
				busy: true,
				applying: true
			}, function() {
				async.parallel(changeFunctions, function(err, results) {
					if (err) {
						console.log("There was an error when applying changes to this set.");
						console.log(err);
						self.setState({
							failure: true,
							applying: false
						}, function() {
							setTimeout(function() {
								self.props.close(true);	
							}, 3000);
						});
					} else {
							console.log("All changes applied successfully.");
							self.setState({
								applying: false,
								success: true
							}, function() {
								setTimeout(function() {
									self.props.close(true);	
								}, 3000);
							});
						}
				});
			});

		} else {
			console.log("No pending changes. Closing window...");
			this.props.close(false);
		}
	},
	revertChanges: function() {
		// console.log("Reverting...");
		var setCopy = this.props.cloneObject(this.props.set);
		setCopy["tracklistURL"] = null;
		setCopy["tile_image"] = [];
		setCopy["changes"] = false;
		setCopy["busy"] = false;
		setCopy["applying"] = false;
		setCopy["success"] = false;
		setCopy["failure"] = false;
		this.replaceState(setCopy);
	},
	cancelChanges: function() {
		this.props.close(false);
	},
});

module.exports = MobileSetEditor;