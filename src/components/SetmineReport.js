import React from 'react';
import _ from 'underscore';
var LineChart = require('react-chartjs').Line;
import Loader from 'react-loader';
var moment = require('moment');
import {numberWithSuffix} from '../mixins/UtilityFunctions';

var SetmineReport = React.createClass({
	getInitialState() {
		return {
			plays: true,
			views: true,
			favorites: true,
			loaded: true,
			cohort: 'daily'
		}
	},

	componentWillMount() {
		this.updateSetmine();
	},

	toggleData(event) {
		var clicked = {};
		clicked[event.currentTarget.id] = !this.state[event.currentTarget.id];
		this.setState(clicked);
	},

	changePeriod(event) {
		if (this.state.loaded && ($(event.currentTarget).attr('name') != this.state.cohort)) {
			var cohortType = $(event.currentTarget).attr('name');

			this.setState({
				loaded: false,
				cohort: cohortType
			}, this.updateSetmine(this.state.cohort));
		}
	},

	lineGraph() {
		if ((this.state.plays || this.state.views || this.state.favorites) && this.state.loaded) {
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
			var metrics = this.props.appState.get('setmine_metrics');
			var labels = [];
			var datasets = [];
			for (var i = 0; i < metrics.plays.overtime.length; i++) {
				labels.push(moment(metrics.plays.overtime[i].date, dateGrouping).format(dateFormat));
			}
			var colors = ['#9b59b6', '#22a7f0', '#36d7b7'];
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

	updateSetmine(params) {
		var cohortType = '';
		if(params != null) {
			cohortType = '?cohortType='+params;
		}

		var artistId = this.props.appState.get("artist_data").id;
		var setmineRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/setmine/'
		+ artistId + cohortType;

		var timezone = moment().utcOffset();
		$.ajax({
			type: 'GET',
			url: setmineRequestUrl,
			data: {timezone: timezone}
		})
		.done((res) => {
			this.props.push({
				type: 'SHALLOW_MERGE',
				data: {
					setmine_metrics: res.setmine
				}
			});
			this.setState({
				loaded: true
			});
		})
		.fail(function(err) {
			console.log(err);
		});
	},

	render() {
		// var {numberWithSuffix, metrics, ...other} = this.props;
		var metrics = this.props.appState.get('setmine_metrics');

		var playsCurrent = metrics.plays.current;
		var playsChange = metrics.plays.current - metrics.plays.last;
		var viewsCurrent = metrics.views.current;
		var viewsChange = metrics.views.current - metrics.views.last;
		var favoritesCurrent = metrics.favorites.current;
		var favoritesChange = metrics.favorites.current - metrics.favorites.last;
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
			<div className='metrics-panel' id='SetmineReport'>
				<div className='title flex-row'>
					<img src='/public/images/setminelogo.png' />
					setmine
				</div>
				<div className='time-selector flex-row'>
					<p onClick={this.changePeriod} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>
						<span>day</span>
					</p>
					<p onClick={this.changePeriod} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>
						<span>week</span>
					</p>
					<p onClick={this.changePeriod} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>
						<span>month</span>
					</p>
				</div>
				<div className='numbers flex-row'>
					<div className={'toggle click plays flex-column flex-fixed ' + (this.state.plays ? '':'deactivated')} id='plays' onClick={this.toggleData}>
						<h1>{numberWithSuffix(playsCurrent)}</h1>
						<p>plays</p>
						<p className='hidden'>{previousCohort} {playsChange >= 0 ? '+':''}{numberWithSuffix(playsChange)}</p>
					</div>
					<div className={'toggle click profileviews flex-column flex-fixed ' + (this.state.views ? '':'deactivated')} id='views' onClick={this.toggleData}>
						<h1>{numberWithSuffix(viewsCurrent)}</h1>
						<p>views</p>
						<p className='hidden'>{previousCohort} {viewsChange >= 0 ? '+':''}{numberWithSuffix(viewsChange)}</p>
					</div>
					<div className={'toggle click favorites flex-column flex-fixed ' + (this.state.favorites ? '':'deactivated')} id='favorites' onClick={this.toggleData}>
						<h1>{numberWithSuffix(favoritesCurrent)}</h1>
						<p>favorites</p>
						<p className='hidden'>{previousCohort} {favoritesChange >= 0 ? '+':''}{numberWithSuffix(favoritesChange)}</p>
					</div>
				</div>
				<Loader loaded={this.state.loaded}>
					<div className='graph'>
						{this.lineGraph()}
					</div>
				</Loader>
			</div>
		);
	}
});

module.exports = SetmineReport;					