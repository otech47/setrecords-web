import React from 'react';

var SocialReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;

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
		<div className="social-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/social_icon.png" />
				social
			</div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/twitter_icon.png" />
					<h1>{suffixNum(twitter_total)}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>{suffixNum(twitter_current)}</h1>
					<p>yesterday {suffixNum(twitter_last)}</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/facebook-icon.png" />
					<h1>{suffixNum(facebook_total)}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new likes</p>
					<h1>{suffixNum(facebook_current)}</h1>
					<p>yesterday {suffixNum(facebook_last)}</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/instagram_icon.png" />
					<h1>{suffixNum(instagram_total)}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>{suffixNum(instagram_current)}</h1>
					<p>yesterday {suffixNum(instagram_last)}</p>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = SocialReport;									