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
			track_id: -1
		};
	},
	uploadSet: function() {
		console.log('Beginning upload process...');
		// var pendingSet = this.state;
		// var packageFunctions = [
		// 	this.packageAudio,
		// 	this.packageImage,
		// 	this.packageArtists,
		// 	this.packageRelease,
		// 	this.packageTitle
		// ];
		// async.parallel(packageFunctions, function(err, packages) {
		// 	var setBundle = {
		// 		audio: packages[0],
		// 		image: packages[1],
		// 		artists: packages[2],
		// 		release: packages[3],
		// 		name: packages[4],
		// 		type: pendingSet.set_type,
		// 		tracklist: pendingSet.tracklist,
		// 		genre: pendingSet.genre,
		//
		// 	}
		// 	var requestUrl = 'http://localhost:3000/api/v/7/setrecords/upload/set';
		// 	$ajax({
		// 		type: 'POST',
		// 		url: requestUrl,
		// 		data: {
		//
		// 		}
		// 	})
		// });
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
