import React from 'react';
var Loader = require('react-loader');

var SocialReport = React.createClass({
	getInitialState: function() {
		return ({
			loaded: true
		});
	},
	render: function() {
		var {numberWithSuffix, metrics, ...other} = this.props;

		var twitterMetrics = metrics.twitter;
		var twitter_total = twitterMetrics.overtime[0].followers;
		var twitter_current = twitterMetrics.current;
		var twitter_last = twitterMetrics.last;

		var facebookMetrics = metrics.facebook;
		var facebook_total = facebookMetrics.overtime[0].followers;
		var facebook_current = facebookMetrics.current;
		var facebook_last = facebookMetrics.last;

		var instagramMetrics = metrics.instagram;
		var instagram_total = instagramMetrics.overtime[0].followers;
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
					<h1>{numberWithSuffix(twitter_total) || '0'}</h1>
					<span>total</span>
					<div className='divider'/>
					<span>{numberWithSuffix(twitter_last)+' yesterday'}</span>
				</div>
				<div className='panel facebook flex-column flex'>
					<i className='fa fa-fw fa-facebook center'/>
					<h1>{numberWithSuffix(facebook_total) || '0'}</h1>
					<span>total</span>
					<div className='divider'/>
					<span>{numberWithSuffix(facebook_last)+' yesterday'}</span>
				</div>
				<div className='panel instagram flex-column flex'>
					<i className='fa fa-fw fa-instagram center'/>
					<h1>{numberWithSuffix(instagram_total) || '0'}</h1>
					<span>total</span>
					<div className='divider'/>
					<span>{numberWithSuffix(instagram_last)+' yesterday'}</span>
				</div>


				<div className='social-report-inner flex-column hidden'>
					<div className='social-metrics flex-row'>
						<div className='flex-column flex-fixed'>
							<img src='/public/images/twitter_icon.png' />
							<h1>{numberWithSuffix(twitter_total)}</h1>
						</div>
						<div className='flex-column flex-fixed'>
							<p>new followers</p>
							<h1>{numberWithSuffix(twitter_current)}</h1>
							<p>yesterday {numberWithSuffix(twitter_last)}</p>
						</div>
					</div>
					<div className='divider'></div>
					<div className='social-metrics flex-row'>
						<div className='flex-column flex-fixed'>
							<img src='/public/images/facebook-icon.png' />
							<h1>{numberWithSuffix(facebook_total)}</h1>
						</div>
						<div className='flex-column flex-fixed'>
							<p>new likes</p>
							<h1>{numberWithSuffix(facebook_current)}</h1>
							<p>yesterday {numberWithSuffix(facebook_last)}</p>
						</div>
					</div>
					<div className='divider'></div>
					<div className='social-metrics flex-row'>
						<div className='flex-column flex-fixed'>
							<img src='/public/images/instagram_icon.png' />
							<h1>{numberWithSuffix(instagram_total)}</h1>
						</div>
						<div className='flex-column flex-fixed'>
							<p>new followers</p>
							<h1>{numberWithSuffix(instagram_current)}</h1>
							<p>yesterday {numberWithSuffix(instagram_last)}</p>
						</div>
					</div>
				</div>
			</Loader>
		</div>
		);
	}
});

module.exports = SocialReport;									