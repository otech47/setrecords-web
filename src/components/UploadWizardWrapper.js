var React = require('react/addons');
import _ from 'underscore';
var moment = require("moment");
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';
import WizardStep5 from './WizardStep5';
import WizardStep6Beacon from './WizardStep6Beacon';
import WizardStep6Free from './WizardStep6Free';
import WizardStepConfirmation from './WizardStepConfirmation';
var constants = require('../constants/constants');
import UtilityFunctions from '../mixins/UtilityFunctions';
import Joiner from '../services/Joiner';
import async from 'async';

var UploadWizardWrapper = React.createClass({
	mixins: [React.addons.LinkedStateMixin, UtilityFunctions],
	getInitialState: function() {
		var appState = this.props.appState;
		return {
			featured_artists: [],
			current_step: 1,
			set_type: null,
			songs: [],
			set_length: 0,
			tracklist: [],
			name: '',
			episode: '',
			genre: '',
			image: null,
			release_type: null,
			outlets: [],
			price: '0.00',
			pending_file: null,
			temp_url: null,
			track_id: -1,
			upload_status: null
		};
	},
	packageAudio: function(callback) {
		console.log('Registering audio...');
		async.waterfall([this.joinFiles, this.registerS3], function(err, audioUrl) {
			if (err) {
				console.log('An error occurred with packaging audio.');
				console.log(err);
				callback(err);
			} else {
				console.log('Audio registered on S3.');
				console.log(audioUrl);
				callback(null, audioUrl);
			}
		});
	},
	joinFiles: function(callback) {
		var self = this;
		if (this.state.songs.length > 1) {
			console.log('More than one audio file detected. Running joiner...');
			var toJoin = _.map(this.state.songs, function(song, index) {
				return song.file;
			});
			Joiner.combineAudioFiles(toJoin, function(err, joinedBlob) {
				if (err) {
					callback(err);
				}
				console.log('Join successful.');
				var newFilename = self.props.originalArtist + '_joined_' + self.state.songs[0].file.name;
				var joinedFile = new File([joinedBlob], newFilename);
				callback(null, joinedFile);
			});
		} else {
			console.log('Only one file detected. No join needed.');
			callback(null, this.state.songs[0].file);
		}
	},
	registerS3: function(file, callback) {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3000/aws/configureAWS?filename=' + encodeURIComponent(file.name),
			contentType: 'application/json',
			success: function(response) {
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
				upload.on("httpUploadProgress", function(event) {
					var percentage = (event.loaded / filesize) * 100;
					var percent = parseInt(percentage).toString() + "%";
					console.log('Uploading ' + file.type + ' file: ' + percent);
				});

				upload.send(function(err, data) {
					if (err) {
						callback(err);
					} else {
						callback(null, response.encoded);
					}
				});
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	packageImage: function(callback) {
		if (this.state.match_url) {
			console.log('Selected event already exists, so we can use that URL.');
			callback(null, this.state.match_url);
		} else {
			console.log('Image is new and needs to be registered on S3.');
			this.registerS3(this.state.image, function(err, imageUrl) {
				if (err) {
					console.log('An error occurred when uploading new image to S3.');
					callback(err);
				} else {
					console.log('Image successfully registered on S3.');
					callback(null, imageUrl);
				}
			});
		}
	},
	packageRelease: function(callback) {
		console.log('Creating release object...')
		var self = this;
		var releaseObj = {};
		releaseObj['type'] = this.state.release_type;
		if (this.state.release_type == 'Beacon') {
			console.log('This is a beacon release. Packaging venue objects...');
			releaseObj['price'] = this.state.price;
			releaseObj['outlets'] = _.map(this.state.outlets, function(venue, index) {
				return _.findWhere(self.props.venues, {venue: venue});
			});
			console.log('Release package done.');
			callback(null, releaseObj);
		} else {
			console.log('This is a free release. Packaging site names...');
			releaseObj['outlets'] = this.state.outlets;
			console.log('Release package done.');
			callback(null, releaseObj)
		}
	},
	uploadSet: function() {
		console.log('Beginning upload process...');
		var pendingSet = this.state;
		var artists = pendingSet.featured_artists.unshift(this.props.originalArtist);
		var packageFunctions = [
			this.packageAudio,
			this.packageImage,
			this.packageRelease,
			this.packageTitle
		];
		async.parallel(packageFunctions, function(err, packages) {
			var setBundle = {
				audio_url: packages[0],
				image_url: packages[1],
				release: packages[2],
				name: packages[3],
				artists: artists,
				type: pendingSet.set_type,
				tracklist: pendingSet.tracklist,
				genre: pendingSet.genre,
			};
			if (err) {
				console.log(err);
			} else {
				console.log(packages);
			}
			// var requestUrl = 'http://localhost:3000/api/v/7/setrecords/upload/set';
			// $ajax({
			// 	type: 'POST',
			// 	url: requestUrl,
			// 	data: {
			// 		set: setBundle
			// 	},
			// 	success: function(res) {
			// 		console.log("Success.");
			// 		console.log(res);
			// 	},
			// 	error: function(err) {
			// 		console.log("An error occurred when adding set to database.");
			// 		console.log(err);
			// 	}
			// });
		});
	},
	componentDidMount: function() {
		var counter = React.findDOMNode(this.refs.counter);
		counter.onloadedmetadata = (function(e) {
			var duration = counter.duration;
			var newSetLength = _.reduce(this.state.songs, function(counter, song) {
				return counter + song.duration
			}, duration);
			var processedSong = {};
			processedSong.file = this.state.pending_file;
			processedSong.duration = duration;
			URL.revokeObjectURL(this.state.temp_url);
			this.setState({
				pending_file: null,
				temp_url: null,
				songs: React.addons.update(this.state.songs, {$push: [processedSong]}),
				set_length: newSetLength
			});
		}).bind(this);
	},
	render: function() {
		var stepComponent;

		switch(this.state.current_step) {
			case 1:
			stepComponent =
			(<WizardStep1 stepForward={this.stepForward} />);
			break;

			case 2:
			stepComponent =
			(<WizardStep2 songs={this.state.songs}
			stepForward={this.stepForward}
			addSongFile={this.addSongFile}
			removeSong={this.removeSongFile} />);
			break;

			case 3:
			stepComponent = (<WizardStep3 stepForward={this.stepForward}
			setLength={this.state.set_length}
			tracklist={this.state.tracklist}
			addTrack={this.addTrack}
			removeTrack={this.removeTrack}
			changeTrack={this.changeTrack} />);
			break;

			case 4:
			stepComponent = (<WizardStep4 stepForward={this.stepForward}
			originalArtist={this.props.originalArtist}
			linkState={this.linkState}
			type={this.state.set_type}
			events={this.props.events}
			mixes={this.props.mixes}
			genres={this.props.genres}
			image={this.state.image}
			setLength={this.state.set_length}
			addImage={this.addImage}
			eventLookup={this.props.eventLookup}
			featuredArtists={this.state.featured_artists}
			addFeaturedArtist={this.addFeaturedArtist}
			removeFeaturedArtist={this.removeFeaturedArtist}
			changeFeaturedArtist={this.changeFeaturedArtist} />);
			break;

			case 5:
			stepComponent = (<WizardStep5 stepForward={this.stepForward} />);
			break;

			case 6:
			if (this.state.release_type == 'Beacon') {
			stepComponent = (<WizardStep6Beacon	stepForward={this.stepForward}
			linkState={this.linkState}
			venues={this.props.venues}
			toggleOutlet={this.toggleOutlet}
			outlets={this.state.outlets} />);
			} else {
				stepComponent = (<WizardStep6Free stepForward={this.stepForward}
				outlets={this.state.outlets} toggleOutlet={this.toggleOutlet} />);
			}
			break;

			case 7:
			stepComponent = (<WizardStepConfirmation {...this.state} uploadSet={this.uploadSet} originalArtist={this.props.originalArtist} />);
			break;

			default:
			break;
		};

		return (
		<div className='upload-set-wizard flex-column'>
			<audio ref='counter' preload='metadata' src={this.state.temp_url}>
			</audio>
			<div className='wizard-banner set-flex'>
				<p>Upload a Set</p>
			</div>
			<p className='step-counter'>{this.state.current_step < 7 ? 'Step ' + this.state.current_step + ' of 6' : 'Confirmation'}</p>
			<div className={'back-arrow' + (this.state.current_step > 1 ? '':' invisible')} onClick={this.stepBackward}>
				<i className='fa fa-chevron-left'></i> back
			</div>
			<div className='flex wizard-body'>
				{stepComponent}
			</div>
		</div>
		);
	},
	addFeaturedArtist: function() {
		this.setState({
			featured_artists: React.addons.update(this.state.featured_artists, {$push: ['']})
		});
	},
	removeFeaturedArtist: function(index) {
		this.setState({
			featured_artists: React.addons.update(this.state.featured_artists, {$splice: [[index, 1]]})
		});
	},
	changeFeaturedArtist: function(index, event) {
		var updateObj = {};
		updateObj[index] = {
			$set: event.target.value
		};
		this.setState({
			featured_artists: React.addons.update(this.state.featured_artists, updateObj)
		});
	},
	changeTrack: function(index, key, val) {
		var innerUpdate = {};
		innerUpdate[key] = {
			$set: val
		};
		var outerUpdate = {};
		outerUpdate[index] = innerUpdate;
		this.setState({
			tracklist: React.addons.update(this.state.tracklist, outerUpdate)
		});
	},
	addTrack: function() {
		var artist = this.props.originalArtist;
		var tracklist = this.state.tracklist;
		if (tracklist.length == 0) {
			var nextStartTime = '00:00';
		} else {
			var lastStartTime = this.timeStringToSeconds(_.last(tracklist).start_time);
			var nextStartTime = this.secondsToMinutes(lastStartTime + 1);
		}
		var newTrack = {
			'track_id': this.state.track_id,
			'start_time': nextStartTime,
			'artist': artist,
			'song': 'untitled'
		};
		this.setState({
			tracklist: React.addons.update(tracklist, {$push: [newTrack]}),
			track_id: this.state.track_id - 1
		});
	},
	pullTracks: function(url, callback) {
		var tracklistUrl = url;
		if (tracklistUrl == null || tracklistUrl.length == 0) {
			callback(null);
		} else {
			var requestUrl = "http://localhost:3000/api/v/7/setrecords/set/tracklist/";
			$.ajax({
				type: "GET",
				url: requestUrl,
				data: {
					tracklist_url: tracklistUrl
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
	loadTracksFromUrl: function(url) {
		var self = this;
		this.pullTracks(url, function(tracks) {
			if (tracks == null) {
				alert("Please enter a valid 1001 tracklists URL.");
			} else {
				var newTracklist = React.addons.update(self.state.tracklist, {$set: tracks});
				self.setState({
					tracklist: React.addons.update(self.state.tracklist,  {$set: tracks})
				});
			}
		});
	},
	removeTrack: function(index) {
		this.setState({
			tracklist: React.addons.update(this.state.tracklist, {$splice: [[index, 1]]})
		});
	},
	stepForward: function(setData) {
		if (setData) {
			var newData = React.addons.update(setData, {$merge: {current_step: this.state.current_step + 1}});
		} else {
			var newData = {
				current_step: this.state.current_step + 1
			};
		}
		this.setState(newData);
	},
	stepBackward: function() {
		if (this.state.current_step > 1) {
			var newData = {
				current_step: this.state.current_step - 1
			};
			this.setState(newData);
		} else {
			console.log('Nice try, hacker.');
		}
	},
	addSongFile: function(file) {
		if (file[0].type == 'audio/mp3' || file[0].type == 'audio/mpeg' || file[0].type == 'audio/wav') {
			var tempAudio = URL.createObjectURL(file[0]);
			this.setState({
				pending_file: file[0],
				temp_url: tempAudio
			});
		} else {
			alert('Only mp3 and wav files are supported.');
		}
	},
	removeSongFile: function(index) {
		this.setState({
			songs: React.addons.update(this.state.songs, {$splice: [[index, 1]]})
		});
	},
	toggleOutlet: function(outlet) {
		var self = this;
		var index = this.state.outlets.indexOf(outlet);
		if (index >= 0) {
			this.setState({
				outlets: React.addons.update(this.state.outlets, {$splice: [[index, 1]]})
			});
		} else {
			this.setState({
				outlets: React.addons.update(this.state.outlets, {$push: [outlet]})
			});
		}
	},
	addImage: function(file) {
		if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
			this.setState({
				image: file[0]
			});
		} else {
			alert("Please upload a png, jpeg, or gif image.");
		}
	}
});

module.exports = UploadWizardWrapper;
