var React = require('react/addons');
var Dropzone = require('react-dropzone');
import _ from 'underscore';
import PreviewPlayer from './PreviewPlayer';
import UtilityFunctions from '../mixins/UtilityFunctions';

var WizardStep2 = React.createClass({
	mixins: [UtilityFunctions],
	componentWillUnmount: function() {
		if (this.state.audio_object) {
			URL.revokeObjectURL(this.state.audio_object);
		}
	},
	getInitialState: function() {
		return {
			is_playing: false,
			current_track: null,
			audio_object: null
		};
	},
	componentDidMount: function() {
		var player = React.findDOMNode(this.refs.player);
		player.onended = this.donePlaying;
	},
	render: function() {
		var {songs, addSong, ...other} = this.props;
		var play = this.play;
		var pause = this.pause;
		var isPlaying = this.state.is_playing;
		var currentTrack = this.state.current_track;
		var removeSong = this.removeSong;
		var secondsToMinutes = this.secondsToMinutes;

		var previews = _.map(songs, function(song, index) {
			var duration = secondsToMinutes(song.duration);
			return (
				<PreviewPlayer name={song.file[0].name} play={play.bind(null, index)} pause={pause.bind(null, index)} duration={duration} removeSong={removeSong.bind(null, index)} isPlaying={isPlaying && (currentTrack == index)} key={index} />
			);
		});
		return (
			<div className="flex-column wizard-step">
				<audio ref='player' src={this.state.audio_object}>
				</audio>
				<p className='step-info set-flex'>Choose your files to upload. (mp3 only)</p>
				<p className='step-info set-flex'>Multiple files will be joined.</p>
				<div className="flex-row step-buttons">
					<Dropzone ref='dropzone' className="hidden" onDrop={addSong} multiple={false} />
					<button className="step-button" onClick={this.addFiles}>
						Add a file...
					</button>
					<button className={'step-button' + (songs.length > 0 ? '':' disabled')} disabled={songs.length > 0 ? false: true} onClick={this.submitStep}>
						Continue
					</button>
				</div>
				<div className='flex-column preview-column'>
					{previews}
				</div>
			</div>
		);
	},

	play: function(index) {
		var player = React.findDOMNode(this.refs.player);
		if (this.state.current_track == index) {
			this.setState({
				is_playing: true
			}, function() {
				player.play();
			});
		} else {
			if (this.state.audio_object) {
				URL.revokeObjectURL(this.state.audio_object);
			}
			var newAudio = URL.createObjectURL(this.props.songs[index].file[0]);
			this.setState({
				audio_object: newAudio,
				is_playing: true,
				current_track: index
			}, function() {
				player.load();
				player.play();
			});
		}
	},

	donePlaying: function() {
		URL.revokeObjectURL(this.state.audio_object);

		this.setState({
			audio_object: null,
			current_track: null,
			is_playing: false
		});
	},

	removeSong: function(index) {
		if (this.state.current_track == index) {
			URL.revokeObjectURL(this.state.audio_object);
			this.setState({
				audio_object: null,
				is_playing: false,
				current_track: null
			});
		} else {
			var newCurrent = (this.state.current_track < index ? this.state.current_track : this.state.current_track - 1);
			this.setState({
				current_track: newCurrent
			});
		}
		this.props.removeSong(index);
	},
	pause: function(index) {
		var player = React.findDOMNode(this.refs.player);
		player.pause();
		this.setState({
			is_playing: false
		});
	},

	submitStep: function(event) {
		var submission = {};
		var setLength = _.reduce(this.props.songs, function(counter, song, index) {
			return counter + song.duration;
		}, 0);
		submission['set_length'] = setLength;
		this.props.stepForward(submission);
	},

	addFiles: function(event) {
		this.refs.dropzone.open();
	}
});

module.exports = WizardStep2;
