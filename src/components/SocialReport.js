import React from 'react';
import moment from 'moment';
import Loader from 'react-loader';
import {numberWithSuffix} from '../mixins/UtilityFunctions';


var SocialReport = React.createClass({

	getInitialState() {
		return ({
			loaded: false
		});
	},

	componentWillMount: function() {
		this.updateSocial();
	},

	updateSocial(params) {
		var artistId = this.props.appState.get("artist_data").id;
		var socialRequestUrl = 'http://localhost:3000/api/v/7/setrecords/metrics/social/'
		+ artistId;
		var socialMetrics;
		var timezone = moment().utcOffset();
		$.ajax({
			type: 'GET',
			url: socialRequestUrl,
			data: {timezone: timezone}
		})
		.done((res) => {
			console.log(res);
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
					<i className='fa fa-share-square-o'/>
					social
				</div>
				<Loader loaded={this.state.loaded}>
					<div className='panel twitter flex-column flex'>
						<i className='fa fa-fw fa-twitter center'/>
						<h1>{numberWithSuffix(twitter_current) || '0'}</h1>
						<span>total</span>
						<div className='divider'/>
						<span>{numberWithSuffix(twitter_last)+' yesterday'}</span>
					</div>
					<div className='panel facebook flex-column flex'>
						<i className='fa fa-fw fa-facebook center'/>
						<h1>{numberWithSuffix(facebook_current) || '0'}</h1>
						<span>total</span>
						<div className='divider'/>
						<span>{numberWithSuffix(facebook_last)+' yesterday'}</span>
					</div>
					<div className='panel instagram flex-column flex'>
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