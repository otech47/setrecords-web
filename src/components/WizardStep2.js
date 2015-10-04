var React = require('react/addons');
var Dropzone = require('react-dropzone');
import _ from 'underscore';
import async from 'async';
import PreviewPlayer from './PreviewPlayer';


var WizardStep2 = React.createClass({
	componentWillUnmount: function() {
		URL.revokeObjectURL(this.props.audioObject);
		this.props.donePlaying();
	},
	render: function() {
		var {songs, addSong, stepForward, ...other} = this.props;
		var previews = _.map(songs, function(song, index) {
			return (
				<PreviewPlayer name={song.name} {...other} key={index} index={index} />
			);
		});
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Choose your files to upload. (mp3 only)</p>
				<p className='step-info set-flex'>Multiple files will be joined.</p>
				<div className="flex-row step-buttons">
					<Dropzone ref='dropzone' className="hidden" onDrop={addSong} multiple={true} />
					<button className="step-button" onClick={this.addFiles}>
						Add a file
					</button>
					<button className={'step-button' + (songs.length > 0 ? '':' disabled')} disabled={songs.length > 0 ? false: true} onClick={stepForward}>
						Continue
					</button>
				</div>
				<div className='flex-column preview-column'>
					{previews}
				</div>
			</div>
		);
	},

	addFiles: function(event) {
		this.refs.dropzone.open();
	}
});

module.exports = WizardStep2;
