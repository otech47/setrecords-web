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
		var requestUrl = 'http://setmine.com/api/v/7/artist/metrics/music/' 
		+ this.props.appState.get("artistData").id 
		+'?cohortType=daily&limit=7';
		
		$.ajax({
			type: "GET",
			url: requestUrl,
			success: function(res) {
				push({
					type: "SHALLOW_MERGE",
					data: {
						metrics: {
							setmine: {
								plays: res.payload.metrics.music.set_plays.overtime,
								favorites: res.payload.metrics.music.set_favorites.overtime
							}
						}
					}
				});
			},
			error: function(err) {
				console.log(err);
			}
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
				<SocialReport />
				<MediaReport />
			</div>
		);
	}
});

module.exports = MetricsView;