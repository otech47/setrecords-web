import React from 'react';
import {IndexLink, Link, History} from 'react-router';
import Icon from './Icon';

var NavBar = React.createClass({

    mixins: [History],

    render() {
        return (
            <div className='flex-column' id='NavBar'>
                <h3>CONTENT</h3>
                <Link className='flex-row flex click' to='/upload' activeClassName='active' ref='set'>
                    <Icon>queue_music</Icon>
                    <div>Add Set</div>
                </Link>
                <Link className='flex-row flex click' to='/upload' activeClassName='active' ref='track'>
                    <Icon>music_note</Icon>
                    <div>Add Track</div>
                </Link>
                <IndexLink className='flex-row flex click' to='/content' activeClassName='active' onlyActiveOnIndex={true}>
                    <Icon>library_music</Icon>
                    <div>Uploads</div>
                </IndexLink>
                <h3>METRICS</h3>
                <Link className='flex-row flex click' to='/metrics/setmine' activeClassName='active'>
                    <i className='fa fa-fw icon-setmine'/>
                    <div>Setmine</div>
                </Link>
                <Link className='flex-row flex click' to='/metrics/beacons'
                    activeClassName='active'>
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
                <Link className='flex-row flex click' to='/account' activeClassName='active'>
                    <i className='fa fa-fw fa-cog'/>
                    <div>Settings</div>
                </Link>
                <Link className='flex-row flex click' to='/contact' activeClassName='active'>
                    <i className='fa fa-fw fa-phone'/>
                    <div>Contact</div>
                </Link>
                <div className='buffer-5x'/>
            </div>
        );
    }
});

module.exports = NavBar;
