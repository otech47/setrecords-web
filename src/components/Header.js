import React from 'react';

import Base from './Base';
import constants from '../constants/constants';

export default class Header extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        var artistImage = this.props.artistImage || constants.DEFAULT_IMAGE;
        var artistName = this.props.artistName || 'Not Logged In';

        return (
            <header id='Header' className='row justify-space-between align-center'>
                <h1>{this.props.headerText}</h1>

                <div className='artist-detail row align-center'>
                    <div className='artist-info column align-end justify-center'>
                        <h1 className='bold'>{artistName}</h1>
                        <a href='' onClick={this.logOut}>Logout</a>
                    </div>

                    <img src={constants.S3_ROOT_FOR_IMAGES + artistImage} />
                </div>
            </header>
        );
    }

    logOut() {
        console.log('logout');
    }
}
