var React = require('react');
var Router = require('react-router')
var Route = Router.Route;
var constants = require('../constants/constants');

var SetTile = React.createClass({
	render: function() {
		return (
			<div className="Grid-cell">
				<div className="flex-column set-tile">
					<img className="event-image" src={constants.S3_ROOT_FOR_IMAGES + this.props.set.main_eventimageURL} />
				    <div className="overlay"></div>
				    <div className="buffer-4x"></div>
				    <div className="flex-column flex tile-controls">
				        <div className="flex-row flex">
				            <div className="flex-column flex overlay-container">
				                <img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES+this.props.set.artistimageURL} />
				            </div>
				            <div className="flex-column flex set-info">
				                <div className="center flex">{this.props.set.event}</div>
				                <div className="center flex">{this.props.set.artist}</div>
				            </div>
				        </div>
				        <div className="divider"></div>
				        <div className="flex-row flex-2x">
				            <div className="flex-fixed set-flex play-count">
				                <i className="fa fa-play center"> {this.props.set.popularity}</i>
				            </div>
				            <div className="divider"></div>
				            <div className="flex-fixed set-flex set-length">
				                <i className="fa fa-clock-o center">{this.props.set.set_length}</i>
				            </div>
				        </div>
				    </div>
				</div>
			</div>
		)
	}
})

module.exports = SetTile