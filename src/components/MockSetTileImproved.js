import React from 'react';
import constants from '../constants/constants';
import UtilityFunctions from '../mixins/UtilityFunctions';
import _ from 'underscore';

var MockSetTileImproved = React.createClass({
    mixins: [UtilityFunctions],
    render() {
        var {image, artists, event, setLength, episode, popularity, ...other} = this.props;

        if (image) {
            var backgroundImage = image.preview;
        } else {
            var backgroundImage = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
        }

        var style = {
            backgroundImage: `url('${backgroundImage}')`,
            backgroundSize: '100% 100%'
        };

        var artistText = artists[0].artist;
        if (artists.length > 1) {
            artistText += ' feat. ' + _.pluck(_.rest(artists), 'artist').join(', ');
        }

        return (
            <div className='set-tile' style={style}>
                <div className='flex-column tile-controls'>
                    <div className='flex-column flex-2x set-info'>
                        <div>{artistText}</div>
                        <div>{event}{(episode && episode.length > 0) ? ' - ' + episode : ''}</div>
                    </div>
                    <div className='divider'></div>
                    <div className='flex-row flex set-stats'>
                        <div className='flex-fixed play-count set-flex'>
                            <i className='fa fa-play'> {popularity}</i>
                        </div>
                        <div className='flex-fixed set-length set-flex'>
                            <i className='fa fa-clock-o'> {this.secondsToMinutes(setLength)}</i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = MockSetTileImproved;
