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
		var push = this.props.push;
		var artistId = this.props.appState.get("artistData").id;
		var setmineRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/setmine/' 
		+ artistId;
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/' 
		+ artistId;
		var mediaRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/media/' 
		+ artistId;
		var beaconRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/beacons/' 
		+ artistId;
		
		var setmineMetrics;
		var socialMetrics;
		var mediaMetrics;
		var beaconMetrics;

		$.when(
			$.get(setmineRequestUrl, function(res) {
				setmineMetrics = res.setmine;
			}),
			$.get(socialRequestUrl, function(res) {
				socialMetrics = res.social;
			}),
			$.get(mediaRequestUrl, function(res) {
				mediaMetrics = res.media;
			}),
			$.get(beaconRequestUrl, function(res) {
				beaconMetrics = res.beacons;
			})
		).then(function() {
			push({
				type: "SHALLOW_MERGE",
				data: {
					metrics: {
						setmine: setmineMetrics,
						social: socialMetrics,
						media: mediaMetrics,
						beacons: beaconMetrics
					}
				}
			});
		});
	},
	_attachStream: function() {
		var _this = this;
	},
	numberWithSuffix : function(number) {
		if (Math.abs(number) >= 1000) {
			console.log(number);
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
		var metrics = this.props.appState.get("metrics");

		return (
			<div className="metrics-page flex-column">
				<SetmineReport metrics={metrics.setmine} numberWithSuffix={this.numberWithSuffix} />
				<BeaconReport metrics={metrics.beacons} numberWithSuffix={this.numberWithSuffix} />
				<SocialReport metrics={metrics.social} numberWithSuffix={this.numberWithSuffix} />	
				<MediaReport metrics={metrics.media} numberWithSuffix={this.numberWithSuffix} />			
			</div>
		);
	}
});

module.exports = MetricsView;