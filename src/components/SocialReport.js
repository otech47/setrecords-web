import React from 'react';

var SocialReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
		<div className="social-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/social_icon.png" />
				social
			</div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/twitter_icon.png" />
					<h1>6.6M</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/facebook-icon.png" />
					<h1>66.6M</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new likes</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row">
				<div className="flex-column flex-fixed">
					<img src="/public/images/instagram_icon.png" />
					<h1>6.6M</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = SocialReport;									