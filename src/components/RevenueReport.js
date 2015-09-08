import React from 'react';

var RevenueReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
		<div className="flex-fixed revenue-report">
			<div className="flex-row title">
				<img src="/public/images/beacon_icon.png" />
				<p>revenue</p>
			</div>
		</div>	
		);
	}
});

module.exports = RevenueReport;									