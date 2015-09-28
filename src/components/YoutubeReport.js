import React from 'react';
import _ from 'underscore';
var LineChart = require("react-chartjs").Line;
var Loader = require("react-loader");
var moment = require("moment");

var YoutubeReport = React.createClass({
	getInitialState: function() {
		return {
			plays: true,
			followers: true,
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
				self.props.updateYoutube(function(err, metrics) {
					if (err) {
						console.log("An error occurred while loading youtube metrics.");
					} else {
						push({
							type: 'SHALLOW_MERGE',
							data: {
								youtube_metrics: metrics
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
		if ((this.state.plays || this.state.followers) && this.state.loaded) {
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
			for (var i = 0; i < metrics.followers.overtime.length; i++) {
				labels.push(moment(metrics.followers.overtime[i].date, dateGrouping).format(dateFormat));
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
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;
		var playsCurrent = metrics.plays.current;
		var playsChange = metrics.plays.current - metrics.plays.last;
		var followersCurrent = metrics.followers.current;
		var followersChange = metrics.followers.current - metrics.followers.last;
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
		<div className="youtube-report">
			<div className="title flex-row">
				<img src="/public/images/youtube_icon.png" />
				youtube
			</div>
			<div className="time-selector flex-row">
				<p onClick={this.changePeriod} className={this.state.cohort == "daily" ? "active":""} name="daily">daily</p>
				<span>/</span>
				<p onClick={this.changePeriod} className={this.state.cohort == "weekly" ? "active":""} name="weekly">weekly</p>
				<span>/</span>
				<p onClick={this.changePeriod} className={this.state.cohort == "monthly" ? "active":""} name="monthly">monthly</p>
			</div>
			<Loader loaded={this.state.loaded}>
				<div className="youtube-report-inner flex-column">
					<div className="youtube-numbers flex-row">
						<div className={"plays flex-column flex-fixed " + (this.state.plays ? "":"deactivated")} id="plays" onClick={this.toggleData}>
							<p>total plays</p>
							<h1>{suffixNum(playsCurrent)}</h1>
							<p>{previousCohort} {playsChange >= 0 ? '+':''}{suffixNum(playsChange)}</p>
						</div>
						<div className={"followers flex-column flex-fixed " + (this.state.followers ? "":"deactivated")} id="followers" onClick={this.toggleData}>
							<p>total followers</p>
							<h1>{suffixNum(followersCurrent)}</h1>
							<p>{previousCohort} {followersChange >= 0 ? '+':''}{suffixNum(followersChange)}</p>
						</div>
					</div>
					<div className="youtube-graph">
						{this.lineGraph()}
					</div>
				</div>
			</Loader>
		</div>
		);
	}
});

module.exports = YoutubeReport;					