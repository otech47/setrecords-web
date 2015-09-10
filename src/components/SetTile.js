var React = require('react');
var Router = require('react-router')
var Route = Router.Route;
var constants = require('../constants/constants');

var SetTile = React.createClass({
	render: function() {
		return (
			<div className="set-tile">
				<div className="flex-column tile-info">
					<img className="event-image" src={constants.S3_ROOT_FOR_IMAGES+"b0cfe7541f56f971c8b7082689c8da4b3c581e92.jpg"} />
					<div className="overlay"></div>
				    <div className="buffer-4x"></div>
				    <div className="flex-column flex tile-controls">
				        <div className="flex-row  flex">
				            <div className="flex-column flex overlay-container">
				                <img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES+"b7debba3662c51696aa361f98c923893.jpg"} />
				            </div>
				            <div className="flex-column flex set-info">
				                <div className="center flex">{"Calvin Harris"}</div>
				                <div className="center flex">{"EDC Las Vegas 2014"}</div>
				            </div>
				        </div>
				        <div className="divider"></div>
				        <div className="flex-row flex-2x">
				            <div className="flex-fixed set-flex play-count">
				                <i className="fa fa-play center"> { 3185}</i>
				            </div>
				            <div className="divider"></div>
				            <div className="flex-fixed set-flex set-length">
				                <i className="fa fa-clock-o center">{"74:30"}</i>
				            </div>
				        </div>
				    </div>
				</div>
			</div>
		)
	}
})

module.exports = SetTile;