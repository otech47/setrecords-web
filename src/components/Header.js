import React from 'react';
import constants from '../constants/constants';

var Header = React.createClass({

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.appState.get('header') != this.props.appState.get('header');
    },

    render() {
        var artistData = this.props.appState.get('artist_data');

        return (
            <header className='flex-row'>
                <div className='logo flex-row'>
                    <img src='/public/images/setrecords-logo-white.png' />
                    setrecords
                </div>
                <div className='header-main flex-row flex'>
                    <h1>{this.props.appState.get('header')}</h1>
                    <div className='buffer'/>
                    <div className='artist flex-row'>
                        <div className='options flex-column'>
                            <h1>{artistData.artist}</h1>
                        </div>
                        <img src={constants.S3_ROOT_FOR_IMAGES + artistData.icon_image.imageURL} />
                    </div>
                </div>
            </header>
        );
    }

});

module.exports = Header;
