import React from 'react';

var SetmineReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
		<div className="flex-fixed setmine-report set-flex">
			<div className="flex-row title">
				<img src="/public/images/setminelogo.png" />
				<p>revenue</p>
			</div>
			<div className="flex-row setmine-numbers">
				<div className="setmine-plays flex-fixed">
					plays
					<h1>3200</h1>
					(yesterday + 9)
				</div>
				<div className="setmine-profileviews flex-fixed">
					profile views
					<h1>320</h1>
					(yesterday + 9)
				</div>
				<div className="setmine-favorites flex-fixed">
					favorites
					<h1>32</h1>
					(yesterday + 9)
				</div>
			</div>
		</div>
		);
	}
});

module.exports = SetmineReport;					