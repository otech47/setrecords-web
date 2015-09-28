import React from 'react';
import {Navigation, Link} from 'react-router';

var NavBar = React.createClass({
	mixins: [Navigation],
	render: function() {
		return (
			<div className="flex-fixed nav-bar flex-row">
				<Link className="flex-fixed set-flex" to="content">
					<div>Content</div>
				</Link>
				<Link className="flex-fixed set-flex" to="/metrics">
					<div>Metrics</div>
				</Link>
			</div>
		);
	}
});

module.exports = NavBar;