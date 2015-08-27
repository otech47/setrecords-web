import React from 'react';
import GlobalEventHandler from '../services/globalEventHandler';
import constants from '../constants/constants';

var BrowseTile = React.createClass({
	displayName: 'BrowseTile',
	_attachStreams: function() {
		 var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div className="browse-tile flex-column overlay-container click view-trigger">
				<div className="overlay set-flex">
					<div className="browse-name center">{this.props.text}</div>
				</div>
				<img className="browse-tile-image" src={constants.S3_ROOT_FOR_IMAGES + this.props.image} />
			</div>
		);
	}
});

module.exports = BrowseTile;
