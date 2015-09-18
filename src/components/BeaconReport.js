import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;

var BeaconReport = React.createClass({
	getInitialState: function() {
		return {
			revenue: true,
			unlocks: true
		}
	},
	componentDidMount: function() {
		this._attachStream();
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
		if (this.state.revenue || this.state.unlocks) {
			var metrics = this.props.metrics;
			var labels = [];
			var datasets = [];
			for (var i = 0; i < metrics.revenue.overtime.length; i++) {
				labels.push(metrics.revenue.overtime[i].date);
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

		var revenueTotal = metrics.revenue.current;
		var revenueChange = revenueTotal - metrics.revenue.last;
		var unlocksTotal = metrics.unlocks.current;
		var unlocksChange = unlocksTotal - metrics.unlocks.last;

		return (
		<div className="beacon-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/beacon_icon.png" />
				beacons
			</div>
			<div className="beacon-numbers flex-row">
				<div className={"revenue flex-column flex-fixed " + (this.state.revenue ? "":"deactivated")} id="revenue" onClick={this.toggleData}>
					<p>total revenue</p>
					<h1>${suffixNum(revenueTotal)}</h1>
					<p>yesterday {revenueChange >= 0 ? '+':''}${suffixNum(revenueChange.toFixed(2))}</p>
				</div>
				<div className={"unlockedsets flex-column flex-fixed " + (this.state.unlocks ? "":"deactivated")} id="unlocks" onClick={this.toggleData}>
					<p>total unlocks</p>
					<h1>{suffixNum(unlocksTotal)}</h1>
					<p>yesterday {unlocksChange >= 0 ? '+':''}{suffixNum(unlocksChange)}</p>
				</div>
			</div>
			<div className="beacon-graph">
				{this.lineGraph()}
			</div>
		</div>	
		);
	}
});

module.exports = BeaconReport;									