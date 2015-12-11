import React from 'react';
import _ from 'underscore';
var constants = require('../constants/constants');
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import UtilityFunctions from '../mixins/UtilityFunctions';
import ReactDatalist from './ReactDatalist';
import Icon from './Icon';

var WizardStep4 = React.createClass({

    render() {
        var deepLinkState = this.props.deepLinkState;
        var type = deepLinkState(['type']).value;
        var mockImage = null;
        var artists = this.props.originalArtist;
        var showUploadButton = true;
        var fieldComponents;
        var featuredArtistComponent = '';

        if (this.props.image) {
            mockImage = this.props.image.preview;
        }

        if (type == 'Album') {
            fieldComponents = (
                <input type='text' valueLink={deepLinkState(['event'])} placeholder='Album Name' />
            );
        } else {
            if (this.props.featuredArtists.length > 0) {
                var featuredArtistFields = _.map(this.props.featuredArtists, (function(artist, index) {
                    return (
                        <div className='flex-row artist-field' key={index}>
                            <input type='text' list='artist-list' valueLink={deepLinkState(['featured_artists', index, 'artist'])} />
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
                var eventMatch = this.props.eventLookup[linkState('name').value];
                if (eventMatch) {
                    mockImage = constants.S3_ROOT_FOR_IMAGES + eventMatch.image_url;
                    showUploadButton = false;
                }
                var placeholder = 'Event Name';
                var listId = 'event-list';
            } else {
                var placeholder = 'Mix Name';
                var listId = 'mix-list';
                var episodeField = (
                    <input type='text' placeholder='Episode Name' valueLink={linkState('episode')} />
                );
            }

            fieldComponents = (
                <div>
                    <input type='text' valueLink={linkState('name')} placeholder={placeholder} list={listId} />
                    {episodeField ? episodeField : ''}
                </div>
            );
            if (this.props.featuredArtists.length > 0) {
                artists += ' feat. ' + this.props.featuredArtists.join(', ');
            }
        }
        var featuredArtistButton = '';
        if (this.props.type != 'Album') {
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
                        <input type='text' valueLink={linkState('genre')} placeholder='Genre' list='genre-list' />
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={mockImage} artist={artists} name={linkState('name').value} episode={this.props.type == 'Mix' ? linkState('episode').value : ''} setLength={this.props.setLength} popularity={0} />

                        <Dropzone
                            ref='dropzone'
                            onDrop={this.props.addImage}
                            className='hidden'
                            multiple={false} />

                        <button className={(showUploadButton ? '':' invisible')} onClick={this.browse}>
                            Upload an image...
                        </button>



                        <ReactDatalist key='event-datalist' options={this.props.events} objKey='event' listId='event-list' isArray={false} />
                        <ReactDatalist key='mix-datalist' options={this.props.mixes} objKey='mix' listId='mix-list' isArray={false} />
                        <ReactDatalist key='artist-datalist' options={this.props.artists} isArray={false} objKey='artist' listId='artist-list' />
                        <ReactDatalist key='genre-datalist' options={this.props.genres} isArray={false} objKey='genre' listId='genre-list' />
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
