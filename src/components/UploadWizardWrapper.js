var React = require('react/addons');
import _ from 'underscore';
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
		var genres = _.map(this.props.genres, function(genre, index) {
			return (<option value={genre} key={index} />);
		});
		var events = _.map(this.props.events, function(event, index) {
			return (<option value={event} key={index}/>);
		});
		var mixes = _.map(this.props.mixes, function(mix, index) {
			return (<option value={mix} key={index}/>);
		});
		return {
			type: null,
			release: null,
			current_step: 1,
			event_name: null,
			album_name: null,
			mix_name: null,
			episode_name: null,
			genre: null,
			genres: genres,
			mixes: mixes,
			events: events,
			audio_object: null,
			current_track: null,
			is_playing: false,
			soundcloud: false,
			songs: []
		}
	},
	render: function() {
		console.log(this.state);
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
				<WizardStep3 linkState={this.linkState} type={this.state.type} genres={this.state.genres} events={this.state.events} mixes={this.state.mixes} stepForward={this.stepForward} />
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
				<WizardStepConfirmation setData={this.state} />
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
	}
});

module.exports = UploadWizardWrapper;
