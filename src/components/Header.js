import {Link} from 'react-router';
import React from 'react';
import constants from '../constants/constants';

var Header = React.createClass({
    render() {
        var artistImage = this.props.artistImage || constants.DEFAULT_IMAGE;
        var artistName = this.props.artistName || 'Not Logged In';

        return (
            <header className='flex-row'>
                <div className='logo flex-row'>
                    <img src='/images/setrecords-logo-white.png' />
                    setrecords
                </div>
                <div className='header-main flex flex-row'>
                    <h1>{this.props.headerText}</h1>
                    <div className='buffer'/>
                    <div className='artist flex-row'>
                        <div className='options flex-column'>
                            <Link to='/account'><h1>{artistName}</h1></Link>
                            <p onClick={this.props.logOut} hidden={!this.props.loggedIn}>Logout</p>
                        </div>
                        <Link to='/account'><img onClick={this.settingsRedirect} className='click' src={constants.S3_ROOT_FOR_IMAGES + artistImage} /></Link>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = Header;
