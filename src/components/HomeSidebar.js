import React from 'react';
import {Link} from 'react-router';

var HomeSidebar = React.createClass({
	render: function() {
		return (
			<div className="flex-column flex-fixed sidebar">
				<div className="flex flex-column overlay-container user-background">
				  <img className="user-image center" src='' />
				</div>
				<div className="flex-3x flex-column user-nav">
					<Link className="view-trigger click flex flex-row" to='favorites'>
					   <div>My Sets</div>
					</Link>
					<Link className="view-trigger click flex flex-row" to='new'>
					   <div>New</div>
					</Link>
					<div className='buffer-3x'/>
					<div className="view-trigger click flex flex-row hidden" name="activities">
					   <div>Activities</div>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = HomeSidebar;