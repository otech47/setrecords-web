import React from 'react';
import SetmineReport from './SetmineReport';
import BeaconReport from './BeaconReport';
import SocialReport from './SocialReport';
import MediaReport from './MediaReport';
import SoundcloudReport from './SoundcloudReport';
import YoutubeReport from './YoutubeReport';
var moment = require("moment");

var MetricsView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	getSetmineMetrics: function(params, callback) {
		var cohortType = "";
		if (params != 0) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var setmineRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/setmine/' 
		+ artistId + cohortType;
		var setmineMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: setmineRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				setmineMetrics = res.setmine;
				push({
					type: "SHALLOW_MERGE",
					data: {
						setmine_metrics: setmineMetrics
					}
				});
				callback();
			}
		});
	},
	getSoundcloudMetrics: function(params, callback) {
		var cohortType = "";
		if (params != 0) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var soundcloudRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/soundcloud/' 
		+ artistId + cohortType;
		var soundcloudMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: soundcloudRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				soundcloudMetrics = res.soundcloud;
				push({
					type: "SHALLOW_MERGE",
					data: {
						soundcloud_metrics: soundcloudMetrics
					}
				});
				callback();
			}
		});
	},
	getYoutubeMetrics: function(params, callback) {
		var cohortType = "";
		if (params != 0) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var youtubeRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/youtube/' 
		+ artistId + cohortType;
		var youtubeMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: youtubeRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				youtubeMetrics = res.youtube;
				push({
					type: "SHALLOW_MERGE",
					data: {
						youtube_metrics: youtubeMetrics
					}
				});
				callback();
			}
		});
	},
	getBeaconMetrics: function(params, callback) {
		var cohortType = "";
		if (params != 0) {
			cohortType = "?cohortType=" + params;
		}
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var beaconRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/beacons/' 
		+ artistId + cohortType;
		var beaconMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: beaconRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				beaconMetrics = res.beacons;
				push({
					type: "SHALLOW_MERGE",
					data: {
						beacon_metrics: beaconMetrics
					}
				});
				callback();
			}
		});
	},
	getSocialMetrics: function(params, callback) {
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/' 
		+ artistId;
		var socialMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			url: socialRequestUrl,
			data: {timezone: timezone},
			success: function(res) {
				socialMetrics = res.social;
				push({
					type: "SHALLOW_MERGE",
					data: {
						social_metrics: socialMetrics
					}
				});
				callback();
			}
		});
	},
	_attachStream: function() {
		var _this = this;
	},
	numberWithSuffix : function(number) {
		if (Math.abs(number) >= 1000) {
			var endings = ['', 'K', 'M', 'B', 'T'];
			var count = 0;
			while (Math.abs(number) > 1000.00) {
				number = number / 1000.00;
				count++;
			}
			var output = number.toFixed(1);
			output = output + endings[count];
			return output;

		} else {
			return number;
		}
	},
	render: function() {
		var setmineMetrics = this.props.appState.get("setmine_metrics");
		var beaconMetrics = this.props.appState.get("beacon_metrics");
		var socialMetrics = this.props.appState.get("social_metrics");
		var soundcloudMetrics = this.props.appState.get("soundcloud_metrics");
		var youtubeMetrics = this.props.appState.get("youtube_metrics");

		return (
			<div className="metrics-page flex-column">
				<SetmineReport metrics={setmineMetrics} numberWithSuffix={this.numberWithSuffix} getSetmineMetrics={this.getSetmineMetrics} />
				<BeaconReport metrics={beaconMetrics} numberWithSuffix={this.numberWithSuffix} getBeaconMetrics={this.getBeaconMetrics} />
				<SocialReport metrics={socialMetrics} numberWithSuffix={this.numberWithSuffix} getSocialMetrics={this.getSocialMetrics} />	
				<SoundcloudReport metrics={soundcloudMetrics} numberWithSuffix={this.numberWithSuffix} getSoundcloudMetrics={this.getSoundcloudMetrics} />
				<YoutubeReport metrics={youtubeMetrics} numberWithSuffix={this.numberWithSuffix} getYoutubeMetrics={this.getYoutubeMetrics} />
			</div>
		);
	}
});

module.exports = MetricsView;