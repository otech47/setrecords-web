import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;

var SetmineReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;

		var playsCurrent = metrics.plays.current;
		var playsChange = metrics.plays.current - metrics.plays.last;
		var viewsCurrent = metrics.views.current;
		var viewsChange = metrics.views.current - metrics.views.last;
		var favoritesCurrent = metrics.favorites.current;
		var favoritesChange = metrics.favorites.current - metrics.favorites.last;
		
		var labels = [];
		var datasets = [];
		for (var i = 0; i < metrics.plays.overtime.length; i++) {
			labels.push(metrics.plays.overtime[i].date);
		}
		var colors = ['#ffffff', '#efc56d', '#40d18f'];
		var counter = 0;

		_.each(metrics, function(value, key) {
			var points = _.map(value.overtime, function(entry) {
				return entry.count;
			});
			datasets.push({
				label: key,
				data: points,
				strokeColor: colors[counter],
				pointColor: colors[counter]
			});
			counter++;
		});
		var chartData = {
			labels: labels,
			datasets: datasets
		};

		return (
		<div className="setmine-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/setminelogo.png" />
				setmine
			</div>
			<div className="setmine-numbers flex-row">
				<div className="plays flex-column flex-fixed">
					<p>total plays</p>
					<h1>{suffixNum(playsCurrent)}</h1>
					<p>yesterday {playsChange >= 0 ? '+':''}{suffixNum(playsChange)}</p>
				</div>
				<div className="profileviews flex-column flex-fixed">
					<p>profile views</p>
					<h1>{suffixNum(viewsCurrent)}</h1>
					<p>yesterday {viewsChange >= 0 ? '+':''}{suffixNum(viewsChange)}</p>
				</div>
				<div className="favorites flex-column flex-fixed">
					<p>favorites</p>
					<h1>{suffixNum(favoritesCurrent)}</h1>
					<p>yesterday {favoritesChange >= 0 ? '+':''}{suffixNum(favoritesChange)}</p>
				</div>
			</div>
			<div className="setmine-graph">
				<LineChart data={chartData} className="linechart" redraw />
			</div>
		</div>
		);
	}
});

module.exports = SetmineReport;					