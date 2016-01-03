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
                <div className='header-main flex-row'>
                    <h1>{this.props.headerText}</h1>
                    <div className='buffer'/>
                    <div className='artist flex-row'>
                        <div className='options flex-column'>
                            <h1>{artistName}</h1>
                        </div>
                        <img src={constants.S3_ROOT_FOR_IMAGES + artistImage} />
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = Header;
