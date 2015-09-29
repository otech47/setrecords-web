var React = require('react');
var constants = require('../constants/constants');

var SetTile = React.createClass({
	tileClick: function() {
		this.props.openSetEditor(this.props.setData);
	},
	render: function() {
		var setData = this.props.setData;
		var backgroundImageURL = setData.main_eventimageURL;
		if (setData.is_radiomix && setData.episode) {
			backgroundImageURL = setData.episode_imageURL;
		}
		return (
		<button className="set-tile" onClick={this.tileClick} >
			<img className="event-image" src={constants.S3_ROOT_FOR_IMAGES+backgroundImageURL} />
		    <div className="flex-column tile-controls">
	            <div className="flex-column flex-2x set-info">
	                <div>{setData.artist}</div>
	                <div>{setData.event}{(setData.episode && setData.episode.length > 0) ? " - " + setData.episode : ""}</div>
	            </div>
	            <div className="divider"></div>
		        <div className="flex-row flex set-stats">
		            <div className="flex-fixed play-count set-flex">
		                <i className="fa fa-play"> {setData.popularity}</i>
		            </div>
		            <div className="flex-fixed set-length set-flex">
		                <i className="fa fa-clock-o">{setData.set_length}</i>
		            </div>
		        </div>
		    </div>
		</button>
		);
	}
});

module.exports = SetTile;