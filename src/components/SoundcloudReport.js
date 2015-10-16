import React from 'react';
import _ from 'underscore';
var LineChart = require('react-chartjs').Line;
var Loader = require('react-loader');
var moment = require('moment');

var SoundcloudReport = React.createClass({
	getInitialState() {
		return {
			plays: true,
			followers: true,
			loaded: true,
			cohort: 'daily'
		}
	},

	toggleData(event) {
		var clicked = {};
		clicked[event.currentTarget.id] = !this.state[event.currentTarget.id];
		this.setState(clicked);
	},

	changePeriod(event) {
		if (this.state.loaded && ($(event.currentTarget).attr('name') != this.state.cohort)) {
			var cohortType = $(event.currentTarget).attr('name');
			var self = this;
			var push = this.props.push;
			this.setState({
				loaded: false,
				cohort: cohortType
			}, function() {
				self.props.updateSoundcloud(function(err, metrics) {
					if (err) {
						console.log('An error occurred while loading soundcloud metrics.');
					} else {
						push({
							type: 'SHALLOW_MERGE',
							data: {
								soundcloud_metrics: metrics
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

	lineGraph() {
		if ((this.state.plays || this.state.followers) && this.state.loaded) {
			var dateGrouping;
			var dateFormat;
			switch (this.state.cohort) {
				case 'daily':
				dateGrouping = 'M[/]D[/]YYYY';
				dateFormat = 'M[/]D';
				break;
				case 'weekly':
				dateGrouping = 'w[/]YYYY';
				dateFormat = 'M[/]D';
				break;
				case 'monthly':
				dateGrouping = 'M[/]YYYY';
				dateFormat = 'M[/]YY';
				break;
			}
			var metrics = this.props.metrics;
			var labels = [];
			var datasets = [];
			for (var i = 0; i < metrics.followers.overtime.length; i++) {
				labels.push(moment(metrics.followers.overtime[i].date, dateGrouping).format(dateFormat));
			}
			var colors = ['#ff8800', '#22a7f0'];
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
				scaleLineColor: '#313542',
				scaleLineWidth: 2,
				scaleFontSize: 16,
				scaleFontColor: '#313542',
				scaleShowGridLines: false
			};
			return (<LineChart data={chartData} className='linechart' options={chartOptions} redraw />);
		}
		else {
			return (<p className='not-found'>Click a metric above to show its graph</p>);
		}
	},

	render() {
		var {numberWithSuffix, metrics, ...other} = this.props;
		var playsCurrent = metrics.plays.current;
		var playsChange = metrics.plays.current - metrics.plays.last;
		var followersCurrent = metrics.followers.current;
		var followersChange = metrics.followers.current - metrics.followers.last;
		var previousCohort;
		switch (this.state.cohort) {
			case 'daily':
			previousCohort = 'yesterday';
			break;
			case 'weekly':
			previousCohort = 'last week';
			break;
			case 'monthly':
			previousCohort = 'last month';
			break;
		}	

		return (
		<div className='metrics-panel' id='SoundcloudReport'>
			<div className='title flex-row'>
				<i className='fa fa-soundcloud'/>
				soundcloud
			</div>
			<div className='time-selector flex-row'>
				<p onClick={this.changePeriod} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>daily</p>
				<p onClick={this.changePeriod} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>weekly</p>
				<p onClick={this.changePeriod} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>monthly</p>
			</div>
			<Loader loaded={this.state.loaded}>
				<div className='report-inner flex-column flex'>
					<div className='numbers flex-row'>
						<div className={'toggle plays flex-column flex-fixed ' + (this.state.plays ? '':'deactivated')} id='plays' onClick={this.toggleData}>
							<h1>{numberWithSuffix(playsCurrent)}</h1>
							<p>plays</p>
							<p className='hidden'>{previousCohort} {playsChange >= 0 ? '+':''}{numberWithSuffix(playsChange)}</p>
						</div>
						<div className={'toggle followers flex-column flex-fixed ' + (this.state.followers ? '':'deactivated')} id='followers' onClick={this.toggleData}>
							<h1>{numberWithSuffix(followersCurrent)}</h1>
							<p>followers</p>
							<p className='hidden'>{previousCohort} {followersChange >= 0 ? '+':''}{numberWithSuffix(followersChange)}</p>
						</div>
					</div>
					<div className='graph'>
						{this.lineGraph()}
					</div>
				</div>
			</Loader>
		</div>
		);
	}
});

module.exports = SoundcloudReport;					