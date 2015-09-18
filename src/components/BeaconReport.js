import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;

var BeaconReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;

		var revenueTotal = metrics.revenue.current;
		var revenueChange = revenueTotal - metrics.revenue.last;
		var unlocksTotal = metrics.unlocks.current;
		var unlocksChange = unlocksTotal - metrics.unlocks.last;

		var labels = [];
		var datasets = [];
		for (var i = 0; i < metrics.revenue.overtime.length; i++) {
			labels.push(metrics.revenue.overtime[i].date);
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
		var chartOptions = {
			bezierCurve: false,
			datasetFill: false,
			legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
		};

		return (
		<div className="beacon-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/beacon_icon.png" />
				beacons
			</div>
			<div className="beacon-numbers flex-row">
				<div className="revenue flex-column flex-fixed">
					<p>total revenue</p>
					<h1>${suffixNum(revenueTotal)}</h1>
					<p>yesterday {revenueChange >= 0 ? '+':''}${suffixNum(revenueChange.toFixed(2))}</p>
				</div>
				<div className="unlockedsets flex-column flex-fixed">
					<p>total unlocks</p>
					<h1>{suffixNum(unlocksTotal)}</h1>
					<p>yesterday {unlocksChange >= 0 ? '+':''}{suffixNum(unlocksChange)}</p>
				</div>
			</div>
			<div className="beacon-graph">
				<LineChart data={chartData} className="linechart" options={chartOptions} redraw />
			</div>
		</div>	
		);
	}
});

module.exports = BeaconReport;									