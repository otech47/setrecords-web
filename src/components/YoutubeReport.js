import React from 'react';
import _ from 'underscore';
var LineChart = require('react-chartjs').Line;
import Loader from 'react-loader';
// var moment = require('moment');
import moment from 'moment';
import {numberWithSuffix} from '../mixins/UtilityFunctions';

var YoutubeReport = React.createClass({
    getInitialState() {
        return {
            plays: true,
            followers: true,
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
        mixpanel.track("Youtube Metrics Open");
        this.updateYoutube(this.state.cohort);
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
            }, this.updateYoutube(newCohort));
        }
    },

    lineGraph() {
        if ((this.state.plays || this.state.followers) && this.props.loaded) {
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
            var metrics = this.props.youtubeMetrics;
            var labels = [];
            var datasets = [];
            for (var i = 0; i < metrics.followers.overtime.length; i++) {
                labels.push(moment(metrics.followers.overtime[i].date, dateGrouping).format(dateFormat));
            }
            var colors = ['#ff4e4e', '#22a7f0'];
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

    updateYoutube(cohort) {
        var timezoneOffset = moment().utcOffset();
        var query = `{
            youtube_metrics (artist_id: ${this.props.artistId}) {
                plays_overtime (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                },
                plays_current,
                followers_overtime (cohort: \"${cohort}\", timezoneOffset: ${timezoneOffset}) {
                    date,
                    count
                },
                followers_current
            }
        }`;

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';

        $.ajax({
            type: 'get',
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
            var metrics = res.payload.youtube_metrics;

            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    youtubeMetrics: {
                        followers: {
                            current: metrics.followers_current,
                            overtime: metrics.followers_overtime
                        },
                        plays: {
                            current: metrics.plays_current,
                            overtime: metrics.plays_overtime
                        }
                    },
                    loaded: true
                }
            });
        })
        .fail((err) => {
            // console.log(err);
        });
    },

    render() {
        var metrics = this.props.youtubeMetrics;
        var playsCurrent = metrics.plays.current;
        var followersCurrent = metrics.followers.current;

        return (
            <div className='metrics-panel' id='YoutubeReport'>
                <div className='title flex-row'>
                    <i className='fa fa-youtube'/>
                    youtube
                </div>
                <div className='time-selector flex-row'>
                    <p onClick={this.changeCohort.bind(this, 'daily')} className={this.state.cohort == 'daily' ? 'active':''} name='daily'>day</p>
                    <p onClick={this.changeCohort.bind(this, 'weekly')} className={this.state.cohort == 'weekly' ? 'active':''} name='weekly'>week</p>
                    <p onClick={this.changeCohort.bind(this, 'monthly')} className={this.state.cohort == 'monthly' ? 'active':''} name='monthly'>month</p>
                </div>
                <div className='numbers flex-row'>
                    <div className={'toggle plays flex-column flex-fixed ' + (this.state.plays ? '':'deactivated')} id='plays' onClick={this.toggleData.bind(this, 'plays')}>
                        <h1>{numberWithSuffix(playsCurrent)}</h1>
                        <p>plays</p>
                    </div>
                    <div className={'toggle followers flex-column flex-fixed ' + (this.state.followers ? '':'deactivated')} id='followers' onClick={this.toggleData.bind(this, 'followers')}>
                        <h1>{numberWithSuffix(followersCurrent)}</h1>
                        <p>followers</p>
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

module.exports = YoutubeReport;
