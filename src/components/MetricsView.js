import React from 'react';
import SetmineReport from './SetmineReport';
import BeaconReport from './BeaconReport';
import SocialReport from './SocialReport';
import MediaReport from './MediaReport';
import SoundcloudReport from './SoundcloudReport';
import YoutubeReport from './YoutubeReport';
var moment = require("moment");

var MetricsView = React.createClass({
	render: function() {
		var {appState, ...other} = this.props;
		var setmineMetrics = appState.get("setmine_metrics");
		var beaconMetrics = appState.get("beacon_metrics");
		var socialMetrics = appState.get("social_metrics");
		var soundcloudMetrics = appState.get("soundcloud_metrics");
		var youtubeMetrics = appState.get("youtube_metrics");

		return (
			<div className="metrics-page flex-column">
				<SetmineReport metrics={setmineMetrics} {...other} />
				<BeaconReport metrics={beaconMetrics} {...other} />
				<SocialReport metrics={socialMetrics} {...other} />	
				<SoundcloudReport metrics={soundcloudMetrics} {...other} />
				<YoutubeReport metrics={youtubeMetrics} {...other} />
			</div>
		);
	}
});

module.exports = MetricsView;