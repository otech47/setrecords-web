import React from 'react';

var BeaconReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;
		return (
		<div className="beacon-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/beacon_icon.png" />
				beacons
			</div>
			<div className="beacon-numbers flex-row">
				<div className="revenue flex-column">
					<p>new revenue</p>
					<h1>{suffixNum(metrics.revenue.current)}</h1>
					<p>yesterday {suffixNum(metrics.revenue.last)}</p>
				</div>
				<div className="unlockedsets flex-column">
					<p>sets unlocked</p>
					<h1>{suffixNum(metrics.unlocks.current)}</h1>
					<p>yesterday {suffixNum(metrics.unlocks.last)}</p>
				</div>
			</div>
			<div className="beacon-graph">
			</div>
		</div>	
		);
	}
});

module.exports = BeaconReport;									