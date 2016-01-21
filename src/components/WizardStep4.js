import React from 'react';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import Icon from './Icon';

var WizardStep4 = React.createClass({

    render() {
        var deepLinkState = this.props.deepLinkState;
        var type = this.props.type;
        var artists = this.props.artists;
        var tags = this.props.tags;
        var showUploadButton = true;
        var fieldComponents;
        var featuredArtistComponent = '';
        var tagComponent = '';

        console.log(tags);
        console.log(tags.length);

        if (type == 'album') {
            fieldComponents = (
                <input type='text' valueLink={deepLinkState(['event'])} placeholder='Album Name' />
            );
        } else {
            if (artists.length > 1) {
                var featuredArtistFields = _.map(_.rest(artists), (function(artist, index) {
                    return (
                        <div className='flex-row artist-field' key={index + 1}>
                            <input type='text' list='artist-list' valueLink={deepLinkState(['artists', (index + 1), 'artist'])} placeholder='Featured artist' />
                            <i className='fa fa-times warning center' onClick={this.props.removeFeaturedArtist.bind(null, (index + 1))}/>
                        </div>
                    );
                }).bind(this));

                featuredArtistComponent = (
                    <div>
                        {featuredArtistFields}
                    </div>
                );
            }

            if (type == 'festival') {
                var placeholder = 'Event Name';
            } else {
                var placeholder = 'Mix Name';
                var episodeField = (
                    <input type='text' placeholder='Episode Name' valueLink={deepLinkState(['episode'])} />
                );
            }

            fieldComponents = (
                <div>
                    <h3>{placeholder}</h3>
                    <input type='text' valueLink={deepLinkState(['event'])} />
                    {episodeField ? episodeField : ''}
                </div>
            );
        }

        var featuredArtistButton = '';
        if (type != 'album') {
            featuredArtistButton = (
                <div className='featured-artist flex-row'>
                    <h3>Featured Artists</h3>
                    <button onClick={this.props.addFeaturedArtist}>
                        <Icon className='center'>add</Icon>
                    </button>
                </div>
            );
        }

        var tagButton = (
            <div className='featured-artist flex-row'>
                <h3>Genres</h3>
                <button onClick={this.props.addTag}>
                    <Icon className='center'>add</Icon>
                </button>
            </div>
        );

        if (tags.length > 0) {
            var tagFields = _.map(tags, (function(tag, index) {
                return (
                    <div className='flex-row artist-field' key={index}>
                        <input type='text' list='artist-list' valueLink={deepLinkState(['tags', index])} placeholder='Genre name' />
                        <i className='fa fa-times warning center' onClick={this.props.removeTag.bind(null, index)}/>
                    </div>
                );
            }).bind(this));

            tagComponent = (
                <div>
                    {tagFields}
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

                        {tagButton}
                        {tagComponent}
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={this.props.image} artists={this.props.artists} event={this.props.event} episode={type == 'mix' ? this.props.episode : ''} setLength={this.props.setLength} popularity={0} />

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
        var nameEmptyErr = false;
        var noTagsErr = false;
        var tagEmptyErr = false;
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

        if (this.props.tags.length < 1) {
            noTagsErr = true;
            errors.push('You must enter at least one genre.');
        } else {
            if (_.some(this.props.tags, function (tag) {
                return (tag.length == 0);
            })) {
                tagEmptyErr = true;
                errors.push('Genre fields cannot be empty.');
            }
        }

        if (errors.length == 0) {
            this.props.stepForward();
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = WizardStep4;
