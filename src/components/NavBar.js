import React from 'react';
import {Navigation, Link} from 'react-router';

var NavBar = React.createClass({
	mixins: [Navigation],
	render: function() {
		return (
			<div className='flex-column' id='NavBar'>
				<h3>CONTENT</h3>
				<Link className='flex-row flex click' to='content'>
					<i className='fa fa-fw fa-cloud-upload'/>
					<div>Add Set</div>
				</Link>
				<Link className='flex-row flex click' to='content'>
					<i className='fa fa-fw fa-music'/>
					<div>Add Track</div>
				</Link>
				<Link className='flex-row flex click' to='content'>
					<i className='fa fa-fw fa-folder'/>
					<div>Uploads</div>
				</Link>
				<h3>METRICS</h3>
				<Link className='flex-row flex click' to='/metrics'>
					<i className='fa fa-fw icon-setmine'/>
					<div>Setmine</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics'>
					<i className='fa fa-fw fa-dollar'/>
					<div>Beacons</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics'>
					<i className='fa fa-fw fa-users'/>
					<div>Social</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics'>
					<i className='fa fa-fw fa-soundcloud'/>
					<div>Soundcloud</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics'>
					<i className='fa fa-fw fa-youtube'/>
					<div>Youtube</div>
				</Link>
				<h3>SETTINGS</h3>
				<Link className='flex-row flex click' to='/settings'>
					<i className='fa fa-fw fa-cog'/>
					<div>Settings</div>
				</Link>
				<div className='buffer-5x'/>
			</div>
		);
	}
});

module.exports = NavBar;