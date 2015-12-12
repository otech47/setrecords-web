import React from 'react';
import _ from 'underscore';
var constants = require('../constants/constants');
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import UtilityFunctions from '../mixins/UtilityFunctions';
import Icon from './Icon';

var WizardStep4 = React.createClass({

    render() {
        var deepLinkState = this.props.deepLinkState;
        var type = deepLinkState(['type']).value;
        var artists = deepLinkState(['artists']).value;
        var mockImage = null;
        var showUploadButton = true;
        var fieldComponents;
        var featuredArtistComponent = '';

        if (deepLinkState(['image']).value) {
            mockImage = deepLinkState(['image', 'preview']).value;
        }

        if (type == 'Album') {
            fieldComponents = (
                <input type='text' valueLink={deepLinkState(['event'])} placeholder='Album Name' />
            );
        } else {
            if (artists.length > 1) {
                var featuredArtistFields = _.map(_.rest(artists), (function(artist, index) {
                    return (
                        <div className='flex-row artist-field' key={index}>
                            <input type='text' list='artist-list' valueLink={deepLinkState(['artists', index, 'artist'])} />
                            <i className='fa fa-times warning center' onClick={this.props.removeFeaturedArtist.bind(null, index)}/>
                        </div>
                    );
                }).bind(this));

                featuredArtistComponent = (
                    <div>
                        {featuredArtistFields}
                    </div>
                );
            }

            if (type == 'Live') {
                var placeholder = 'Event Name';
            } else {
                var placeholder = 'Mix Name';
                var episodeField = (
                    <input type='text' placeholder='Episode Name' valueLink={deepLinkState(['episode'])} />
                );
            }

            fieldComponents = (
                <div>
                    <input type='text' valueLink={deepLinkState(['event'])} placeholder={placeholder} />
                    {episodeField ? episodeField : ''}
                </div>
            );
            if (artists.length > 1) {
                // artists += ' feat. ' + this.props.featuredArtists.join(', ');
            }
        }
        var featuredArtistButton = '';
        if (type != 'Album') {
            featuredArtistButton = (
                <div className='featured-artist flex-row'>
                    <h3>Featured Artists</h3>
                    <button onClick={this.props.addFeaturedArtist}>
                        <Icon className='center'>add</Icon>
                    </button>
                </div>
            );
        }

        return (
            <div className='flex-column wizard-step' id='WizardStep4'>
                <p>Enter your set information.</p>
                <div className='flex-row'>

                    <div className='flex-column flex-fixed'>
                        {featuredArtistButton}
                        {featuredArtistComponent}
                        {fieldComponents}
                        <input type='text' valueLink={deepLinkState(['genre'])} placeholder='Genre' />
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={mockImage} artist={'NODEX'} name={deepLinkState(['event']).value} episode={type == 'Mix' ? deepLinkState(['episode']).value : ''} setLength={deepLinkState(['set_length']).value} popularity={0} />

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
        var artistEmptyErr = false;
        var linkState = this.props.linkState;
        var nameEmptyErr = false;
        var genreErr = false;
        var errors = [];

        if (linkState('artist').value == '') {
            artistEmptyErr = true;
            errors.push('Artist field cannot be empty.');
        }
        if (linkState('name').value == 0) {
            nameEmptyErr = true;
            errors.push('Name cannot be empty.');
        }
        var genreMatch = _.findWhere(this.props.genres, {genre: linkState('genre').value});
        if (!genreMatch) {
            genreErr = true;
            errors.push('Genre must be selected from dropdown.');
        }
        if (errors.length == 0) {
            var submission = {};
            submission['match_url'] = null;
            if (this.props.type == 'Live') {
                var match = this.props.eventLookup[linkState('name').value];
                if (match) {
                    submission['match_url'] = match.image_url;
                }
            }
            this.props.stepForward(submission);
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = WizardStep4;
