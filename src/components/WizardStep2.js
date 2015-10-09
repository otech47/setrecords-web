var React = require('react/addons');
var Dropzone = require('react-dropzone');
import PreviewPlayer from './PreviewPlayer';

var WizardStep2 = React.createClass({
	getInitialState: function() {
		return {
			current_audio: null,
			current_track: null,
			is_playing: false
		};
	},
	componentWillUnmount: function() {
		if (this.state.current_audio) {
			URL.revokeObjectURL(this.state.current_audio);
		}
	},
	componentDidMount: function() {
		var player = React.findDOMNode(this.refs.player);
		player.onended = (function(e) {
			this.setState({
				current_audio: null,
				current_track: null,
				is_playing: false
			});
		}).bind(this);
	},
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<audio ref='player' src={this.state.current_audio}>
				</audio>
				<p className='step-info set-flex'>Choose your files to upload. (mp3/wav only)</p>
				<p className='step-info set-flex'>Multiple files will be joined.</p>
				<div className="flex-row step-buttons">
					<Dropzone ref='dropzone' className="hidden" onDrop={this.props.addSongFile} multiple={false} />
					<button className="step-button" onClick={this.browse}>
						Add a file...
					</button>
					<button className='step-button' onClick={this.submitStep}>
						Continue
					</button>
				</div>
				<PreviewPlayer songs={this.props.songs} removeSong={this.removeSong}
				isPlaying={this.state.is_playing} currentTrack={this.state.current_track}
				play={this.play}
				pause={this.pause} />
			</div>
		);
	},
	browse: function(event) {
		this.refs.dropzone.open();
	},
	removeSong: function(index) {
		if (index == this.state.current_track) {
			URL.revokeObjectURL(this.state.current_audio);
			this.setState({
				current_track: null,
				current_audio: null,
				is_playing: false
			});
		} else {
			var newCurrent = (index > this.state.current_track ? this.state.current_track : this.state.current_track - 1);
			this.setState({
				current_track: newCurrent
			});
		}
		this.props.removeSong(index);
	},
	play: function(index) {
		var player = React.findDOMNode(this.refs.player);
		if (index == this.state.current_track) {
			this.setState({
				is_playing: true
			}, function() {
				player.play();
			});
		} else {
			if (this.state.current_audio) {
				URL.revokeObjectURL(this.state.current_audio);
			}
			var newAudio = URL.createObjectURL(this.props.songs[index].file);
			this.setState({
				current_audio: newAudio,
				is_playing: true,
				current_track: index
			}, function() {
				player.play();
			});
		}
	},
	pause: function() {
		var player = React.findDOMNode(this.refs.player);
		this.setState({
			is_playing: false
		}, function() {
			player.pause();
		});
	},
	submitStep: function() {
		if (this.props.songs.length > 0) {
			this.props.stepForward();
		} else {
			alert('Please upload at least one mp3 or wav file to continue.');
		}
	}
});

module.exports = WizardStep2;
