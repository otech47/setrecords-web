import React from 'react';

var SetmineReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var metrics = this.props.metrics;
		var plays = metrics.plays;
		var favorites = metrics.favorites;

		return (
		<div className="setmine-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/setminelogo.png" />
				setmine
			</div>
			<div className="setmine-numbers flex-row">
				<div className="plays flex-column flex-fixed">
					<p>plays</p>
					<h1>{plays[6].count}</h1>
					<p>yesterday {(plays[6].count - plays[5].count >= 0) ? '+' : ''}{plays[6].count - plays[5].count}</p>
				</div>
				<div className="profileviews flex-column flex-fixed">
					<p>profile views</p>
					<h1>32</h1>
					<p>yesterday +3</p>
				</div>
				<div className="favorites flex-column flex-fixed">
					<p>favorites</p>
					<h1>{favorites[6].count}</h1>
					<p>yesterday {(favorites[6].count - favorites[5].count >= 0) ? '+' : ''}{favorites[6].count - favorites[5].count}</p>
				</div>
			</div>
			<div className="setmine-graph">
			</div>
		</div>
		);
	}
});

module.exports = SetmineReport;					