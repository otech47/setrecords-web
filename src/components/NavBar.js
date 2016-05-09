import React from 'react';
import {IndexLink, Link, History} from 'react-router';
import Icon from './Icon';

var NavBar = React.createClass({

    mixins: [History],

    render() {
        return (
            <div className='flex-column' id='NavBar'>
                <IndexLink className='flex-row flex click' to='/dashboard' activeClassName='active' >
                    <Icon>trending_up</Icon>
                    <div>Dashboard</div>
                </IndexLink>
                <Link className='flex-row flex click' to='/content' activeClassName='active' onlyActiveOnIndex={true}>
                    <Icon>library_music</Icon>
                    <div>Uploads</div>
                </Link>
                <Link className='flex-row flex click' to='/upload-set' activeClassName='active' ref='set'>
                    <Icon>queue_music</Icon>
                    <div>Add Set</div>
                </Link>
                <Link className='flex-row flex click' to='/upload-track' activeClassName='active' ref='track'>
                    <Icon>music_note</Icon>
                    <div>Add Track</div>
                </Link>
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
