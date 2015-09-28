import React from 'react';
import _ from 'underscore';
import Track from './Track';

var Tracklist = React.createClass({
	render: function() {
		var tracks = this.props.tracks;
		var tracklistURL = this.props.listURL;

		return (
		<div className="edit-set-track flex-column">
			<div>
				<h1>Tracklist  <button id="addTrack" onClick={this.props.addTrack}> <i className="fa fa-plus"></i>  add track   
				</button>
				</h1>
			</div>
			<div>
				<p>1001 tracklists URL (optional)<button onClick={this.props.loadTracksFromURL}>Load</button></p>
				<input type="text" value={tracklistURL} onChange={this.props.changeTracklistURL} />
			</div>
			{this.showTracks()}
		</div>
		);
	},

	showTracks: function() {
		var tracks = this.props.tracks;
		var self = this;
		if (_.size(tracks) > 0) {
			var trackRows = _.map(tracks, function(value, key) {
				return (
					<Track track={value} key={value.track_id + "_" + key} index={key} changeTrack={self.props.changeTrack} deleteTrack={self.props.deleteTrack} />
				);
			});
			return (
			<table className="trackiList-table">
				<tbody>
					{trackRows}				
				</tbody>
			</table>
			);
		} else {
			return (
				<p>No tracks found for this set.</p>
			);
		}
	}
});

module.exports = Tracklist;