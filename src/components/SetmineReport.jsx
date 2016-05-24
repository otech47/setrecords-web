import moment from 'moment';
import React from 'react';

import api from '../lib/api';
import Base from './Base';
import CircularProgress from 'material-ui/CircularProgress';
import CohortSelector from './CohortSelector';
import MetricsGraph from './MetricsGraph';
import MetricsToggle from './MetricsToggle';
import TitleCard from './TitleCard';

export default class SetmineReport extends Base {
    constructor(props) {
        super(props);
        this.autoBind('fetchSetmineMetrics', 'toggleVisibility');

        this.state = {
            cohort: 'daily',
            loaded: false,
            metrics: {},
            plays: true,
            views: true,
            favorites: true
        };
    }

    componentDidMount() {
        this.fetchSetmineMetrics({artistId: this.context.artistId});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.artistId !== this.context.artistId) {
            this.fetchSetmineMetrics({artistId: nextContext.artistId});
        }
    }

    render() {
        var metrics = this.state.metrics;
        var visibleMetrics = [];
        if (this.state.plays) {
            visibleMetrics.push(metrics.plays);
        }
        if (this.state.views) {
            visibleMetrics.push(metrics.views);
        }
        if (this.state.favorites) {
            visibleMetrics.push(metrics.favorites);
        }

        var currentPlays = metrics.plays && metrics.plays.current ? metrics.plays.current : 0;
        var currentViews = metrics.views && metrics.views.current ? metrics.views.current : 0;
        var currentFavorites = metrics.favorites && metrics.favorites.current ? metrics.favorites.current : 0;


        return (
            <div id='SetmineReport' className='dashboard-tile column align-center'>
                <TitleCard title='Setmine' iconPath='images/setminelogo.png' />

                <CohortSelector ready={this.state.loaded} onChange={this.fetchSetmineMetrics} />

                <div className='row metrics-toggle'>
                    <MetricsToggle title='plays' metric={currentPlays} onToggle={this.toggleVisibility} />
                    <MetricsToggle title='views' metric={currentViews} onToggle={this.toggleVisibility} />
                    <MetricsToggle title='favorites' metric={currentFavorites} onToggle={this.toggleVisibility} />
                </div>

                {this.state.loaded ?
                    <MetricsGraph metrics={visibleMetrics} />
                    :
                    <CircularProgress />
                }
            </div>
        )
    }

    fetchSetmineMetrics(params) {
        var artistId = params.artistId;
        if (artistId) {
            this.setState({
                loaded: false
            });

            var cohort = params.cohort || 'daily';
            var timezoneOffset = moment().utcOffset();

            var queryString = `{
                artist (id: ${artistId}) {
                    views,
                    favorites,
                    plays
                },
                setmine_metrics (artist_id: ${artistId}) {
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
                }
            }`;

            api.graph({
                query: queryString
            }).then((res) => {
                if (res.payload.artist != null && res.payload.setmine_metrics != null) {
                    var artist = res.payload.artist;
                    var overtime = res.payload.setmine_metrics;

                    return {
                        plays: {
                            current: artist.plays,
                            overtime: overtime.plays
                        },
                        views: {
                            current: artist.views,
                            overtime: overtime.views
                        },
                        favorites: {
                            current: artist.favorites,
                            overtime: overtime.favorites
                        }
                    };
                }
            })
            .then((setmineMetrics) => {
                this.setState({
                    metrics: setmineMetrics
                });
            })
            .then(() => {
                this.setState({
                    loaded: true
                });
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }

    toggleVisibility(metricName) {
        this.setState({
            [metricName]: !this.state[metricName]
        });
    }
}

SetmineReport.contextTypes = {
    artistId: React.PropTypes.number
};
