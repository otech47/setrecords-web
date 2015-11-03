import React from 'react';
import _ from 'underscore';

var Track = React.createClass({
	render: function() {
		var track = this.props.track;
		return (
			<tr>
				<td><input type='text' value={track.starttime} placeholder='00:00' name='start_time' onChange={this.changeTrack} /></td>
				<td><input type='text' value={track.songname} placeholder='title' name='song' onChange={this.changeTrack} /></td>
				<td><input type='text' value={track.artistname} placeholder='artist' name='artist' onChange={this.changeTrack} /></td>
				<td><i className='fa fa-times center' onClick={this.deleteTrack}/></td>
			</tr>
		);
	},

	changeTrack: function(event) {
		this.props.changeTrack(this.props.index, event.target.name, event.target.value);
	},

	deleteTrack: function(event) {
		this.props.deleteTrack(this.props.index);
	}
});

module.exports = Track;