var React = require('react');

var PreviewTrack = React.createClass({
	render: function() {
		var {play, pause, removeSong, title, duration, isPlaying, ...other} = this.props;
		return (
			<div className="preview-player flex-row">
				<button onClick={removeSong}><i className='fa fa-times warning'></i></button>
				<p className='flex'>{(title.length > 30 ? title.substring(0, 30) + '...' : title)}</p>
				<p>{duration}</p>
				<button onClick={(isPlaying ? pause : play)}>
					<i className={'fa ' + (isPlaying ? 'fa-pause':'fa-play')}></i>
				</button>
			</div>
		);
	}
});

module.exports = PreviewTrack;
