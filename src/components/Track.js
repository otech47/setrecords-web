import React from 'react';
import _ from 'underscore';

var Track = React.createClass({
	render: function() {
		var track = this.props.track;
		return (
		<tr>
			<td><input type="text" value={track.start_time} name="start_time" onChange={this.changeTrack} /></td>
			<td><input type="text" value={track.song} name="song" onChange={this.changeTrack} /></td>
			<td><input type="text" value={track.artist} name="artist" onChange={this.changeTrack} /></td>
			<td><button onClick={this.deleteTrack}><i className="fa fa-times deleteTrack"></i></button></td>
		</tr>
		);
	},

	changeTrack: function(event) {
		this.props.changeTrack(event.target.name, event.target.value, this.props.index);
	},
	deleteTrack: function(event) {
		this.props.deleteTrack(this.props.index);
	}
});

module.exports = Track;