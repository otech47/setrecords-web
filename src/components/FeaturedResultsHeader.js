import React from 'react';

var FeaturedResultsHeader = React.createClass({
	getNewLocation: function() {

	},
	render: function() {
		var data = this.props.appState.get('location');
		return (
			<div className="flex-row featured-results-header">
				<div className="flex center">Upcoming Events</div>
				<div className="buffer-2x"></div>
				<div className="flex center flex-row">
					<i className="flex fa fa-map-marker"></i>
					<div className="flex user-location">{data.city}</div>
					<div className="flex change-location" onClick={this.getNewLocation}>
						Change
					</div>
				</div>
			</div>
		);
	}
});

module.exports = FeaturedResultsHeader