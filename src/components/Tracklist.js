import React from 'react';
import _ from 'underscore';
import UtilityFunctions from '../mixins/UtilityFunctions';
import Track from './Track';

var Tracklist = React.createClass({

	mixins: [UtilityFunctions],

	render: function() {
		var linkState = this.props.linkState;
		var tracks = this.props.tracks;
		var tracklistURL = this.props.listURL;

		return (
			<div className='flex-column' id='Tracklist'>
				<div className='urlTracklist form-panel'>
					<h1>1001tracklists URL</h1>
					<input type='text' value={tracklistURL} onChange={this.props.loadTracksFromURL} />
					<button onClick={this.props.loadTracksFromURL}>Load</button>		
				</div>
				<div className='tracks flex-column form-panel'>
					<h1>Edit Tracks</h1>
					{this.showTracks()}
					<button onClick={this.props.addTrack}>Add Track</button>
				</div>
			</div>
		);
	},

	showTracks: function() {
		var tracks = this.props.tracks;
		var self = this;

		if(_.size(tracks) > 0) {
			var trackRows = _.map(tracks, (track, index) => {
				var props = {
					track: track,
					key: `${track.track_id}_${index}`,
					index: index,
					changeTrack: this.props.changeTrack,
					deleteTrack: this.props.deleteTrack
				};

				return (
					<Track {...props} />
				);
			});
			return (
				<table className='tracklist'>
					<tbody>
						<tr>
							<th>Time</th>
							<th>Title</th>
							<th>Artist</th>
							<th>Delete</th>
						</tr>
						{trackRows}				
					</tbody>
				</table>
			);
		} else {
			return <p>No tracks found for this set.</p>
		}
	// 	if (_.size(tracks) > 0) {
	// 		var trackRows = _.map(tracks, function(value, key) {
	// 			return (
	// 				<Track track={value} key={value.track_id + '_' + key} index={key} changeTrack={self.props.changeTrack} deleteTrack={self.props.deleteTrack} />
	// 			);
	// 		});
	// 		return (
	// 			<table className='tracklist'>
	// 				<tbody>
	// 					<tr>
	// 						<th>Time MM:SS</th>
	// 						<th>Track Title</th>
	// 						<th>Artist</th>
	// 						<th>Delete</th>
	// 					</tr>
	// 					{trackRows}				
	// 				</tbody>
	// 			</table>
	// 		);
	// 	} else {
	// 		return (
	// 			<p>No tracks found for this set.</p>
	// 		);
	// 	}
	}
});

module.exports = Tracklist;