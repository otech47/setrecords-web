import React from 'react';

var PreviewTrack = React.createClass({
	render: function() {
		var {play, pause, removeSong, title, duration, isPlaying, ...other} = this.props;
		return (
			<div className='track flex-row'>
				<i className={`fa ${isPlaying ? 'fa-pause':'fa-play'}`} onClick={(isPlaying ? pause : play)}/>
				<p className='flex-fixed' style={{textAlign: 'center'}}>{duration}</p>
				<p className='flex-fixed-3x'>{(title.length > 30 ? title.substring(0, 30) + '...' : title)}</p>
				<i className='fa fa-times warning' onClick={removeSong}/>
			</div>
		);
	}
});

module.exports = PreviewTrack;
