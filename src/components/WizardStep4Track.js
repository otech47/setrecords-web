import React from 'react';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import Icon from './Icon';

var WizardStep4Track = React.createClass({

    render() {
        var deepLinkState = this.props.deepLinkState;
        var showUploadButton = true;

        return (
            <div className='flex-column wizard-step' id='WizardStep4'>
                <p>Enter your set information.</p>
                <div className='flex-row'>

                    <div className='flex-column flex-fixed'>
                        <div>
                            <h3>Track Name</h3>
                            <input type='text' valueLink={deepLinkState(['track'])} />
                        </div>
                        <h3>Genre</h3>
                        <input type='text' valueLink={deepLinkState(['genre'])} />
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={this.props.image} artists={this.props.artists} event={this.props.track} setLength={this.props.setLength} popularity={0} />

                        <Dropzone
                            ref='dropzone'
                            onDrop={this.props.addImage}
                            className='hidden'
                            multiple={false} />
                    </div>
                </div>
                <button className='step-button' onClick={this.submitStep}>
                    Continue
                </button>
            </div>
        );
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    submitStep: function(event) {
        var artistEmptyErr = false;
        var nameEmptyErr = false;
        var genreEmptyErr = false;
        var errors = [];

        if (_.some(_.rest(this.props.artists), function (artist) {
            return (artist.artist.length < 1);
        })) {
            artistEmptyErr = true;
            errors.push('Featured artist fields cannot be empty.');
        }

        if (this.props.event.length < 1) {
            nameEmptyErr = true;
            errors.push('Name cannot be empty.');
        }

        if (this.props.genre.length < 1) {
            genreEmptyErr = true;
            errors.push('Genre field cannot be empty.');
        }

        if (errors.length == 0) {
            this.props.stepForward();
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = WizardStep4Track;
