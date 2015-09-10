import React from 'react';

var ViewContainer = React.createClass({
	render: function() {
		var appState = this.props.appState;
		var push = this.props.push;
		var Rh = this.props.routeHandler;

		return (
			<div className="view-container flex">
				<Rh appState={appState} push={push} />
			</div>
		);
	}
});

module.exports = ViewContainer;