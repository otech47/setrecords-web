import React from 'react';
var moment = require("moment");

var MetricsView = React.createClass({

	componentWillMount: function() {
		this.props.push({
			type: 'SHALLOW_MERGE',
			data: {
				header: 'Metrics'
			}
		});
	},

	render: function() {
		var {appState, push, ...other} = this.props;
		var setmineMetrics = appState.get("setmine_metrics");
		var beaconMetrics = appState.get("beacon_metrics");
		var socialMetrics = appState.get("social_metrics");
		var soundcloudMetrics = appState.get("soundcloud_metrics");
		var youtubeMetrics = appState.get("youtube_metrics");

		return (
			React.cloneElement(this.props.children, {
				appState: appState,
				push: push
			})
		);
	}

});

module.exports = MetricsView;