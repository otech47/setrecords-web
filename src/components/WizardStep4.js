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
        var showUploadButton = true;
        var fieldComponents;
        var featuredArtistComponent = '';

        if (type == 'Album') {
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
                    <h3>{placeholder}</h3>
                    <input type='text' valueLink={deepLinkState(['event'])} />
                    {episodeField ? episodeField : ''}
                </div>
            );
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
                        <h3>Genre</h3>
                        <input type='text' valueLink={deepLinkState(['genre'])} />
                    </div>

                    <div className='flex-column flex-fixed' style={{alignItems: 'center'}}>
                        <MockSetTileImproved image={this.props.image} artists={this.props.artists} event={this.props.event} episode={type == 'Mix' ? this.props.episode : ''} setLength={this.props.setLength} popularity={0} />

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

module.exports = WizardStep4;
