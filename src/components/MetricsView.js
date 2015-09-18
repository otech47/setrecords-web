import React from 'react';
import SetmineReport from './SetmineReport';
import BeaconReport from './BeaconReport';
import SocialReport from './SocialReport';
import MediaReport from './MediaReport';

var MetricsView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	componentWillMount: function() {
		//load setmine metrics from database
		// var push = this.props.push;
		// var artistId = this.props.appState.get("artistData").id;
		// var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/' 
		// + artistId;
		// var mediaRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/media/' 
		// + artistId;
		// var beaconRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/beacons/' 
		// + artistId;

		// var socialMetrics;
		// var mediaMetrics;
		// var beaconMetrics;
		// var self = this;

		// $.when(
		// 	$.get(socialRequestUrl, function(res) {
		// 		socialMetrics = res.social;
		// 	}),
		// 	$.get(mediaRequestUrl, function(res) {
		// 		mediaMetrics = res.media;
		// 	}),
		// 	$.get(beaconRequestUrl, function(res) {
		// 		beaconMetrics = res.beacons;
		// 	})
		// ).then(function() {
		// 	push({
		// 		type: "SHALLOW_MERGE",
		// 		data: {
		// 			metrics: {
		// 				social: socialMetrics,
		// 				media: mediaMetrics,
		// 				beacons: beaconMetrics
		// 			}
		// 		}
		// 	});
		// });
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
		$.get(setmineRequestUrl, function(res) {
			setmineMetrics = res.setmine;
			push({
				type: "SHALLOW_MERGE",
				data: {
					setmine_metrics: setmineMetrics,
				}
			});
			callback();
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
		$.get(beaconRequestUrl, function(res) {
			beaconMetrics = res.beacons;
			push({
				type: "SHALLOW_MERGE",
				data: {
					beacon_metrics: beaconMetrics
				}
			});
			callback();
		});
	},
	getSocialMetrics: function(params, callback) {
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/' 
		+ artistId;
		var socialMetrics;
		$.get(socialRequestUrl, function(res) {
			socialMetrics = res.social;
			push({
				type: "SHALLOW_MERGE",
				data: {
					social_metrics: socialMetrics
				}
			});
			callback();
		});
	},
	getMediaMetrics: function(params, callback) {
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var mediaRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/media/' 
		+ artistId;
		var mediaMetrics;
		$.get(mediaRequestUrl, function(res) {
			mediaMetrics = res.media;
			push({
				type: "SHALLOW_MERGE",
				data: {
					media_metrics: mediaMetrics
				}
			});
			callback();
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
		var mediaMetrics = this.props.appState.get("media_metrics");

		return (
			<div className="metrics-page flex-column">
				<SetmineReport metrics={setmineMetrics} numberWithSuffix={this.numberWithSuffix} getSetmineMetrics={this.getSetmineMetrics} />
				<BeaconReport metrics={beaconMetrics} numberWithSuffix={this.numberWithSuffix} getBeaconMetrics={this.getBeaconMetrics} />
				<SocialReport metrics={socialMetrics} numberWithSuffix={this.numberWithSuffix} getSocialMetrics={this.getSocialMetrics} />	
				<MediaReport metrics={mediaMetrics} numberWithSuffix={this.numberWithSuffix} getMediaMetrics={this.getMediaMetrics} />
			</div>
		);
	}
});

module.exports = MetricsView;