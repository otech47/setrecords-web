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
		var playsOvertime = metrics.plays.overtime;
		var profileviewsOvertime = metrics.profileviews.overtime;
		var favoritesOvertime = metrics.favorites.overtime;

		return (
		<div className="setmine-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/setminelogo.png" />
				setmine
			</div>
			<div className="setmine-numbers flex-row">
				<div className="plays flex-column flex-fixed">
					<p>plays</p>
					<h1>{playsOvertime[playsOvertime.length - 1].count}</h1>
					<p>yesterday {(playsOvertime[playsOvertime.length - 1].count - playsOvertime[playsOvertime.length - 2].count >= 0) ? '+' : ''}{playsOvertime[playsOvertime.length - 1].count - playsOvertime[playsOvertime.length - 2].count}</p>
				</div>
				<div className="profileviews flex-column flex-fixed">
					<p>profile views</p>
					<h1>{profileviewsOvertime[profileviewsOvertime.length - 1].count}</h1>
					<p>yesterday {(profileviewsOvertime[profileviewsOvertime.length - 1].count - profileviewsOvertime[profileviewsOvertime.length - 2].count >= 0) ? '+' : ''}{profileviewsOvertime[profileviewsOvertime.length - 1].count - profileviewsOvertime[profileviewsOvertime.length - 2].count}</p>
				</div>
				<div className="favorites flex-column flex-fixed">
					<p>favorites</p>
					<h1>{favoritesOvertime[favoritesOvertime.length - 1].count}</h1>
					<p>yesterday {(favoritesOvertime[favoritesOvertime.length - 1].count - favoritesOvertime[favoritesOvertime.length - 2].count >= 0) ? '+' : ''}{favoritesOvertime[favoritesOvertime.length - 1].count - favoritesOvertime[favoritesOvertime.length - 2].count}</p>
				</div>
			</div>
			<div className="setmine-graph">
			</div>
		</div>
		);
	}
});

module.exports = SetmineReport;					