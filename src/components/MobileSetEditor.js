import React from 'react';
import moment from 'moment';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import update from 'react-addons-update';
import _ from 'underscore';
import R from 'ramda';
import async from 'async';
import constants from '../constants/constants';
import {History} from 'react-router';

import {Motion, spring, presets} from 'react-motion';
import ConfirmChanges from './ConfirmChanges';
import Notification from './Notification';
import Icon from './Icon';
import Tracklist from './Tracklist';
import Dropzone from 'react-dropzone';

var MobileSetEditor = React.createClass({

	mixins: [History],

	getInitialState() {
		return {
			tracklistURL: null,
			tile_image: [],
			changes: false,
			busy: false,
			applying: false,
			success: false,
			failure: false,
			set: {	},
			tracklist: [],
			open: false,
			notify: false
		}

		// return update(this.props.originalSet, {
		// 	$merge: {
		// 		tracklistURL: null,
		// 		tile_image: [],
		// 		changes: false,
		// 		busy: false,
		// 		applying: false,
		// 		success: false,
		// 		failure: false,
		// 		set: {	},
		// 		tracklist: []
		// 	}
		// });
	},

	addTrack() {
		var artistName = this.props.appState.get('artist_data').artist;
		var tracklist = this.state.tracklist;
		var tracklistLength = _.size(tracklist);

		if (tracklistLength > 0) {
			var nextStartTime = moment(tracklist[tracklistLength - 1].start_time, 'mm:ss').add(1, 'seconds').format('mm:ss');
		} else {
			var nextStartTime = '00:00';
		}

		var newTracklist = R.clone(tracklist);
		newTracklist[tracklistLength] = {
			'track_id': -1,
			'start_time': nextStartTime,
			'artist': artistName,
			'song': 'untitled'
		};

		this.setState({
			tracklist: newTracklist,
			changes: true,
			tracklistURL: null
		});
	},

	applyChanges() {
		var pendingSet = this.state;

		if (pendingSet.changes) {
			console.log('Pending changes found.');
			var changeFunctions = [];
			if (pendingSet.tile_image.length > 0) {
				changeFunctions.push(this.newImage);
			}
			if (pendingSet.event != this.state.set.event) {
				changeFunctions.push(this.newTitle);
			}
			if (pendingSet.episode != this.state.set.episode) {
				changeFunctions.push(this.newEpisodeTitle);
			}
			// console.log('Comparing tracklists to determine a change...');
			var originalTracklist = R.clone(this.state.set.tracklist);
			var pendingTracklist = this.state.tracklist;
			// console.log('PENDING');
			// console.log(pendingTracklist);
			// console.log('ORIGINAL');
			// console.log(originalTracklist);

			// var tracklistChanged = !(_.isEqual(pendingTracklist, originalTracklist));
			var tracklistChanged = !(R.equals(pendingTracklist, originalTracklist));

			// console.log('Change?');
			// console.log(tracklistChanged);

			if (tracklistChanged) {
				changeFunctions.push(this.newTracks);
			}
			console.log('Changes to do');
			console.log(changeFunctions);
			console.log('Applying changes...');

			this.setState({
				busy: true,
				applying: true
			}, () => {
				async.parallel(changeFunctions, (err, results) => {
					if (err) {
						console.log('There was an error when applying changes to this set.');
						console.log(err);
						this.setState({
							failure: true,
							applying: false,
							notify: true
						}, () => {
							setTimeout(() => {
								this.history.pushState(null, '/');
							}, 1000);
						});
					} else {
							console.log('All changes applied successfully.');
							this.setState({
								applying: false,
								success: true,
								notify: true
							}, () => {
								setTimeout(() => {
									this.history.pushState(null, '/');
								}, 1000);
							});
						}
				});
			});

		} else {
			console.log('No pending changes. Closing window...');
			this.props.close(false);
		}
	},

	cancelChanges() {
		if(this.state.changes) {
			this.setState({
				open: !this.state.open
			});
		} else {
			this.history.pushState(null, '/');
		}
	},

	changeTitleText(event) {
		this.setState({
			event: event.target.value,
			changes: true
		});
	},

	changeTrack(fieldName, newVal, trackIndex) {
		var clonedTracklist = R.clone(this.state.tracklist);
		clonedTracklist[trackIndex][fieldName] = newVal;

		this.setState({
			tracklist: clonedTracklist,
			changes: true,
			tracklistURL: null
		});
	},

	changeTracklistURL(e) {
		this.setState({
			tracklistURL: e.target.value,
			changes: true
		});
	},

	changeEpisodeText(e) {
		this.setState({
			episode: e.target.value,
			changes: true
		});
	},

	componentWillMount() {
		this.getSetById(this.props.params.id);
		this.getTracklist(this.props.params.id);
	},

	componentWillUnmount() {
		if(this.state.changes) {
			this.setState({
				open: true
			});
		}
	},

	deleteTrack(trackIndex) {
		var clonedTracklist = R.clone(this.state.tracklist);
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

	getSetById(id) {
		$.ajax({
			type: 'get',
			url: `${constants.API_ROOT}set/id`,
			data: {
				'setId': [id]
			}
		})
		.done((res) => {
			var set = R.head(res.payload.set);
			this.setState({
				set: set
			}, this.props.push({
					type: 'SHALLOW_MERGE',
					data: {
						header: `Edit Set - ${set.event}`
					}
				})
			);
		})
		.fail((err) => {
			console.error(err);
		});
	},

	getTracklist(id) {
		$.ajax({
			type: 'get',
			url: `${constants.API_ROOT}tracklist/${id}`,
		})
		.done((res) => {
			var tracklist = res.payload.tracks;//returns []
			this.setState({
				tracklist: tracklist
			});
		})
		.fail((err) => {
			console.error(err);
		});
	},

	loadTracksFromURL(event) {
		var self = this;

		//put callback in pull tracks function
		this.pull1001Tracks(function(tracks) {
			if (tracks == null) {
				alert('Please enter a valid 1001 tracklists URL.');
			} else {
				var clonedTracks = R.clone(tracks);
				self.setState({
					tracklist: clonedTracks,
					changes: true
				});
			}
		});
	},

	newEpisodeTitle(callback) {
		// console.log('New episode title pending.');
		// console.log(this.state.episode);
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/episode/' + this.state.episode_id;
		var pendingEpisode = this.state.episode;
		$.ajax({
			type: 'POST',
			url: requestURL,
			data: {
				episode: pendingEpisode
			},
			success: function(res) {
				// console.log('Episode title updated on database.');
				callback(null);
			},
			error: function(err) {
				// console.log('An error occurred when updating episode title on database.');
				callback(err);
			}
		});
	},

	newImage(callback) {
		// console.log('New tile image pending:')
		// console.log(this.state.tile_image);
		async.waterfall([this.registerImageS3, this.updateImageDatabase],
			function(err, results) {
				if (err) {
					// console.log('Error occurred while updating image. ', err);
					callback(err);
				} else {
					// console.log('Tile image updated.');
					callback(null);
				}
			}
		);
	},

	newTitle(callback) {
		// console.log('New set title pending.');
		// console.log(this.state.event);
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/title/' + this.state.set.id;
		var pendingTitle = this.state.event;
		$.ajax({
			type: 'POST',
			url: requestURL,
			data: {
				event: pendingTitle
			}
		})
		.done((res) => {
			callback(null);
		})
		.fail((err) => {
			callback(err);
		});
	},

	newTracks(callback) {
		// console.log('New tracks pending.');
		// console.log(this.state.tracklist);
		var pendingTracklist = this.state.tracklist;
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/tracklist/' + this.state.set.id;
		$.ajax({
			type: 'POST',
			url: requestURL,
			data: {
				tracklist: pendingTracklist
			}
		})
		.done((res) => {
			callback(null);
		})
		.fail((err) => {
			callback(err);
		});
	},

	onDrop(file) {
		if (file[0].type == 'image/png' || file[0].type == 'image/jpeg' || file[0].type == 'image/gif') {
			this.setState({
				tile_image: file,
				changes: true
			});
		} else {
			alert('Please upload a png, jpeg, or gif image.');
		}
	},

	pull1001Tracks(callback) {
		var tracklistURL = this.state.tracklistURL;
		if (tracklistURL == null) {
			callback(null);
		} else {
			var requestURL = 'http://localhost:3000/api/v/7/setrecords/set/tracklist/';
			$.ajax({
				type: 'GET',
				url: requestURL,
				data: {
					tracklist_url: tracklistURL
				},
				success: function(res) {
					if (res.status == 'failure') {
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
	
	registerImageS3(callback) {
		var file = this.state.tile_image[0];
		// console.log('Requesting encoding from AWS...');
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3000/aws/configureAWS?filename=' + encodeURIComponent(file.name),
			contentType: 'application/json',
			success: function(response) {
				// console.log('Encoding successful.');
				AWS.config.update(response.settings);
				var encodedFilename = response.encoded;
				var filesize = file.size;
				var s3 = new AWS.S3();

				s3.timeout = 50000;
				var params = {
					Bucket: 'stredm',
					Key: 'namecheap/' + encodedFilename,
					ContentType: file.type,
					Body: file
				};
				var upload = s3.upload(params);
				// upload.on('httpUploadProgress', function(event) {
				// 	var percentage = (event.loaded / filesize) * 100;
				// 	var percent = parseInt(percentage).toString() + '%';
				// 	console.log('Uploading image: ' + percent);
				// });

				// console.log('Uploading file to S3...');
				upload.send(function(err, data) {
					if (err) {
						// console.log('An error occurred uploading the file to S3.');
						callback(err);
					} else {
						// console.log('Upload successful. File located at: ' + data.Location);
						callback(null, response.encoded);
					}
				});
			},
			error: function(err) {
				// console.log('There was an error encoding the file.');
				callback(err);
			}
		});
	},

	revertChanges() {
		this.replaceState(this.getInitialstate());
	},

	updateImageDatabase(imageURL, callback) {
		// console.log('Adding image to databases...');
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/image/' + this.state.set.id;
		$.ajax({
			type: 'POST',
			url: requestURL,
			data: {
				image_url: imageURL
			}
		})
		.done((res) => {
			// console.log('Image successfully added to database.')
			callback(null);
		})
		.fail((err) => {
			// console.log('Image successfully added to database.')
			callback(err);
		});
	},

	showApplyingStatus() {
		if (this.state.busy) {
			var statusMessage;

			if (this.state.success) {
				statusMessage = 'Your changes have been applied.';
			} else if (this.state.failure) {
				statusMessage = 'There was an error applying your changes. Please try again.';
			} else {
				statusMessage = 'Applying changes...';
			}

			return statusMessage;
		}
	},

	showMixOptions() {
		var episodeName;

		if(this.state.set.is_radiomix) {
			if(this.state.set.episode) {
				episodeName = (
					<div className='center'>
						<h1>Episode Title</h1>
						<input type='text' onChange={this.changeEpisodeText} />
					</div>
				);
			}

			var image = this.state.tile_image.length > 0 ? this.state.tile_image[0].preview : constants.S3_ROOT_FOR_IMAGES+this.state.set.main_eventimageURL;

			return (
				<div className='edit-mix flex-column form-panel'>
					<img src={image} />
					<Dropzone onDrop={this.onDrop} className='dropzone flex-container' multiple={false}>
						<Icon>open_in_browser</Icon>
	  					<p>Upload a new set image</p>
					</Dropzone>
					<div className='center'>
						<h1>Edit Title</h1>
						<input type='text' className='MixTitle' onChange={this.changeTitleText} />
					</div>
					{episodeName}
				</div>
			);
		}
	},

	render() {
		return (
			<div className='flex-column' id='SetEditor'>

				<Motion style={{
					opacity: spring(this.state.notify ? 1 : 0, presets.gentle),
					visibility: this.state.notify ? 'visible' : 'hidden'
				}}>
					{
						({opacity, visibility}) =>
						<Notification dismiss={() => this.history.pushState(null, '/')} style={{
							opacity: `${opacity}`,
							visibility: `${visibility}`
						}}>
							{this.showApplyingStatus()}
						</Notification>
					}
				</Motion>

				<Motion style={{
					opacity: spring(this.state.open ? 1 : 0, presets.gentle),
					visibility: this.state.open ? 'visible' : 'hidden'
				}}>
					{
						({opacity, visibility}) =>
						<ConfirmChanges cancel={() => this.setState({open: false})} style={{
							opacity: `${opacity}`,
							visibility: `${visibility}`
						}}>
							Are you sure you want to leave? All unsaved changes will be lost.
						</ConfirmChanges>
					}
				</Motion>

				{this.showMixOptions()}
				{/*<p className='uploaded-date hidden'>
					Uploaded: {moment(this.state.set.datetime).format('M[/]D[/]YYYY')}
				</p>*/}
		    	<Tracklist 
		    		tracks={this.state.tracklist} 
		    		listURL={this.state.tracklistURL} 
		    		changeTrack={this.changeTrack} 
		    		addTrack={this.addTrack} 
		    		loadTracksFromURL={this.loadTracksFromURL} 
		    		deleteTrack={this.deleteTrack} 
		    		changeTracklistURL={this.changeTracklistURL} />

		    	<div className='flex-row apply-editor form-panel center'>
					<div className='flex-fixed apply flex-container' onClick={this.applyChanges}>
						Apply
					</div>
					<div className='flex-fixed revert flex-container' onClick={this.revertChanges}>
						Revert
					</div>
					<div className='flex-fixed cancel flex-container' onClick={this.cancelChanges}>
						Cancel
					</div>
				</div>

			</div>
		);
	}

});

module.exports = MobileSetEditor;
