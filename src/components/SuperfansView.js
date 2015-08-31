import React from 'react';

var SuperfansView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="view">
				Welcome to the Superfans page
			</div>
		);
	}
});

module.exports = SuperfansView;