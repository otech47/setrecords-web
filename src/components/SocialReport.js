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
    render() {
        return (
            <div>
                social report
            </div>
        )
    }
});

var SocialReport2 = React.createClass({

	getInitialState() {
		return ({
			loaded: false
		});
	},

	componentWillMount() {
		this.updateSocial();
		this.checkSocial();
	},

	componentDidMount() {
		mixpanel.track("Social Metrics Open");
	},

	checkSocial() {
		var artistId = this.props.appState.get("artist_data").id;
		var artistRequest = constants.API_ROOT+'artist/'+artistId;

		$.ajax({
			type: 'get',
			url: artistRequest
		})
		.done(res => {
			var links = res.payload.artist.links;
			var isEmpty = link => {
				return R.last(link).length == 0;
			};
			var emptyLinks = R.fromPairs(R.filter(isEmpty, R.toPairs(links)));
			var emptyKeys = R.keys(emptyLinks);

			var newState = {};
			emptyKeys.forEach(key => {
				newState[key] = false;
			});

			this.setState(newState);
			console.log(this.state);
		})
		.fail(err => {
			console.error(err);
		});
	},

	updateSocial(params) {
		var artistId = this.props.appState.get("artist_data").id;
		var socialRequestUrl = 'https://api.setmine.com/api/v/7/setrecords/metrics/social/'
		+ artistId;
		var socialMetrics;
		var timezone = moment().utcOffset();

		$.ajax({
			type: 'GET',
			url: socialRequestUrl,
			data: {timezone: timezone}
		})
		.done(res => {
			this.props.push({
				type: 'SHALLOW_MERGE',
				data: {
					social_metrics: res.social
				}
			});
			this.setState({
				loaded: true
			});
		})
	},

	render() {
		var metrics = this.props.appState.get('social_metrics');

		var twitterMetrics = metrics.twitter;
		var twitter_current = twitterMetrics.current;
		var twitter_last = twitterMetrics.last;

		var facebookMetrics = metrics.facebook;
		var facebook_current = facebookMetrics.current;
		var facebook_last = facebookMetrics.last;

		var instagramMetrics = metrics.instagram;
		var instagram_current = instagramMetrics.current;
		var instagram_last = instagramMetrics.last;

		return (
			<div className='metrics-panel flex-row' id='SocialReport'>
				<div className='title flex-row'>
					<i className='fa fa-users'/>
					social
				</div>
				<Loader loaded={this.state.loaded}>
					<div className='panel twitter flex-column flex'>
						<Overlay icon='plus' hidden={this.state.twitter}>
							Add Link
						</Overlay>
						<i className='fa fa-fw fa-twitter center'/>
						<h1>{numberWithSuffix(twitter_current) || '0'}</h1>
						<span>total</span>
						<div className='divider'/>
						<span>{numberWithSuffix(twitter_last)+' yesterday'}</span>
					</div>
					<div className='panel facebook flex-column flex'>
						<Overlay icon='plus' hidden={this.state.facebook}>
							Add Link
						</Overlay>
						<i className='fa fa-fw fa-facebook center'/>
						<h1>{numberWithSuffix(facebook_current) || '0'}</h1>
						<span>total</span>
						<div className='divider'/>
						<span>{numberWithSuffix(facebook_last)+' yesterday'}</span>
					</div>
					<div className='panel instagram flex-column flex'>
						<Overlay icon='plus' hidden={this.state.instagram}>
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
