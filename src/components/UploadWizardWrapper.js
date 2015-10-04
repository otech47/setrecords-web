import React from 'react';
import _ from 'underscore';
import WizardStepWrapper from './WizardStepWrapper';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';

var UploadWizardWrapper = React.createClass({
	getInitialState: function() {
		return {
			type: null,
			current_step: 1,
			'1': null,
			'2': null,
			'3': null,
			'4': null,
			'5': null,
			audio_object: null,
			current_track: null,
			is_playing: false,
			songs: []
		}
	},
	render: function() {
		var appState = this.props.appState;
		return (
		<div className='upload-set-wizard flex-column'>
			<audio ref='wizardPlayer' src={this.state.audio_object} onended={this.donePlaying}>
			</audio>
			<div className='wizard-banner set-flex'>
				<p>Upload a Set</p>
			</div>
			<p className='step-counter'>Step {this.state.current_step} of 5</p>
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
		this.setState(setData);
	},
	stepBackward: function() {
		console.log('going backward');
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
			return (<WizardStep2 stepForward={this.stepForward}  songs={this.state.songs} currentTrack={this.state.current_track} play={this.play} pause={this.pause} isPlaying={this.state.is_playing} audioObject={this.state.audio_object} addSong={this.addSong} removeSong={this.removeSong} />);
			break;

			case 3:
			return (
				<WizardStep3 />
			);
			break;

			default:
			break;
		}
	},

	donePlaying: function() {
		this.setState({
			is_playing: false,
			current_track: null,
			audio_object: null
		});
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

		this.setState({
			songs: newSongs
		});
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
	pause: function(index) {
		React.findDOMNode(this.refs.wizardPlayer).pause();
		this.setState({
			is_playing: false
		});
	}
});

module.exports = UploadWizardWrapper;
