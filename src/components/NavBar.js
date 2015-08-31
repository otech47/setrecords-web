import React from 'react';
import {Navigation, Link} from 'react-router';
import constants from '../constants/constants';

var NavBar = React.createClass({
	mixins: [Navigation],
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="flex-row nav-bar">
				<Link className='option flex set-flex' to="content">
					<div className="center">Content</div>
				</Link>
				<Link className='option flex set-flex' to="metrics">
					<div className="center">Metrics</div>
				</Link>
				<Link className='option flex set-flex' to="superfans">
					<div className="center">Superfans</div>
				</Link>
				<Link className='option flex set-flex' to="ibeacons">
					<div className="center">iBeacons</div>
				</Link>
			</div>
		);
	}
});

module.exports = NavBar;