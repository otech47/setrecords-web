import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;
var Loader = require("react-loader");

var SetmineReport = React.createClass({
	getInitialState: function() {
		return {
			plays: true,
			views: true,
			favorites: true,
			loaded: false
		}
	},
	componentDidMount: function() {
		this._attachStream();
	},
	componentWillMount: function() {
		var self = this;
		this.props.getSetmineMetrics(0, function() {
			self.setState({
				loaded: true
			});
		});
	},
	_attachStream: function() {
		var _this = this;
	},
	toggleData: function(event) {
		var clicked = {};
		clicked[event.currentTarget.id] = !this.state[event.currentTarget.id];
		this.setState(clicked);
	},
	lineGraph: function() {
		if ((this.state.plays || this.state.views || this.state.favorites) && this.state.loaded) {
			var metrics = this.props.metrics;
			var labels = [];
			var datasets = [];
			for (var i = 0; i < metrics.plays.overtime.length; i++) {
				labels.push(metrics.plays.overtime[i].date);
			}
			var colors = ['#ffffff', '#efc56d', '#40d18f'];
			var counter = 0;
			var self = this;

			_.each(metrics, function(value, key) {
				if (self.state[key]) {
					var points = _.map(value.overtime, function(entry) {
						return entry.count;
					});
					datasets.push({
						label: key,
						data: points,
						strokeColor: colors[counter],
						pointColor: colors[counter]
					});
				}
				counter++;
			});
			var chartData = {
				labels: labels,
				datasets: datasets
			};
			var chartOptions = {
				bezierCurve: false,
				datasetFill: false
			};
			return (<LineChart data={chartData} className="linechart" options={chartOptions} redraw />);
		}
		else {
			return (<p className="not-found">Click a metric above to show its graph</p>);
		}
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

		return (
		<div className="setmine-report">
			<div className="title flex-row">
				<img src="/public/images/setminelogo.png" />
				setmine
			</div>
			<Loader loaded={this.state.loaded}>
				<div className="setmine-report-inner flex-column">
					<div className="setmine-numbers flex-row">
						<div className={"plays flex-column flex-fixed " + (this.state.plays ? "":"deactivated")} id="plays" onClick={this.toggleData}>
							<p>total plays</p>
							<h1>{suffixNum(playsCurrent)}</h1>
							<p>yesterday {playsChange >= 0 ? '+':''}{suffixNum(playsChange)}</p>
						</div>
						<div className={"profileviews flex-column flex-fixed " + (this.state.views ? "":"deactivated")} id="views" onClick={this.toggleData}>
							<p>profile views</p>
							<h1>{suffixNum(viewsCurrent)}</h1>
							<p>yesterday {viewsChange >= 0 ? '+':''}{suffixNum(viewsChange)}</p>
						</div>
						<div className={"favorites flex-column flex-fixed " + (this.state.favorites ? "":"deactivated")} id="favorites" onClick={this.toggleData}>
							<p>favorites</p>
							<h1>{suffixNum(favoritesCurrent)}</h1>
							<p>yesterday {favoritesChange >= 0 ? '+':''}{suffixNum(favoritesChange)}</p>
						</div>
					</div>
					<div className="setmine-graph">
						{this.lineGraph()}
					</div>
				</div>
			</Loader>
		</div>
		);
	}
});

module.exports = SetmineReport;					