import React from 'React';
import constants from '../constants/constants';

var TrackTile = React.createClass({
	render: function() {
		var image = {
			background: "url('"+constants.S3_ROOT_FOR_IMAGES+this.props.data.main_eventimageURL+"')",
			backgroundSize: '100% 100%'
		}
		return (
			<div className="track-tile flex-column flex overlay-container" style={image} >
			    <div className="overlay"></div>
			    <div className="flex-column flex">
			        <div className="track-name">{this.props.data.songname}</div>
			        <div className="track-artist">{this.props.data.artistname}</div>
			        <i className="fa fa-play fa-2x click animated"></i>
			        <div className="track-time center">{this.props.data.starttime+' | '+this.props.data.set_length}</div>
			    </div>
			    <div className="tile-controls flex-column">
			        <div className="set-name click view-trigger">{this.props.data.event}</div>
			        <div className="artist-name click view-trigger">{this.props.data.artist}</div>
			    </div>
			</div>
		);
	}
})

module.exports = TrackTile;