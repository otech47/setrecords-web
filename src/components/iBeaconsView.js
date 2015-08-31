import React from 'react';

var iBeaconsView = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="view">
				Welcome to the iBeacons page
			</div>
		);
	}
});

module.exports = iBeaconsView;