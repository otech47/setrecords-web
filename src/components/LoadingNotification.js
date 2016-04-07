import React from 'react';

import Base from './Base';
import Loader from 'react-loader';

export default class LoadingNotification extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="LoadingNotification" className='notification column justify-center align-center'>
                <div className='modal column align-center'>
                    <h2 className='message flex'>{this.props.notification.message}</h2>
                    <div className='loader-icon flex-2x'>
                        <Loader loaded={false} />
                    </div>
                </div>
            </div>
        );
    }
}
