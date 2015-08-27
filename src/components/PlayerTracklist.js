var React = require('react')
var PlayerTrack = require('./PlayerTrack')


var PlayerTrackList = React.createClass({
	render: function() {
		return (
			<div className="player-tracklist">
				<PlayerTrack track=''/>
			</div>
		);
	}
})

module.exports = PlayerTrackList