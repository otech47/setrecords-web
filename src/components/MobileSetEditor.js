import React from 'react';
import moment from 'moment';
import update from 'react-addons-update';
import _ from 'underscore';
import R from 'ramda';
import async from 'async';
import constants from '../constants/constants';
import {History, Lifecycle} from 'react-router';
import Loader from 'react-loader';

import {Motion, spring, presets} from 'react-motion';
import ConfirmChanges from './ConfirmChanges';
import Notification from './Notification';
import Icon from './Icon';
import Tracklist from './Tracklist';
import Dropzone from 'react-dropzone';

var MobileSetEditor = React.createClass({

    mixins: [History, Lifecycle],

    getInitialState: function() {
        return {
            uploadedImage: [],
            busy: false,
            applying: false,
            success: false,
            failure: false,
            open: false,
            notify: false
        }
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Edit Set',
                loaded: false
            }
        });
    },

    componentDidMount: function() {
        this.getSetById(this.props.params.id);
    },

    routerWillLeave: function (nextLocation) {
        if (this.hasChanges()) {
            return ('You have unsaved changes that will be lost. Are you sure you want to leave?');
        }
    },

    render: function() {
        var deepLinkState = this.deepLinkState;
        var episodeComponent;
        var editTitleComponent;

        if (this.state.event && this.state.event.is_radiomix) {
            if (this.state.episode) {
                episodeComponent = (
                    <div className='center'>
                        <h1>Episode Name {this.checkChangedField(['episode', 'episode']) ? <span className='warning'>*</span> : ''}</h1>
                        <input type='text' valueLink={deepLinkState(['episode', 'episode'])} />
                    </div>
                )
            }

            var image;
            if (this.state.uploadedImage.length > 0) {
                image = this.state.uploadedImage[0].preview;
            } else if (this.state.icon_image && this.state.icon_image.imageURL) {
                image = constants.S3_ROOT_FOR_IMAGES + this.state.icon_image.imageURL;
            } else {
                image = constants.S3_ROOT_FOR_IMAGES + this.state.event.banner_image.imageURL;
            }

            editTitleComponent = (
                <div className='edit-mix flex-column form-panel'>
                    <img src={image} />
                    <Dropzone onDrop={this.onDrop} className='hidden' ref='dropzone' multiple={false} />
                    <button onClick={this.browse} className='dropzone flex-container center'>
                        <Icon>open_in_browser</Icon>
                          <p>Upload a new set image</p>
                    </button>

                    <div className='center'>
                        <h1>Mix Name {this.checkChangedField(['event', 'event']) ? <span className='warning'>*</span> : ''}</h1>
                        <input type='text' className='MixTitle' valueLink={deepLinkState(['event', 'event'])} />
                    </div>

                    {episodeComponent}
                </div>
            );
        }

        var statusMessage;
        if (this.state.busy) {
            if (this.state.success) {
                statusMessage = 'Your changes have been applied.';
            } else if (this.state.failure) {
                statusMessage = 'There was an error applying your changes. Please try again.';
            } else {
                statusMessage = 'Applying changes...';
            }
        }

        return (
            <Loader loaded={this.props.loaded}>
                <div className='flex-column' id='SetEditor'>

                    <Motion style={{
                        opacity: spring(this.state.notify ? 1 : 0, presets.gentle),
                        visibility: this.state.notify ? 'visible' : 'hidden'
                    }}>
                        {
                            ({opacity, visibility}) =>
                            <Notification dismiss={() => this.history.pushState(null, '/content')} style={{
                                opacity: `${opacity}`,
                                visibility: `${visibility}`
                            }}>
                                {statusMessage}
                            </Notification>
                        }
                    </Motion>

                    {editTitleComponent}

                    <Tracklist
                        deepLinkState={deepLinkState}
                        setLength={this.state.set_length}
                        addTrack={this.addTrack}
                        deleteTrack={this.deleteTrack}
                        tracklistUrl={this.state.tracklist_url}
                        tracklist={this.state.tracklist || []}
                        loadTracksFromUrl={this.loadTracksFromUrl} />

                    <div className='flex-row form-panel center' id='apply-changes'>
                        <div className='flex-fixed apply flex-container' onClick={this.applyChanges}>
                            Apply
                        </div>
                        <div className='flex-fixed revert flex-container' onClick={this.revertChanges}>
                            Revert
                        </div>
                        <div className='flex-fixed cancel flex-container' onClick={this.cancelChanges}>
                            Cancel
                        </div>
                    </div>

                </div>
            </Loader>
        );
    },

    checkChangedField: function (fieldArray) {
        var potential = this.deepLinkState(fieldArray).value;

        var reference = this.deepLinkState(['originalSet'].concat(fieldArray)).value;

        return potential != reference;
    },

    addTrack: function() {
        var newTrack = {
            'starttime': '00:00',
            'artistname': this.props.originalArtist.artist,
            'songname': 'untitled'
        };

        this.setState({
            tracklist: update(this.state.tracklist, {$push: [newTrack]}),
        });
    },

    deleteTrack: function(index) {
        this.setState({
            tracklist: update(this.state.tracklist, {$splice: [[index, 1]]})
        });
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    onDrop: function(file) {
        if (file[0].type == 'image/png' || file[0].type == 'image/jpeg' || file[0].type == 'image/gif') {
            this.setState({
                uploadedImage: file
            });
        } else {
            alert('Please upload a png, jpeg, or gif image.');
        }
    },

    deepLinkState: function (keyArray) {
        return {
            value: this.getValue(keyArray),
            requestChange: function (value) {
                this.setValue(keyArray, value);
            }.bind(this)
        }
    },

    getValue: function (keyArray) {
        var output = _.reduce(keyArray, function (counter, current) {
            return counter[current];
        }, this.state);
        return output;
    },

    setValue: function(keyArray, value) {
        var updateObject = _.reduceRight(_.rest(keyArray), function(counter, current) {
            var innerUpdate = {};
            innerUpdate[current] = counter;
            return innerUpdate;
        }, {$set: value});

        var newState = {};
        newState[ keyArray[0] ] = update(this.state[ keyArray[0] ], updateObject);
        this.setState(newState);
    },

    revertChanges: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                loaded: false
            }
        });

        this.getSetById(this.props.params.id);
        this.setState(this.getInitialState());
    },

    cancelChanges: function() {
        this.history.pushState(null, '/content');
    },

    hasChanges: function() {
        var referenceObject = _.extend(this.getInitialState(), this.state.originalSet);

        var changes = _.some(referenceObject, (value, key) => {
            return !(_.isEqual(value, this.state[key]));
        });

        return changes;
    },

    newImage(callback) {
        console.log('New set image pending:')
        console.log(this.state.uploadedImage);

        async.waterfall([this.registerImageS3, this.updateImageDatabase],
            function(err, results) {
                if (err) {
                    console.log('Error occurred while updating image. ', err);
                    callback(err);
                } else {
                    console.log('Set image updated.');
                    callback(null);
                }
            }
        );
    },

    registerImageS3(callback) {
        console.log('Requesting encoding from AWS...');
        var file = this.state.uploadedImage[0];
        var uniqueFilename = moment().unix() + file.name;

        $.ajax({
            type: 'POST',
            url: 'https://api.setmine.com/v/10/aws/configureAWS',
            data: {
                filename: encodeURIComponent(uniqueFilename)
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('Encoding successful.');
            AWS.config.update(res.payload.settings);
            var encodedFilename = res.payload.encoded;
            var filesize = file.size;
            var s3 = new AWS.S3();

            s3.timeout = 50000;
            var params = {
                Bucket: 'stredm',
                Key: 'namecheap/' + encodedFilename,
                ContentType: file.type,
                Body: file
            };

            var upload = s3.upload(params);

            upload.on('httpUploadProgress', function(event) {
                var percentage = (event.loaded / filesize) * 100;
                var percent = parseInt(percentage).toString() + '%';
                console.log('Uploading image: ' + percent);
            });

            console.log('Uploading file to S3...');
            upload.send((err, data) => {
                if (err) {
                    console.log('An error occurred uploading the file to S3.');
                    callback(err);
                } else {
                    console.log('Upload successful. File located at: ' + data.Location);
                    callback(null, res.payload.encoded);
                }
            });
        })
        .fail((err) => {
            console.log('There was an error encoding the file.');
            callback(err);
        });
    },

    updateImageDatabase(imageURL, callback) {
        console.log('Adding image to databases...');
        var requestURL = 'https://api.setmine.com/v/10/sets/image';
        $.ajax({
            type: 'POST',
            url: requestURL,
            data: {
                image_url: imageURL,
                set_id: this.props.params.id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('Image successfully added to database.')
            callback(null);
        })
        .fail((err) => {
            console.log('Error adding image to database.');
            callback(err);
        });
    },

    newTitle(callback) {
        console.log('New set title pending.');
        console.log(this.state.event.event);

        var requestUrl = 'https://api.setmine.com/v/10/sets/event';
        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                event_name: this.state.event.event,
                set_id: this.props.params.id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('Set title updated on database.');
            callback(null);
        })
        .fail((err) => {
            console.log('Error updating set title on database.');
            callback(err);
        });
    },

    applyChanges() {
        var pendingSet = this.state;
        var changeFunctions = [];

        if (pendingSet.uploadedImage.length > 0) {
            changeFunctions.push(this.newImage);
        }

        if (pendingSet.event != pendingSet.originalSet.event) {
            changeFunctions.push(this.newTitle);
        }

        if (pendingSet.episode != pendingSet.originalSet.episode) {
            changeFunctions.push(this.newEpisodeTitle);
        }

        if (!(_.isEqual(pendingSet.tracklist, pendingSet.originalSet.tracklist))) {
            changeFunctions.push(this.newTracks);
        }

        console.log('Changes to do');
        console.log(changeFunctions);
        console.log('Applying changes...');

        this.setState({
            busy: true,
            applying: true
        }, () => {
            async.parallel(changeFunctions, (err, results) => {
                if (err) {
                    console.log('There was an error when applying changes to this set.');
                    console.log(err);

                    this.setState({
                        failure: true,
                        applying: false,
                        notify: true
                    });

                    // mixpanel.track("Error", {
                    //     "Page": "Set Editor",
                    //     "Message": "Error applying changes"
                    // });
                } else {
                    console.log('All changes applied successfully.');

                    this.setState({
                        applying: false,
                        success: true,
                        notify: true
                    });
                }
            });
        });
    },

    newEpisodeTitle(callback) {
        console.log('New episode title pending.');
        console.log(this.state.episode.episode);

        var requestUrl = 'https://api.setmine.com/v/10/sets/episode';

        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                episode: this.state.episode.episode,
                set_id: this.props.params.id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('Episode title updated on database.');
            callback(null);
        })
        .fail((err) => {
            console.log('An error occurred when updating episode title on database.');
            callback(err);
        });
    },

    newTracks(callback) {
        console.log('New tracks pending.');
        console.log(this.state.tracklist);

        var requestUrl = 'https://api.setmine.com/v/10/sets/tracklist';

        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                tracklist: this.state.tracklist,
                set_id: this.props.params.id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('Tracklist updated on database.');
            callback(null);
        })
        .fail((err) => {
            console.log('An error occurred updating the tracks on the database.');
            callback(err);
        });
    },

    getSetById: function(setId) {
        var query = `{
            set (id: ${setId}) {
                id,
                icon_image {
                    imageURL
                },
                event {
                    event,
                    is_radiomix,
                    banner_image {
                        imageURL
                    }
                },
                episode {
                    episode
                },
                tracklist: tracks {
                    songname,
                    artistname,
                    starttime
                },
                popularity,
                set_length,
                tracklistURL,
                artists {
                    id,
                    artist
                }
            }
        }`;

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';
        $.ajax({
            type: 'GET',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                query: query
            }
        })
        .done((res) => {
            console.log(res);
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: true,
                    header: `Edit Set - ${res.payload.set.event.event}`
                }
            });

            this.setState(_.extend(res.payload.set, {
                originalSet: res.payload.set
            }));
        })
        .fail((err) => {
            console.error(err);
        });
    },

    loadTracksFromUrl: function (url) {
        console.log('Requested to load ' + url);

        var requestUrl = 'https://api.setmine.com/v/10/sets/1001tracklist';

        $.ajax({
            type: 'post',
            url: requestUrl,
            data: {
                set_id: this.props.params.id,
                tracklist_url: url
            },
            crossDoman: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log(res);
            this.setState({
                tracklist: res.payload
            });
        })
        .fail((err) => {
            console.log(err);
            alert('Please enter a valid 1001 tracklists URL.');
        });
    },
});

module.exports = MobileSetEditor;
