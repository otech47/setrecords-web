import React from 'react';
import _ from 'underscore';

var Track = React.createClass({
    render: function() {
        var {deepLinkState, deleteTrack, index} = this.props;

        return (
            <tr>
                <td>
                    <input type='text' valueLink={deepLinkState(['tracklist', index, 'starttime'])} placeholder='00:00' name='starttime' />
                </td>
                <td>
                    <input type='text' valueLink={deepLinkState(['tracklist', index, 'songname'])} placeholder='title' name='songname' />

                </td>
                <td>
                    <input type='text' valueLink={deepLinkState(['tracklist', index, 'artistname'])} placeholder='artist' name='artistname' />
                </td>
                <td>
                    <i className='fa fa-times center' onClick={deleteTrack} />
                </td>
            </tr>
        );
    }
});

module.exports = Track;
