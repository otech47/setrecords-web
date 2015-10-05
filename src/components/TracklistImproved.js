import React from 'react';
import _ from 'underscore';
import TrackImproved from './TrackImproved';

var TracklistImproved = React.createClass({
	render: function() {
		var {linkState, addTrack, loadTracksFromUrl, tracklist, removeTrack, changeTrack, ...other} = this.props;
		var trackComponents;

		if (_.size(tracklist) > 0) {
			var tracks = _.map(tracklist, function(track, index) {
				return (
					<TrackImproved track={track} key={index} removeTrack={removeTrack.bind(null, index)} changeTrack={changeTrack} index={index} />
				);
			});
			trackComponents = (
				<table className="trackiList-table">
					<tbody>
						{tracks}
					</tbody>
				</table>
			);
		} else {
			trackComponents = (
				<p>No tracks found for this set.</p>
			);
		}

		return (
		<div className="edit-set-track flex-column">
			<div>
				<h1>Tracklist  <button id="addTrack" onClick={addTrack}> <i className="fa fa-plus"></i>  add track
				</button>
				</h1>
			</div>
			<div>
				<p>1001 tracklists URL (optional)<button onClick={loadTracksFromUrl}>Load</button></p>
				<input type="text" valueLink={linkState('tracklist_url')} />
			</div>
			{trackComponents}
		</div>
		);
	}
});

module.exports = TracklistImproved;
