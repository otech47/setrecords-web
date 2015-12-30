import React from 'react';
import moment from 'moment';
import R from 'ramda';
import {numberWithSuffix} from '../mixins/UtilityFunctions';
import constants from '../constants/constants';

import Loader from 'react-loader';
import {Link} from 'react-router';
import Icon from './Icon';
import Overlay from './Overlay';

var SocialReport = React.createClass({
    getInitialState: function() {
        return {
            twitter: true,
            facebook: true,
            instagram: true
        }
    },

    componentWillMount() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                loaded: false,
                header: 'Metrics'
            }
        })
    },

    componentDidMount() {
        // mixpanel.track("Social Metrics Open");
        this.updateSocial();
        this.checkSocial();
    },

    checkSocial() {
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';

        var query = `{
            artist (id: ${this.props.artistId}) {
                twitter_link,
                fb_link,
                instagram_link
            }
        }`;

        $.ajax({
            type: 'get',
            url: requestUrl,
            data: {
                query: query
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done( (res) => {
            console.log(res);
            this.setState(res.payload.artist);
        })
        .fail( (err) => {
            console.error(err);
        });
    },

    updateSocial() {
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';

        var query = `{
            social_metrics (artist_id: ${this.props.artistId}) {
                twitter_current,
                twitter_last,
                facebook_current,
                facebook_last,
                instagram_current,
                instagram_last
            }
        }`;

        $.ajax({
            type: 'GET',
            url: requestUrl,
            data: {
                query: query
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done( (res) => {
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    socialMetrics: res.payload.social_metrics,
                    loaded: true
                }
            });
        })
        .fail( (err) => {
            console.log(err);
        });
    },

    render() {
        var metrics = this.props.socialMetrics;

        var twitter_current = metrics.twitter_current;
        var twitter_last = metrics.twitter_last;

        var facebook_current = metrics.facebook_current;
        var facebook_last = metrics.facebook_last;

        var instagram_current = metrics.instagram_current;
        var instagram_last = metrics.instagram_last;

        return (
            <div className='metrics-panel flex-row' id='SocialReport'>
                <div className='title flex-row'>
                    <i className='fa fa-users'/>
                    social
                </div>
                <Loader loaded={this.props.loaded}>
                    <div className='panel twitter flex-column flex'>
                        <Overlay icon='plus' hidden={this.state.twitter_link}>
                            Add Link
                        </Overlay>
                        <i className='fa fa-fw fa-twitter center'/>
                        <h1>{numberWithSuffix(twitter_current) || '0'}</h1>
                        <span>total</span>
                        <div className='divider'/>
                        <span>{numberWithSuffix(twitter_last)+' yesterday'}</span>
                    </div>
                    <div className='panel facebook flex-column flex'>
                        <Overlay icon='plus' hidden={this.state.fb_link}>
                            Add Link
                        </Overlay>
                        <i className='fa fa-fw fa-facebook center'/>
                        <h1>{numberWithSuffix(facebook_current) || '0'}</h1>
                        <span>total</span>
                        <div className='divider'/>
                        <span>{numberWithSuffix(facebook_last)+' yesterday'}</span>
                    </div>
                    <div className='panel instagram flex-column flex'>
                        <Overlay icon='plus' hidden={this.state.instagram_link}>
                            Add Link
                        </Overlay>
                        <i className='fa fa-fw fa-instagram center'/>
                        <h1>{numberWithSuffix(instagram_current) || '0'}</h1>
                        <span>total</span>
                        <div className='divider'/>
                        <span>{numberWithSuffix(instagram_last)+' yesterday'}</span>
                    </div>
                </Loader>
            </div>
        );
    }

});

module.exports = SocialReport;
