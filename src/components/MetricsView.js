import React from 'react';
import SetmineReport from './SetmineReport';
import RevenueReport from './RevenueReport';
import SocialReport from './SocialReport';

var MetricsView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="metrics-page flex-column">
				<div className="setmine-report flex-column">
					<div className="title flex-row">
						<img src="/public/images/setminelogo.png" />
						setmine
					</div>
					<div className="setmine-numbers flex-row">
						<div className="plays flex-column flex-fixed">
							<p>plays</p>
							<h1>3200</h1>
							<p>yesterday +99</p>
						</div>
						<div className="profileviews flex-column flex-fixed">
							<p>profile views</p>
							<h1>320</h1>
							<p>yesterday +99</p>
						</div>
						<div className="favorites flex-column flex-fixed">
							<p>favorites</p>
							<h1>32</h1>
							<p>yesterday +999</p>
						</div>
					</div>
					<div className="setmine-graph">
					</div>
				</div>

				<div className="beacon-report flex-column">
					<div className="title flex-row">
						<img src="/public/images/beacon_icon.png" />
						beacons
					</div>
					<div className="beacon-numbers flex-row">
						<div className="revenue flex-column flex-fixed">
							<p>total revenue</p>
							<h1>320k</h1>
							<p>yesterday +50</p>
						</div>
						<div className="unlockedsets flex-column flex-fixed">
							<p>sets unlocked</p>
							<h1>32</h1>
							<p>yesterday -9</p>
						</div>
					</div>
					<div className="beacon-graph">
					</div>
				</div>

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
			</div>
		);
	}
});

module.exports = MetricsView;