import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;
var Loader = require("react-loader");
var moment = require("moment");

var BeaconReport = React.createClass({
	getInitialState: function() {
		return {
			revenue: true,
			unlocks: true,
			loaded: true,
			cohort: 'daily'
		}
	},
	toggleData: function(event) {
		var clicked = {};
		clicked[event.currentTarget.id] = !this.state[event.currentTarget.id];
		this.setState(clicked);
	},
	changePeriod: function(event) {
		if (this.state.loaded && ($(event.currentTarget).attr("name") != this.state.cohort)) {
			var cohortType = $(event.currentTarget).attr("name");
			var self = this;
			var push = this.props.push;
			this.setState({
				loaded: false,
				cohort: cohortType
			}, function() {
				self.props.updateBeacons(function(err, metrics) {
					if (err) {
						console.log("An error occurred while loading Beacon metrics.");
					} else {
						push({
							type: 'SHALLOW_MERGE',
							data: {
								beacon_metrics: metrics
							}
						});
						self.setState({
							loaded: true
						});
					}
				}, self.state.cohort);
			});
		}
	},
	lineGraph: function() {
		if ((this.state.revenue || this.state.unlocks) && this.state.loaded) {
			var dateGrouping;
			var dateFormat;
			switch (this.state.cohort) {
				case "daily":
				dateGrouping = "M[/]D[/]YYYY";
				dateFormat = "M[/]D";
				break;
				case "weekly":
				dateGrouping = "w[/]YYYY";
				dateFormat = "M[/]D";
				break;
				case "monthly":
				dateGrouping = "M[/]YYYY";
				dateFormat = "M[/]YY";
				break;
			}
			var metrics = this.props.metrics;
			var labels = [];
			var datasets = [];
			for (var i = 0; i < metrics.revenue.overtime.length; i++) {
				labels.push(moment(metrics.revenue.overtime[i].date, dateGrouping).format(dateFormat));
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
				datasetFill: false,
				scaleLineColor: "#2b2b2b",
				scaleLineWidth: 2,
				scaleFontSize: 16,
				scaleFontColor: "#2b2b2b",
				scaleShowGridLines: false
			};
			return (<LineChart data={chartData} className="linechart" options={chartOptions} redraw />);
		}
		else {
			return (<p className="not-found">Click a metric above to show its graph</p>);
		}
	},
	render: function() {
		var {numberWithSuffix, metrics, ...other} = this.props;

		var revenueTotal = metrics.revenue.current;
		var revenueChange = revenueTotal - metrics.revenue.last;
		var unlocksTotal = metrics.unlocks.current;
		var unlocksChange = unlocksTotal - metrics.unlocks.last;

		var previousCohort;
		switch (this.state.cohort) {
			case "daily":
			previousCohort = "yesterday";
			break;
			case "weekly":
			previousCohort = "last week";
			break;
			case "monthly":
			previousCohort = "last month";
			break;
		}	

		return (
		<div className="beacon-report">
			<div className="title flex-row">
				<img src="/public/images/beacon_icon.png" />
				beacons
			</div>
			<div className="time-selector flex-row">
				<p onClick={this.changePeriod} className={this.state.cohort == "daily" ? "active":""} name="daily">daily</p>
				<span>/</span>
				<p onClick={this.changePeriod} className={this.state.cohort == "weekly" ? "active":""} name="weekly">weekly</p>
				<span>/</span>
				<p onClick={this.changePeriod} className={this.state.cohort == "monthly" ? "active":""} name="monthly">monthly</p>
			</div>
			<Loader loaded={this.state.loaded}>
				<div className="beacon-report-inner flex-column">
					<div className="beacon-numbers flex-row">
						<div className={"revenue flex-column flex-fixed " + (this.state.revenue ? "":"deactivated")} id="revenue" onClick={this.toggleData}>
							<p>total revenue</p>
							<h1>${numberWithSuffix(revenueTotal)}</h1>
							<p>{previousCohort} {revenueChange >= 0 ? '+':''}${numberWithSuffix(revenueChange.toFixed(2))}</p>
						</div>
						<div className={"unlockedsets flex-column flex-fixed " + (this.state.unlocks ? "":"deactivated")} id="unlocks" onClick={this.toggleData}>
							<p>total unlocks</p>
							<h1>{numberWithSuffix(unlocksTotal)}</h1>
							<p>{previousCohort} {unlocksChange >= 0 ? '+':''}{numberWithSuffix(unlocksChange)}</p>
						</div>
					</div>
					<div className="beacon-graph">
						{this.lineGraph()}
					</div>
				</div>
			</Loader>
		</div>	
		);
	}
});

module.exports = BeaconReport;									