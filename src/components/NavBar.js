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
				<Link className='option flex' to="content">Content</Link>
				<Link className='option flex' to="metrics">Metrics</Link>
				<Link className='option flex' to="superfans">Superfans</Link>
				<Link className='option flex' to="ibeacons">iBeacons</Link>
			</div>
		);
	}
});

module.exports = NavBar;