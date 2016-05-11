import React from 'react';
import {History} from 'react-router';
import constants from '../constants/constants';
import auth from '../lib/auth';

module.exports = React.createClass({
    mixins: [History],

    render() {
        var artistImage = this.props.artistImage || constants.DEFAULT_IMAGE;
        var artistName = this.props.artistName || 'Not Logged In';

        return (
            <header id='Header' className='row justify-space-between align-center'>
                <h1>{this.props.headerText}</h1>

                <div className='artist-detail row align-center'>
                    <div className='artist-info column align-end justify-center'>
                        <h1 className='bold'>{artistName}</h1>
                        <a href='' onClick={this.logout}>Logout</a>
                    </div>

                    <img src={constants.S3_ROOT_FOR_IMAGES + artistImage} />
                </div>
            </header>
        );
    },

    logout() {
        console.log('logout');
        auth.logout()
            .then(() => {
                this.history.replaceState('/');
            });
    }
});
