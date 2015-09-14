import React from 'react';

var SetmineReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;

		var current_plays = metrics.plays.current;
		var last_plays = metrics.plays.last;

		var current_views = metrics.views.current;
		var last_views = metrics.views.last;

		var current_favorites = metrics.favorites.current;
		var last_favorites = metrics.favorites.last;


		return (
		<div className="setmine-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/setminelogo.png" />
				setmine
			</div>
			<div className="setmine-numbers flex-row">
				<div className="plays flex-column flex-fixed">
					<p>new plays</p>
					<h1>{suffixNum(current_plays)}</h1>
					<p>yesterday {suffixNum(last_plays)}</p>
				</div>
				<div className="profileviews flex-column flex-fixed">
					<p>profile views</p>
					<h1>{suffixNum(current_views)}</h1>
					<p>yesterday {suffixNum(last_views)}</p>
				</div>
				<div className="favorites flex-column flex-fixed">
					<p>favorites</p>
					<h1>{suffixNum(current_favorites)}</h1>
					<p>yesterday {suffixNum(last_favorites)}</p>
				</div>
			</div>
			<div className="setmine-graph">
			</div>
		</div>
		);
	}
});

module.exports = SetmineReport;					