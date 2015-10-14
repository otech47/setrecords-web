import React from 'react';
import SettingsEditor from './SettingsEditor';

var ViewContainer = React.createClass({
	render: function() {
		var {routeHandler, ...other} = this.props;
		var Rh = routeHandler;

		return (
			<div className="view-container flex">
				<Rh {...other} />
			</div>
		);
	}
});

module.exports = ViewContainer;
