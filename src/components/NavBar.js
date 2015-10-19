import React from 'react';
import {IndexLink, Link} from 'react-router';

var NavBar = React.createClass({

	render() {
		return (
			<div className='flex-column' id='NavBar'>
				<h3>CONTENT</h3>
				<Link className='flex-row flex click' to='/upload' activeClassName='active'>
					<i className='fa-fw material-icons'>file_upload</i>
					<div>Add Set</div>
				</Link>
				<Link className='flex-row flex click' to='/upload' activeClassName='active'>
					<i className='fa-fw material-icons'>music_note</i>
					<div>Add Track</div>
				</Link>
				<IndexLink className='flex-row flex click' to='/' activeClassName='active' onlyActiveOnIndex={true}>
					<i className='fa-fw material-icons'>library_music</i>
					<div>Uploads</div>
				</IndexLink>
				<h3>METRICS</h3>
				<Link className='flex-row flex click' to='/metrics/setmine' activeClassName='active'>
					<i className='fa fa-fw icon-setmine'/>
					<div>Setmine</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics/beacons'>
					<i className='fa fa-fw fa-dollar'/>
					<div>Beacons</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics/social' activeClassName='active'>
					<i className='fa fa-fw fa-users'/>
					<div>Social</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics/soundcloud' activeClassName='active'>
					<i className='fa fa-fw fa-soundcloud'/>
					<div>Soundcloud</div>
				</Link>
				<Link className='flex-row flex click' to='/metrics/youtube' activeClassName='active'>
					<i className='fa fa-fw fa-youtube'/>
					<div>Youtube</div>
				</Link>
				<h3>SETTINGS</h3>
				<Link className='flex-row flex click' to='/settings' activeClassName='active'>
					<i className='fa fa-fw fa-cog'/>
					<div>Settings</div>
				</Link>
				<div className='buffer-5x'/>
			</div>
		);
	}
});

module.exports = NavBar;