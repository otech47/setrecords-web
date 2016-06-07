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
            cohort: 'daily',
            followers: true,
            loaded: false,
            plays: true
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.artistId != this.props.artistId) {
            this.updateYoutube(nextProps.artistId, this.state.cohort);

            return true;
        }

        if (!_.isEqual(nextState, this.state)) {
            return true;
        }

        return false;
    },

    componentDidMount() {
        this.updateYoutube(this.props.artistId, this.state.cohort);
    },

    toggleData(metricType) {
        var clicked = {};
        clicked[metricType] = !this.state[metricType];

        this.setState(clicked);
    },

    changeCohort(newCohort) {
        if (this.state.loaded && (newCohort != this.state.cohort)) {
            this.setState({
                cohort: newCohort,
                loaded: false
            }, this.updateYoutube(this.props.artistId, newCohort));
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
            var metrics = this.props.youtubeMetrics;
            var labels = [];
            var datasets = [];
            for (var i = 0; i < metrics.followers.overtime.length; i++) {
                labels.push(moment(metrics.followers.overtime[i].date).format(dateFormat));
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

    updateYoutube(artistId, cohort) {
        var timezoneOffset = moment().utcOffset();
        var query = `{
            youtube_metrics (artist_id: ${artistId}) {
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

        var requestUrl = 'https://api.setmine.com/v/11/graph';

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
            if (res.data.youtube_metrics !== null) {
                var metrics = res.data.youtube_metrics;

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
                        }
                    }
                });

                this.setState({
                    loaded: true
                });
            }
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
                <Loader loaded={this.state.loaded}>
                    <div className='graph'>
                        {this.lineGraph()}
                    </div>
                </Loader>
            </div>
        );
    }
});

module.exports = YoutubeReport;
