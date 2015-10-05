var React = require('react/addons');

var PreviewPlayer = React.createClass({
	render: function() {
		var {removeSong, isPlaying, play, pause, duration, ...other} = this.props;
		return (
			<div className="preview-player flex-row">
				<button onClick={removeSong}><i className='fa fa-times warning'></i></button>
				<p className='flex'>{(this.props.name.length > 30 ? this.props.name.substring(0, 30) + '...' : this.props.name)}</p>
				<p>{duration}</p>
				<button onClick={(isPlaying ? pause : play)}>
					<i className={'fa ' + (isPlaying ? 'fa-pause':'fa-play')}></i>
				</button>
			</div>
		);
	}
});

module.exports = PreviewPlayer;
