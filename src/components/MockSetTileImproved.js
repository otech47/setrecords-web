var React = require('react');
var constants = require('../constants/constants');
import UtilityFunctions from '../mixins/UtilityFunctions';

var MockSetTileImproved = React.createClass({
	mixins: [UtilityFunctions],
	render: function() {
		var backgroundImage;
		if (this.props.image) {
			backgroundImage = this.props.image;
		} else {
			backgroundImage = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
		}
		return (
		<button className="set-tile" >
			<img className="event-image" src={backgroundImage} />
		    <div className="flex-column tile-controls">
	            <div className="flex-column flex-2x set-info">
	                <div>{this.props.artist}</div>
	                <div>{this.props.name}{(this.props.episode && this.props.episode.length > 0) ? " - " + this.props.episode : ""}</div>
	            </div>
	            <div className="divider"></div>
		        <div className="flex-row flex set-stats">
		            <div className="flex-fixed play-count set-flex">
		                <i className="fa fa-play"> {this.props.popularity}</i>
		            </div>
		            <div className="flex-fixed set-length set-flex">
		                <i className="fa fa-clock-o"> {this.secondsToMinutes(this.props.setLength)}</i>
		            </div>
		        </div>
		    </div>
		</button>
		);
	}
});

module.exports = MockSetTileImproved;
