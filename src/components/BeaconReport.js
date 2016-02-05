import React from 'react';
import _ from 'underscore';
var LineChart = require('react-chartjs').Line;
import Loader from 'react-loader';
var moment = require('moment');
import {numberWithSuffix} from '../mixins/UtilityFunctions';

var BeaconReport = React.createClass({
    getInitialState() {
        return {
            revenue: true,
            unlocks: true,
            cohort: 'daily'
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.artistId != this.props.artistId) {
            this.updateBeacon(nextProps.artistId, this.state.cohort);
        }

        return true;
    },

    componentWillMount() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Metrics',
                loaded: false
            }
        });
    },

    componentDidMount() {
        mixpanel.track("Beacon Metrics Open");
        this.updateBeacon(this.props.artistId, this.state.cohort);
    },

    toggleData(metricType) {
        var clicked = {};
        clicked[metricType] = !this.state[metricType];

        this.setState(clicked);
    },

    changeCohort(newCohort) {
        if (this.props.loaded && (newCohort != this.state.cohort)) {
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: false
                }
            });

            this.setState({
                cohort: newCohort
            }, this.updateBeacon(this.props.artistId, newCohort));
        }
    },

    lineGraph() {
        if ((this.state.revenue || this.state.unlocks) && this.props.loaded) {
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
            var metrics = this.props.beaconMetrics;
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

    updateBeacon(artistId, cohort) {
        // console.log('Updating to cohort: ');
        // console.log(cohort);

        var timezoneOffset = moment().utcOffset();
        var query = `{
            beacon_metrics (artist_id: ${artistId}) {
                unlocks (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                },
                revenue (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                }
            },
            artist (id: ${artistId}) {
                unlocks,
                revenue
            }
        }`;

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';

        $.ajax({
            type: 'GET',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                query: query
            }
        })
        .done((res) => {
            if (res.payload.artist !== null && res.payload.beacon_metrics !== null) {
                var overtime = res.payload.beacon_metrics;
                var artist = res.payload.artist;

                var beaconMetrics = {
                    revenue: {
                        current: artist.revenue,
                        last: artist.revenue - _.last(overtime.revenue).count,
                        overtime: overtime.revenue
                    },
                    unlocks: {
                        current: artist.unlocks,
                        last: artist.unlocks - _.last(overtime.unlocks).count,
                        overtime: overtime.unlocks
                    }
                };
                // console.log(beaconMetrics);

                this.props.push({
                    type: 'SHALLOW_MERGE',
                    data: {
                        beaconMetrics: beaconMetrics,
                        loaded: true
                    }
                });
            }
        })
        .fail((err) => {
            // console.log(err);
        });
    },

    render() {
        var metrics = this.props.beaconMetrics;

        var revenueTotal = metrics.revenue.current;
        var unlocksTotal = metrics.unlocks.current;

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
                <img src='/images/beacon_icon.png' />
                beacons
            </div>
            <div className='time-selector flex-row'>
                <p onClick={this.changeCohort.bind(this, 'daily')} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>day</p>
                <p onClick={this.changeCohort.bind(this, 'weekly')} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>week</p>
                <p onClick={this.changeCohort.bind(this, 'monthly')} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>month</p>
            </div>
            <div className='numbers flex-row'>
                <div className={'toggle revenue flex-column flex-fixed ' + (this.state.revenue ? '':'deactivated')} id='revenue' onClick={this.toggleData.bind(this, 'revenue')}>
                    <h1>${numberWithSuffix(revenueTotal)}</h1>
                    <p>total revenue</p>
                </div>
                <div className={'toggle unlockedsets flex-column flex-fixed ' + (this.state.unlocks ? '':'deactivated')} id='unlocks' onClick={this.toggleData.bind(this, 'unlocks')}>
                    <h1>{numberWithSuffix(unlocksTotal)}</h1>
                    <p>unlocks</p>
                </div>
            </div>
            <Loader loaded={this.props.loaded}>
                <div className='graph'>
                    {this.lineGraph()}
                </div>
            </Loader>
        </div>
        );
    }
});

module.exports = BeaconReport;
