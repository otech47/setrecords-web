import React from 'react';
import _ from 'underscore';
import constants from '../constants/constants';

import MockSetTile from './MockSetTile';
import UtilityFunctions from '../mixins/UtilityFunctions';

var TrackWizardStep1 = React.createClass({
    mixins: [UtilityFunctions],

    render: function() {
        // console.log(this.props.originalArtist);
        var stepForward = this.props.stepForward;
        var setTiles = _.map(this.props.singlesSets, (set, index) => {
            var setImage = {
                preview: constants.S3_ROOT_FOR_IMAGES + set.icon_image.imageURL
            };

            var setData = {
                image: setImage,
                artists: [this.props.originalArtist],
                event: set.event.event,
                episode: (set.episode ? set.episode.episode : ''),
                setLength: this.timeStringToSeconds(set.set_length),
                popularity: set.popularity
            };

            return (<MockSetTile {...setData} key={set.id} onClick={this.props.stepForward.bind(null, {selectedSetIndex: index})} />);
        });

        return (
            <div className="flex-column wizard-step" id='WizardStep1'>
                <p>Select a set to add a track to, or start a new one.</p>

                <div className="flex-row">
                    <MockSetTile artists={[this.props.originalArtist]}
                    event={'Create New...'} popularity={0} setLength={0} onClick={this.props.stepForward.bind(null, {selectedSetIndex: -1})} />

                    {setTiles}
                </div>
            </div>
        );
    }
});

module.exports = TrackWizardStep1;
