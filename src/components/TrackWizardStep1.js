import React from 'react';
import _ from 'underscore';

import MockSetTileImproved from './MockSetTileImproved';

var TrackWizardStep1 = React.createClass({
    render: function() {
        var stepForward = this.props.stepForward;
        var setTiles = _.map(this.props.availableSets, (set, index) => {
            var setImage = {
                preview: set.icon_image.imageURL
            };

            var setData = {
                image: setImage,
                artists: [this.props.originalArtist],
                event: set.event.event,
                episode: set.episode.episode,
                setLength: set.set_length,
                popularity: set.popularity
            };

            return (<MockSetTileImproved setData={setData} onClick={this.props.stepForward.bind(null, {selectedSetIndex: index})} />);
        });

        return (
            <div className="flex-column wizard-step" id='WizardStep1'>
                <p>Select a set to add a track to, or start a new one.</p>

                <div className="flex-row">
                    <MockSetTileImproved artists={[this.props.originalArtist]}
                    event={'Create New...'} popularity={0} setLength={0} onClick={this.props.stepForward.bind(null, {selectedSetIndex: -1})} />

                    {setTiles}
                </div>
            </div>
        );
    }
});

module.exports = TrackWizardStep1;
