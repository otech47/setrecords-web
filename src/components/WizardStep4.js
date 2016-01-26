import React from 'react';
import _ from 'underscore';
import Dropzone from 'react-dropzone';
import MockSetTileImproved from './MockSetTileImproved';
import Icon from './Icon';
import ReactDatalist from './ReactDatalist';
import constants from '../constants/constants';

var WizardStep4 = React.createClass({
    componentDidMount: function() {
        this.getDatalists();
    },

    render() {
        var deepLinkState = this.props.deepLinkState;
        var type = this.props.type;
        var artists = this.props.artists;
        var tags = this.props.tags;
        var showUploadButton = true;
        var fieldComponents;
        var featuredArtistComponent = '';
        var tagComponent = '';

        var image = this.props.image;

        if (type == 'album') {
            fieldComponents = (
                <div>
                    <h3>Album</h3>
                    <input type='text' valueLink={deepLinkState(['event'])} placeholder='Album Name' />
                </div>
            );
        } else {
            if (artists.length > 1) {
                var featuredArtistFields = _.map(_.rest(artists), (function(artist, index) {
                    return (
                        <div className='flex-row artist-field' key={index + 1}>
                            <input type='text' list='artists-datalist' valueLink={deepLinkState(['artists', (index + 1), 'artist'])} placeholder='Featured artist' />
                            <i className='fa fa-times warning center' onClick={this.props.removeFeaturedArtist.bind(null, (index + 1))}/>
                            <ReactDatalist listId='artists-datalist' options={this.props.artistList} sort={'ASC'} />
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
                var placeholder = 'Festival Name';

                if (this.props.event.length > 0 && this.props.eventLookup[this.props.event]) {
                    image = {
                        preview: constants.S3_ROOT_FOR_IMAGES + this.props.eventLookup[this.props.event][0].banner_image.imageURL
                    };
                    showUploadButton = false;
                }

                fieldComponents = (
                    <div>
                        <h3>{placeholder.split(' ')[0]}</h3>
                        <input type='text' valueLink={deepLinkState(['event'])} list='events-datalist' placeholder={placeholder} />
                    </div>
                );
            } else {
                if (type == 'show') {
                    var placeholder = 'Show Name';
                }

                else {
                    var placeholder = 'Mix Name';
                    var episodeField = (
                        <input type='text' placeholder='Episode Name' valueLink={deepLinkState(['episode'])} />
                    );
                }

                fieldComponents = (
                    <div>
                        <h3>{placeholder.split(' ')[0]}</h3>
                        <input type='text' valueLink={deepLinkState(['event'])} list='events-datalist' placeholder={placeholder} />
                        {episodeField ? episodeField : ''}
                    </div>
                );
            }
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
                        <input type='text' list='tags-datalist' valueLink={deepLinkState(['tags', index])} placeholder='Genre Name' />
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
                        <MockSetTileImproved image={image} artists={this.props.artists} event={this.props.event} episode={type == 'mix' ? this.props.episode : ''} setLength={this.props.setLength} popularity={0} />

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

                <ReactDatalist listId='tags-datalist' options={this.props.tagList} sort={'ASC'} />
                <ReactDatalist listId='events-datalist' options={this.props.eventList} sort={'DESC'} />
            </div>
        );
    },

    getDatalists: function () {
        var query = `{
            tags {
                optionName: tag
            },
        `;

        if (this.props.type != 'album') {
            query += `
                events (type: \"${this.props.type}\") {
                    optionName: event,
                    banner_image {
                        imageURL
                    }
                },
                artists {
                    optionName: artist
                },
            `;
        }

        query += '}';

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';
        $.ajax({
            type: 'get',
            url: requestUrl,
            data: {
                query: query
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done( (res) => {
            // console.log(res);
            var eventLookup = _.groupBy(res.payload.events, function (event) {
                return event.optionName;
            });

            this.props.loadDatalists({
                tagList: res.payload.tags,
                eventList: res.payload.events,
                eventLookup: eventLookup,
                artistList: res.payload.artists
            });
        })
        .fail( (err) => {
            // console.log(err);
        });
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
            if (this.props.eventLookup[this.props.event]) {
                this.props.stepForward({
                    existingImage: this.props.eventLookup[this.props.event][0].banner_image.imageURL
                });
            } else {
                this.props.stepForward({
                    existingImage: null
                });
            }
        } else {
            alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
        }
    }
});

module.exports = WizardStep4;
