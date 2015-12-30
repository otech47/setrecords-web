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
            cohort: 'daily'
        }
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
        // mixpanel.track("Setmine Metrics Open");
        this.updateSetmine(this.state.cohort);
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
            }, this.updateSetmine(newCohort));
        }
    },

    lineGraph() {
        if ((this.state.plays || this.state.views || this.state.favorites) && this.props.loaded) {
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
            var metrics = this.props.setmineMetrics;
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

    updateSetmine(cohort) {
        console.log('Updating to cohort: ');
        console.log(cohort);

        var timezoneOffset = moment().utcOffset();
        var query = `{
            setmine_metrics (artist_id: ${this.props.artistId}) {
                plays (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                },
                views (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                },
                favorites (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                }
            },
            artist (id: ${this.props.artistId}) {
                views,
                favorites,
                plays
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
            var overtime = res.payload.setmine_metrics;
            var artist = res.payload.artist;

            var setmineMetrics = {
                plays: {
                    current: artist.plays,
                    last: artist.plays - _.last(overtime.plays).count,
                    overtime: overtime.plays
                },
                views: {
                    current: artist.views,
                    last: artist.views - _.last(overtime.views).count,
                    overtime: overtime.views
                },
                favorites: {
                    current: artist.favorites,
                    last: artist.favorites - _.last(overtime.favorites).count,
                    overtime: overtime.favorites
                }
            }

            console.log(setmineMetrics);

            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    setmineMetrics: setmineMetrics,
                    loaded: true
                }
            });
        })
        .fail((err) => {
            console.log(err);
        });
    },

    render() {
        // var {numberWithSuffix, metrics, ...other} = this.props;
        var metrics = this.props.setmineMetrics;

        var playsCurrent = metrics.plays.current;
        var viewsCurrent = metrics.views.current;
        var favoritesCurrent = metrics.favorites.current;

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
                    <i className='fa icon-setmine center'/>
                    setmine
                </div>
                <div className='time-selector flex-row'>
                    <p onClick={this.changeCohort.bind(this, 'daily')} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>
                        <span>day</span>
                    </p>
                    <p onClick={this.changeCohort.bind(this, 'weekly')} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>
                        <span>week</span>
                    </p>
                    <p onClick={this.changeCohort.bind(this, 'monthly')} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>
                        <span>month</span>
                    </p>
                </div>
                <div className='numbers flex-row'>
                    <div className={'toggle click plays flex-column flex-fixed ' + (this.state.plays ? '':'deactivated')} id='plays' onClick={this.toggleData.bind(this, 'plays')}>
                        <h1>{numberWithSuffix(playsCurrent)}</h1>
                        <p>plays</p>
                    </div>
                    <div className={'toggle click profileviews flex-column flex-fixed ' + (this.state.views ? '':'deactivated')} id='views' onClick={this.toggleData.bind(this, 'views')}>
                        <h1>{numberWithSuffix(viewsCurrent)}</h1>
                        <p>views</p>
                    </div>
                    <div className={'toggle click favorites flex-column flex-fixed ' + (this.state.favorites ? '':'deactivated')} id='favorites' onClick={this.toggleData.bind(this, 'favorites')}>
                        <h1>{numberWithSuffix(favoritesCurrent)}</h1>
                        <p>favorites</p>
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

module.exports = SetmineReport;
