import React from 'react';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import Icon from './Icon';

var TrackWizardStep3 = React.createClass({

    render() {
        var {stepForward, deepLinkState, set_id, image, setLength, event, ...other} = this.props;
        var showUploadButton = false;

        if (set_id == -1) {
            showUploadButton = true;

            var tagsComponent = (
                <div>
                    <h3>Tags</h3>
                    <input type='text' valueLink={deepLinkState(['tags'])} />
                </div>
            );

            var titleComponent = (
                <div>
                    <h3>Set Title</h3>
                    <input type='text' valueLink={deepLinkState(['event'])} />
                </div>
            );
        }

        return (
            <div className='flex-column wizard-step' id='WizardStep4'>
                <p>Enter your track information.</p>
                <div className='flex-row'>

                    <div className='flex-column flex-fixed'>
                        {titleComponent || ''}

                        <div>
                            <h3>Track Title</h3>
                            <input type='text' valueLink={deepLinkState(['trackName'])} />
                        </div>
                        <div>
                            <h3>Artist</h3>
                            <input type='text' valueLink={deepLinkState(['trackArtist'])} />
                        </div>

                        {tagsComponent || ''}
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={this.props.image} artists={[this.props.originalArtist]} event={this.props.event} setLength={this.props.setLength} popularity={this.props.popularity} />

                        <Dropzone
                            ref='dropzone'
                            onDrop={this.props.addImage}
                            className='hidden'
                            multiple={false} />
                        <button className={(showUploadButton ? '':' invisible')} onClick={this.browse}>
                            Upload an image...
                        </button>
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
        var errors = [];

        if (this.props.trackArtist.length < 1) {
            errors.push('Artist field cannot be empty.');
        }

        if (this.props.trackName.length < 1) {
            errors.push('Track Title field cannot be empty.');
        }

        if (this.props.event.length < 1) {
            errors.push('Set Title cannot be empty.');
        }

        if (errors.length == 0) {
            this.props.stepForward();
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = TrackWizardStep3;
