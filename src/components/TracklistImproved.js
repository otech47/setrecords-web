var React = require('react/addons');
import _ from 'underscore';
import TrackImproved from './TrackImproved';
import UtilityFunctions from '../mixins/UtilityFunctions';

var TracklistImproved = React.createClass({
	mixins: [UtilityFunctions],
	render: function() {
		var tracks = _.map(this.props.tracklist, (function(track, index) {
			return (<TrackImproved key={track.track_id} removeTrack={this.props.removeTrack.bind(null, index)} startTime={track.start_time}
			song={track.song}
			artist={track.artist}
			index={index}
			changeTrack={this.props.changeTrack} />);
		}).bind(this));

		var trackComponents;
		if (tracks.length == 0) {
			trackComponents = (<p>No tracks found for this set.</p>);
		} else {
			trackComponents = (
				<table className='trackiList-table'>
					<tbody>
						{tracks}
					</tbody>
				</table>
			);
		}

		return (
		<div className="edit-set-track flex-column">
			<div>
				<h1>Tracklist  <button id="addTrack" onClick={this.props.addTrack}> <i className="fa fa-plus"></i>  add track
				</button>
				</h1>
			</div>
			<div>
				<p>1001 tracklists URL (optional)<button onClick={this.loadTracksFromUrl}>Load</button></p>
				<input ref='tracklistUrlField' type='text' placeholder='1001 tracklist link'/>
			</div>
			{trackComponents}
		</div>
		);
	},

	loadTracksFromUrl: function() {
		this.props.loadTracksFromUrl(React.findDOMNode(this.refs.tracklistUrlField).value);
	}
});

module.exports = TracklistImproved;
