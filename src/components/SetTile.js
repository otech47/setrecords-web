var React = require('react');
var Router = require('react-router')
var Route = Router.Route;
var constants = require('../constants/constants');

var SetTile = React.createClass({
	render: function() {
		var setData = this.props.setData;
		return (
		<button className="set-tile">
			<img className="event-image" src={constants.S3_ROOT_FOR_IMAGES+setData.main_eventimageURL} />
			<img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES+setData.artistimageURL} />
		    <div className="flex-column tile-controls">
	            <div className="flex-column flex-2x set-info">
	                <div>{setData.artist}</div>
	                <div>{setData.event}</div>
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