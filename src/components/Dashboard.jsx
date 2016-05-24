import React from 'react';

import Base from './Base';
import BeaconReport from './BeaconReport';
import SetmineReport from './SetmineReport';
import SocialReport from './SocialReport';
import SoundcloudReport from './SoundcloudReport';
import YoutubeReport from './YoutubeReport';

export default class Dashboard extends Base {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.context.push({
            headerText: 'Dashboard'
        });
    }

    render() {
        return (
            <div id='Dashboard' className='column'>
                <div className='row'>
                    <div className='flex'>
                        <SetmineReport />
                    </div>

                    <div className='flex'>
                        <BeaconReport />
                    </div>
                </div>

                <div className='row'>
                    <div className='flex'>
                        <SoundcloudReport />
                    </div>

                    <div className='flex'>
                        <YoutubeReport />
                    </div>
                </div>

                <div className='row'>
                    <div className='flex'>
                        <SocialReport />
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.contextTypes = {
    push: React.PropTypes.func
};
