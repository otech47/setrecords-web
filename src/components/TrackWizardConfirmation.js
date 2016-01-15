import React from 'react';
import MockSetTileImproved from './MockSetTileImproved';
var constants = require('../constants/constants');
import _ from 'underscore';

var TrackWizardConfirmation = React.createClass({
    render: function() {
        var {image, event, setLength, trackName, trackArtist, originalArtist, popularity, ...other} = this.props;

        return (
            <div className="flex-column wizard-step">
                <p className='step-info set-flex'>Confirm this information is correct, then click Upload.</p>
                <div className='flex-row'>
                    <div className='flex-column flex-fixed'>
                        <table className="step-button-text">
                        <tbody>
                            <tr>
                                <td><p>Set Title:</p></td>
                                <td><p>{event}</p></td>
                            </tr>
                            <tr>
                                <td><p>Track Title:</p></td>
                                <td><p>{trackName}</p></td>
                            </tr>
                            <tr>
                                <td><p>Artist:</p></td>
                                <td><p>{trackArtist}</p></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div className='flex-column flex-fixed'>
                        <MockSetTileImproved image={image} artists={[originalArtist]} event={event} setLength={setLength} popularity={popularity} />
                    </div>
                </div>
                <button className='step-button' onClick={this.props.uploadTrack}>
                    Upload
                </button>
            </div>
        );
    }
});

module.exports = TrackWizardConfirmation;
