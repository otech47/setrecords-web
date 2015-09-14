import React from 'react';

var BeaconReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
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
		);
	}
});

module.exports = BeaconReport;									