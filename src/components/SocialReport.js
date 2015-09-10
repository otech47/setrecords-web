import React from 'react';

var SocialReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	truncatedToNum: function(input) {
		var factor = 1;
		var output = 0;
		switch(input.slice(-1)) {
			case 'K':
			factor = 1000;
			output = parseFloat(input.substring(0, input.length - 1)) * factor;
			break;
			case 'M':
			factor = 1000000;
			output = parseFloat(input.substring(0, input.length - 1)) * factor;
			break;
			default:
			factor = 1;
			output = parseFloat(input);
			break;
		}
		return output;
	},
	render: function() {
		var metrics = this.props.metrics;
		var twitterMetrics = metrics.twitter;
		var facebookMetrics = metrics.facebook;
		var instagramMetrics = metrics.instagram;
		var twitterChange = this.truncatedToNum(twitterMetrics.current) - this.truncatedToNum(twitterMetrics.last);
		var facebookChange = this.truncatedToNum(facebookMetrics.current) - this.truncatedToNum(facebookMetrics.last);
		var instagramChange = this.truncatedToNum(instagramMetrics.current) - this.truncatedToNum(instagramMetrics.last);

		return (
		<div className="social-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/social_icon.png" />
				social
			</div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/twitter_icon.png" />
					<h1>{twitterMetrics.total}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>{twitterMetrics.current}</h1>
					<p>yesterday {twitterChange >= 0 ? "+" : ""}{twitterChange}</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/facebook-icon.png" />
					<h1>{facebookMetrics.current}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new likes</p>
					<h1>{facebookMetrics.current}</h1>
					<p>yesterday {facebookChange >= 0 ? "+" : ""}{facebookChange}</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/instagram_icon.png" />
					<h1>{instagramMetrics.current}</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>{instagramMetrics.current}</h1>
					<p>yesterday {instagramChange >= 0 ? "+" : ""}{instagramChange}</p>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = SocialReport;									