import React from 'react';
import MockSetTileImproved from './MockSetTileImproved';
var constants = require('../constants/constants');
import _ from 'underscore';

var WizardStepConfirmation = React.createClass({
    render: function() {
        var {paid, price, image, event, set_length, episode, artists, genre, type, outlets, ...other} = this.props;

        var outletText = '';
        var releaseType = 'Free';
        var typeText = '';

        switch (type) {
            case 'album':
            typeText = 'Album';
            break;

            case 'festival':
            typeText = 'Live';
            break;

            case 'mix':
            typeText = 'Mix';
            break;

            default:
            typeText = 'Mix';
            break;
        }


        if (paid == 1) {
            var priceData = (
                <tr>
                    <td><p>Price:</p></td>
                    <td><p>${price}</p></td>
                </tr>
            );
            releaseType = 'Beacon';
            outletText = _.pluck(outlets, 'venue').join(', ');
        } else {
            outletText = outlets.join(', ');
        }

        var mockImage = null;
        if (image) {
            mockImage = image;
        }

        var artistText = artists[0].artist;
        if (artists.length > 1 && type != 'album') {
            artistText += ' feat. ' + _.pluck(_.rest(artists), 'artist').join(', ');
        }

        return (
            <div className="flex-column wizard-step">
                <p className='step-info set-flex'>Confirm your set information is correct, then click Upload.</p>
                <div className='flex-row'>
                    <div className='flex-column flex-fixed'>
                        <table className="step-button-text">
                        <tbody>
                            <tr>
                                <td><p>Genre:</p></td>
                                <td><p>{genre}</p></td>
                            </tr>
                            <tr>
                                <td><p>Set Type:</p></td>
                                <td><p>{typeText}</p></td>
                            </tr>
                            <tr>
                                <td><p>Release:</p></td>
                                <td><p>{releaseType}</p></td>
                            </tr>
                            {priceData}
                            <tr>
                                <td><p>Release Points:</p></td>
                                <td><p>{outletText}</p></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    <div className='flex-column flex-fixed'>
                        <MockSetTileImproved image={mockImage} artists={artists} event={event} episode={type == 'mix' ? episode : ''} setLength={set_length} popularity={0} />
                    </div>
                </div>
                <button className='step-button' onClick={this.props.uploadSet}>
                    Upload
                </button>
            </div>
        );
    }
});

module.exports = WizardStepConfirmation;
