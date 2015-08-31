import React from 'react';

var MetricsView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="view">
				Welcome to the Metrics page
			</div>
		);
	}
});

module.exports = MetricsView;