var React = require('react/addons');
import _ from 'underscore';
var moment = require("moment");
import WizardStepWrapper from './WizardStepWrapper';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';
import WizardStep5Beacon from './WizardStep5Beacon';
import WizardStep5Free from './WizardStep5Free';
import WizardStepConfirmation from './WizardStepConfirmation';

var UploadWizardWrapper = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getInitialState: function() {
		return {
			type: null,
			release: null,
			current_step: 1,
			event_name: null,
			album_name: null,
			mix_name: null,
			episode_name: null,
			genre: null,
			audio_object: null,
			current_track: null,
			is_playing: false,
			soundcloud: false,
			songs: [],
			image: null,
			tracklist: [],
			tracklist_url : null
		}
	},
	render: function() {
		return (
		<div className='upload-set-wizard flex-column'>
			<div className='wizard-banner set-flex'>
				<p>Upload a Set</p>
			</div>
			<p className='step-counter'>{this.state.current_step < 6 ? 'Step ' + this.state.current_step + ' of 5' : 'Confirmation'}</p>
			<div className={'back-arrow' + (this.state.current_step > 1 ? '':' invisible')} onClick={this.stepBackward}>
				<i className='fa fa-chevron-left'></i> back
			</div>
			<div className='flex wizard-body'>
				{this.showWizardStep()}
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
	showWizardStep: function() {
		switch(this.state.current_step) {
			case 1:
			return (<WizardStep1 stepForward={this.stepForward}/>);
			break;

			case 2:
			return (
				<div>
					<audio ref='wizardPlayer' src={this.state.audio_object} onended={this.donePlaying}>
					</audio>
					<WizardStep2 stepForward={this.stepForward}  songs={this.state.songs} currentTrack={this.state.current_track} play={this.play} pause={this.pause} isPlaying={this.state.is_playing} audioObject={this.state.audio_object} addSong={this.addSong} removeSong={this.removeSong} donePlaying={this.donePlaying} />
				</div>
				);
			break;

			case 3:
			return (
				<WizardStep3 linkState={this.linkState} type={this.state.type} genres={this.props.genres} events={this.props.events} mixes={this.props.mixes} stepForward={this.stepForward} image={this.state.image} addImage={this.addImage} tracklist={this.state.tracklist} changeTrack={this.changeTrack} addTrack={this.addTrack} loadTracksFromURL={this.loadTracksFromURL} deleteTrack={this.deleteTrack} changeTracklistURL={this.changeTracklistURL} tracklistUrl={this.state.tracklistUrl}  />
			);
			break;

			case 4:
			return (
				<WizardStep4 stepForward={this.stepForward} />
			);

			case 5:
			if (this.state.release == 'beacon') {
				return (
					<WizardStep5Beacon stepForward={this.stepForward} />
				);
			} else {
				return (
					<WizardStep5Free stepForward={this.stepForward} soundcloud={this.state.soundcloud} toggleSoundcloud={this.toggleSoundcloud} />
				);
			}
			break;

			case 6:
			return (
				<WizardStepConfirmation setData={this.state} uploadSet={this.uploadSet} />
			);

			default:
			break;
		}
	},

	toggleSoundcloud: function() {
		this.setState({
			soundcloud: !this.state.soundcloud
		});
	},

	donePlaying: function() {
		this.setState({
			is_playing: false,
			current_track: null,
			audio_object: null
		});
	},
	uploadSet: function() {
		console.log("Uploading set...lol");
	},
	addImage: function(file) {
		if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
			this.setState({
				image: file[0].preview
			});
		} else {
			alert("Please upload a png, jpeg, or gif image.");
		}
	},
	addSong: function(songs) {
		var newSongs = React.addons.update(this.state.songs, {$push: songs});
		this.setState({
			songs: newSongs
		});
	},
	removeSong: function(songIndex) {
		var newSongs = _.filter(this.state.songs, function(song, index) {
			return songIndex != index;
		});

		if (songIndex == this.state.current_track) {
			this.setState({
				songs: newSongs,
				current_track: null,
				audio_object: null,
				is_playing: false
			});
		} else {
			var newCurrentTrack = newSongs.indexOf(this.state.songs[this.state.current_track]);
			this.setState({
				songs: newSongs,
				current_track: newCurrentTrack
			});
		}
	},
	play: function(index) {
		var self = this;
		var player = React.findDOMNode(this.refs.wizardPlayer);
		if (index == this.state.current_track) {
			this.setState({
				is_playing: true
			}, function() {
				player.play();
			});
		} else {
			player.pause();
			URL.revokeObjectURL(this.state.audio_object);
			var newAudio = URL.createObjectURL(this.state.songs[index]);
			this.setState({
				audio_object: newAudio,
				current_track: index,
				is_playing: true
			}, function() {
				player.load();
				player.play();
			});
		}
	},
	pause: function() {
		React.findDOMNode(this.refs.wizardPlayer).pause();
		this.setState({
			is_playing: false
		});
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
			tracklist_url: null
		});
	},
	changeTrack: function(fieldName, newVal, trackIndex) {
		var clonedTracklist = this.props.cloneObject(this.state.tracklist);
		clonedTracklist[trackIndex][fieldName] = newVal;

		this.setState({
			tracklist: clonedTracklist,
			tracklist_url: null
		});
	},
	changeTracklistURL: function(event) {
		this.setState({
			tracklist_url: event.target.value
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
			tracklist_url: null
		});
	},
	pullTracks: function(callback) {
		var tracklistURL = this.state.tracklist_url;
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
	}
});

module.exports = UploadWizardWrapper;
