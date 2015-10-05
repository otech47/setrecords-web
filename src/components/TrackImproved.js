import React from 'react';
import _ from 'underscore';

var Track = React.createClass({
	render: function() {
		var removeTrack = this.props.removeTrack;
		var linkField = this.linkField;
		return (
		<tr>
			<td><input type="text" valueLink={linkField('start_time')} /></td>
			<td><input type="text" valueLink={linkField('song')} /></td>
			<td><input type="text" valueLink={linkField('artist')} /></td>
			<td><button onClick={removeTrack}><i className="fa fa-times deleteTrack"></i></button></td>
		</tr>
		);
	},

	linkField: function(key) {
		var {changeTrack, track, index, ...other} = this.props;
		return {
			value: track[key],
			requestChange: function(newValue) {
				changeTrack(index, key, newValue);
			}
		};
	}
});

module.exports = Track;
