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
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Metrics Dashboard'
            }
        });
    }

    render() {
        var {push, appState} = this.props;
        var artistId = appState.get('artistId');

        return (
            <div id='Dashboard'>
                <div className='flex-row'>
                    <SetmineReport push={push} artistId={artistId} setmineMetrics={appState.get('setmineMetrics')} />
                    <BeaconReport push={push} artistId={artistId} beaconMetrics={appState.get('beaconMetrics')} />
                    <SoundcloudReport push={push} artistId={artistId} soundcloudMetrics={appState.get('soundcloudMetrics')} />
                    <YoutubeReport push={push} artistId={artistId} youtubeMetrics={appState.get('youtubeMetrics')} />
                    <SocialReport push={push} artistId={artistId} socialMetrics={appState.get('socialMetrics')} />
                </div>
            </div>
        );
    }
}
