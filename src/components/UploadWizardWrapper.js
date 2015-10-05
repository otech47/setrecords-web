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

var UploadWizardWrapper = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState: function() {
		return {
			current_step: 1,
			set_type: null,
			songs: [],
			artist: this.props.appState.get('artist_data').artist,
			tracklist: [],
			tracklist_url : null,
			name: null,
			episode: null,
			genre: null,
			image: [],
			release_type: null,
			outlets: [],
			set_length: 0,
			pending_song: null,
			temp_url: null
		};
	},
	componentDidMount: function() {
		var counter = React.findDOMNode(this.refs.counter);
		counter.onloadedmetadata = (function(e) {
			var duration = counter.duration;
			var processedSong = {};
			processedSong.file = this.state.pending_song;
			processedSong.duration = duration;
			URL.revokeObjectURL(this.state.temp_url);
			this.setState({
				pending_song: null,
				temp_url: null,
				songs: React.addons.update(this.state.songs, {$push: [processedSong]})
			});
		}).bind(this);
	},
	render: function() {
		var linkState = this.linkState;
		var stepForward = this.stepForward;

		var stepComponent;
		switch(this.state.current_step) {
			case 1:
			stepComponent = (<WizardStep1 stepForward={stepForward} />);
			break;

			case 2:
			var songFunctions = {};
			songFunctions.addSong = this.addSong;
			songFunctions.removeSong = this.removeSong;

			stepComponent = (<WizardStep2 songs={this.state.songs} stepForward={stepForward} {...songFunctions} />);
			break;

			case 3:
			var tracklistFunctions = {};
			tracklistFunctions.addTrack = this.addTrack;
			tracklistFunctions.removeTrack = this.removeTrack;
			tracklistFunctions.loadTracksFromUrl = this.loadTracksFromUrl;
			tracklistFunctions.changeTrack = this.changeTrack;

			stepComponent = (<WizardStep3 stepForward={stepForward} linkState={linkState} {...tracklistFunctions} tracklist={this.state.tracklist} />);
			break;

			case 4:
			var dbInfo = {};
			dbInfo.events = this.props.events;
			dbInfo.mixes = this.props.mixes;
			dbInfo.genres = this.props.genres;

			stepComponent = (<WizardStep4 stepForward={stepForward} linkState={linkState} image={this.state.image} setLength={this.state.set_length} type={this.state.set_type} addImage={this.addImage} {...dbInfo} />);
			break;

			case 5:
			stepComponent = (<WizardStep5 />);
			break;

			case 6:
			if (this.state.release_type == 'beacon') {
				stepComponent = (<WizardStep6Beacon />);
			} else {
				stepComponent = (<WizardStep6Free />)
			}
			break;

			case 7:
			stepComponent = (<WizardStepConfirmation />);
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
	stepForward: function(setData) {
		var newData = {};
		var nextStep = this.state.current_step + 1;
		newData['current_step'] = nextStep;
		if (setData != null) {
			_.each(setData, function(value, key) {
				newData[key] = value;
			});
		}
		this.setState(newData);
	},
	stepBackward: function() {
		var previousStep = this.state.current_step - 1;
		this.setState({
			current_step: previousStep
		});
	},

	toggleSoundcloud: function() {
		this.setState({
			soundcloud: !this.state.soundcloud
		});
	},
	uploadSet: function() {
		console.log("Uploading set...lol");
	},
	addSong: function(song) {
		var tempUrl = URL.createObjectURL(song[0]);
		this.setState({
			temp_url: tempUrl,
			pending_song: song
		});
	},
	removeSong: function(index) {
		this.setState({
			songs: React.addons.update(this.state.songs, {$splice: [[index, 1]]})
		});
	},
	addImage: function(file) {
		if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
			this.setState({
				image: file
			});
		} else {
			alert("Please upload a png, jpeg, or gif image.");
		}
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
		var newTrack = {
			'track_id': -1,
			'start_time': nextStartTime,
			'artist': artistName,
			'song': 'untitled'
		};

		this.setState({
			tracklist: React.addons.update(tracklist, {$push: [newTrack]}),
			tracklist_url: null
		});
	},
	changeTrack: function(index, key, value) {
		var innerUpdate = {};
		innerUpdate[key] = {
			$set: value
		};
		var updateObject = {};
		updateObject[index] = innerUpdate;
		this.setState({
			tracklist: React.addons.update(this.state.tracklist, updateObject),
			tracklist_url: null
		});
	},
	removeTrack: function(index) {
		this.setState({
			tracklist: React.addons.update(this.state.tracklist, {$splice: [[index, 1]]}),
			tracklist_url: null
		});
	},
	pullTracks: function(callback) {
		var tracklistUrl = this.state.tracklist_url;
		if (tracklistUrl == null) {
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
	loadTracksFromUrl: function(event) {
		var self = this;
		this.pullTracks(function(tracks) {
			if (tracks == null) {
				alert("Please enter a valid 1001 tracklists URL.");
			} else {
				self.setState({
					tracklist: React.addons.update(self.state.tracklist, {$set: tracks})
				});
			}
		});
	}
});

module.exports = UploadWizardWrapper;
