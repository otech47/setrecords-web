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
			<div className="metrics-page">
				<div className="flex-row metrics-top">
					<SetmineReport />
					<RevenueReport />
				</div>
				<div className="metrics-bottom flex-row">
					<SocialReport />
				</div>
			</div>
		);
	}
});

module.exports = MetricsView;