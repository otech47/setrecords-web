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
		+ artistId
		+'?cohortType=daily&limit=7';
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/' 
		+ artistId;
		
		var setmineMetrics;
		var socialMetrics;

		$.when(
			$.get(setmineRequestUrl, function(res) {
				setmineMetrics = res.payload.metrics.setmine;
			}),
			$.get(socialRequestUrl, function(res) {
				socialMetrics = res.payload.metrics.social;
			})
		).then(function() {
			push({
				type: "SHALLOW_MERGE",
				data: {
					metrics: {
						setmine: setmineMetrics,
						social: socialMetrics
					}
				}
			});
		});
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var metrics = this.props.appState.get("metrics");

		return (
			<div className="metrics-page flex-column">
				<SetmineReport metrics={metrics.setmine} />
				<BeaconReport />
				<SocialReport metrics={metrics.social} />				
			</div>
		);
	}
});

module.exports = MetricsView;