import React from 'react';
var constants = require('../constants/constants');

var DetailImageContainer = React.createClass({
	render: function() {
		var imageStyle = {
				background: "url('" + constants.S3_ROOT_FOR_IMAGES + this.props.imageURL + "')",
				backgroundSize: '100%'
		}
		return (
			<div className="flex-column flex image-container overlay-container" style={imageStyle}>
				<div className="overlay"/>
				<div className="buffer"/>
				<div className="header center artist-name">{title}</div>
				<div className="header-small center">{info}</div>
				<div className="buffer"/>
				<div className="header-small center click" id="detail-button">{this.props.buttonText || null}</div>
				<div className="buffer"/>
			</div>
		);
	}
	
});

module.exports = DetailImageContainer;