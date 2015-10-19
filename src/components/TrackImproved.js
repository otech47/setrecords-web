var React = require('react');
import _ from 'underscore';

var Track = React.createClass({
	render: function() {
		return (
		<tr>
			<td>
				<input type="text" name='start_time' value={this.props.startTime} onChange={this.changeTrack} />
			</td>
			<td>
				<input type="text" name='song' value={this.props.song} onChange={this.changeTrack} />
			</td>
			<td>
				<input type="text" name='artist' value={this.props.artist} onChange={this.changeTrack} />
			</td>
			<td>
				<button onClick={this.props.removeTrack}><i className="fa fa-times deleteTrack"></i></button>
			</td>
		</tr>
		);
	},
	changeTrack: function(event) {
		this.props.changeTrack(this.props.index, event.target.name, event.target.value);
	}
});

module.exports = Track;
