import React from 'react';
import _ from 'underscore';
var LineChart = require('react-chartjs').Line;
import Loader from 'react-loader';
var moment = require('moment');
import {numberWithSuffix} from '../mixins/UtilityFunctions';

var BeaconReport = React.createClass({
    render() {
        return (
            <div>
                beacon report
            </div>
        )
    }
});

var BeaconReport2 = React.createClass({
    getInitialState() {
        return {
            revenue: true,
            unlocks: true,
            loaded: true,
            cohort: 'daily'
        }
    },

    componentWillMount() {
        this.updateBeacon();
    },

    componentDidMount() {
        mixpanel.track("Beacon Metrics Open");
    },

    toggleData(event) {
        var clicked = {};
        clicked[event.currentTarget.id] = !this.state[event.currentTarget.id];
        this.setState(clicked);
    },

    changePeriod(event) {
        if (this.state.loaded && ($(event.currentTarget).attr('name') != this.state.cohort)) {
            var cohortType = $(event.currentTarget).attr('name');
            var push = this.props.push;

            this.setState({
                loaded: false,
                cohort: cohortType
            }, this.updateBeacon(this.state.cohort));
        }
    },

    lineGraph() {
        if ((this.state.revenue || this.state.unlocks) && this.state.loaded) {
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
            var metrics = this.props.appState.get('beacon_metrics');
            var labels = [];
            var datasets = [];
            for (var i = 0; i < metrics.revenue.overtime.length; i++) {
                labels.push(moment(metrics.revenue.overtime[i].date, dateGrouping).format(dateFormat));
            }
            var colors = ['#9b59b6', '#22a7f0', '#ffffff'];
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

    updateBeacon(params) {
        var cohortType = '';
        if (params != null) {
            cohortType = "?cohortType=" + params;
        }

        var artistId = this.props.appState.get("artist_data").id;
        var beaconRequestUrl = 'https://api.setmine.com/api/v/7/setrecords/metrics/beacons/'
        + artistId + cohortType;
        var beaconMetrics;
        var timezone = moment().utcOffset();

        $.ajax({
            type: 'GET',
            url: beaconRequestUrl,
            data: {timezone: timezone}
        })
        .done((res) => {
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    beacon_metrics: res.beacons
                }
            });
            this.setState({
                loaded: true
            });
        })
        .fail((err) => {
            console.log(err);
        });
    },

    render() {
        var metrics = this.props.appState.get('beacon_metrics');

        var revenueTotal = metrics.revenue.current;
        var revenueChange = revenueTotal - metrics.revenue.last;
        var unlocksTotal = metrics.unlocks.current;
        var unlocksChange = unlocksTotal - metrics.unlocks.last;

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
        <div className='metrics-panel' id='BeaconReport'>
            <div className='title flex-row'>
                <img src='/public/images/beacon_icon.png' />
                beacons
            </div>
            <div className='time-selector flex-row'>
                <p onClick={this.changePeriod} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>day</p>
                <p onClick={this.changePeriod} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>week</p>
                <p onClick={this.changePeriod} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>month</p>
            </div>
            <div className='numbers flex-row'>
                <div className={'toggle revenue flex-column flex-fixed ' + (this.state.revenue ? '':'deactivated')} id='revenue' onClick={this.toggleData}>
                    <h1>${numberWithSuffix(revenueTotal)}</h1>
                    <p>total revenue</p>
                    <p className='hidden'>{previousCohort} {revenueChange >= 0 ? '+':''}${numberWithSuffix(revenueChange.toFixed(2))}</p>
                </div>
                <div className={'toggle unlockedsets flex-column flex-fixed ' + (this.state.unlocks ? '':'deactivated')} id='unlocks' onClick={this.toggleData}>
                    <h1>{numberWithSuffix(unlocksTotal)}</h1>
                    <p>unlocks</p>
                    <p className='hidden'>{previousCohort} {unlocksChange >= 0 ? '+':''}{numberWithSuffix(unlocksChange)}</p>
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

module.exports = BeaconReport;
