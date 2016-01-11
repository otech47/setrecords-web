import React from 'react';
import _ from 'underscore';
import UtilityFunctions from '../mixins/UtilityFunctions';
import Track from './Track';

var Tracklist = React.createClass({

    mixins: [UtilityFunctions],

    render: function() {
        var {tracklist, tracklistUrl, deepLinkState, deleteTrack, addTrack, ...other} = this.props;

        if(tracklist.length > 0) {
            var trackRows = _.map(tracklist, (track, index) => {
                var props = {
                    key: `${track.track_id}_${index}`,
                    index: index,
                    deepLinkState: deepLinkState,
                    deleteTrack: deleteTrack.bind(null, index)
                };

                return (
                    <Track {...props} />
                );
            });

            var trackComponents = (
                <table className='tracklist'>
                    <tbody>
                        <tr>
                            <th>Time</th>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Delete</th>
                        </tr>
                        {trackRows}
                    </tbody>
                </table>
            );
        } else {
            var trackComponents = (
                <p>No tracks found for this set.</p>
            );
        }

        return (
            <div className='flex-column' id='Tracklist'>
                <div className='urlTracklist form-panel'>
                    <h1>1001tracklists URL</h1>
                    <input type='text' valueLink={deepLinkState(['tracklist_url'])} />
                    <button onClick={this.props.loadTracksFromUrl.bind(null, tracklistUrl)}>Load</button>
                </div>
                <div className='tracks flex-column form-panel'>
                    <h1>Edit Tracks</h1>
                    {trackComponents}
                    <button onClick={addTrack}>Add Track</button>
                </div>
            </div>
        );
    }
});

module.exports = Tracklist;
