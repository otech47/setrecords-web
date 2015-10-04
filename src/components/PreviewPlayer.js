var React = require('react/addons');
import _ from 'underscore';
import async from 'async';

var PreviewPlayer = React.createClass({
	render: function() {
		return (
			<div className="preview-player flex-row">
				<button onClick={this.remove}><i className='fa fa-times warning'></i></button>
				<p className='flex'>{(this.props.name.length > 35 ? this.props.name.substring(0, 35) + '...' : this.props.name)}</p>
				{this.showControl()}
			</div>
		);
	},
	play: function(event) {
		this.props.play(this.props.index);
	},
	pause: function(event) {
		this.props.pause(this.props.index);
	},
	remove: function(event) {
		this.props.removeSong(this.props.index);
	},
	showControl: function() {
		if ((this.props.currentTrack == this.props.index) && this.props.isPlaying) {
			return (
				<button onClick={this.pause}>
					<i className='fa fa-pause'></i>
				</button>
			);
		} else {
			return (
				<button className='preview-play' onClick={this.play}>
					<i className='fa fa-play'></i>
				</button>
			);
		}
	}
});

module.exports = PreviewPlayer;
