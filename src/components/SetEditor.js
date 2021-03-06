import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import React from 'react';
import moment from 'moment';
import update from 'react-addons-update';
import _ from 'underscore';
import R from 'ramda';
import async from 'async';
import constants from '../constants/constants';
import {History, Lifecycle} from 'react-router';
import Loader from 'react-loader';

import UtilityFunctions from '../mixins/UtilityFunctions';
import {Motion, spring, presets} from 'react-motion';
import Notification from './Notification';
import Icon from './Icon';
import Tracklist from './Tracklist';
import Dropzone from 'react-dropzone';

var MobileSetEditor = React.createClass({

    mixins: [History, Lifecycle, UtilityFunctions],

    getInitialState: function() {
        return {
            uploadedImage: [],
            busy: false,
            delete: false,
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
        const deleteActions = [
            <FlatButton label='Cancel' secondary={true} keyboardFocused={true} onClick={this.closeDeleteDialog} onTouchTap={this.closeDeleteDialog} />,
            <FlatButton label='Delete Set' primary={true} onClick={this.confirmDeletion} onTouchTap={this.confirmDeletion} />
        ];

        var deepLinkState = this.deepLinkState;
        var episodeComponent;
        var editTitleComponent;

        if (this.state.event && (this.state.event.type != 'festival')) {
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
                            <Notification dismiss={() => {
                                this.setState(this.getInitialState());
                                this.history.pushState(null, '/content');
                                }}
                                style={{
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
                        estimateStartTimes={this.estimateStartTimes}
                        addTrack={this.addTrack}
                        deleteTrack={this.deleteTrack}
                        tracklistUrl={this.state.tracklist_url}
                        tracklist={this.state.tracklist || []}
                        loadTracksFromUrl={this.loadTracksFromUrl} />

                    <button className='delete-button' onClick={this.deleteSet}>Delete Set</button>
                    <Dialog title='Delete Set' actions={deleteActions} modal={false} open={this.state.delete} onRequestClose={this.closeDeleteDialog}>
                        Deleting this set will remove it from Setmine and any active Beacon offers. Are you sure you want to delete this set?
                    </Dialog>

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

    deleteSet: function(e) {
        // console.log('Delete set ', this.props.params.id);
        this.setState({
            delete: true
        });
    },

    closeDeleteDialog: function(e) {
        // console.log('Deletion aborted.');
        this.setState({
            delete: false
        });
    },

    confirmDeletion: function(e) {
        // console.log('Deletion confirmed!');
        var requestUrl = 'https://api.setmine.com/v/10/sets/delete';
        $.ajax({
            type: 'delete',
            url: requestUrl,
            data: {
                artist_id: this.props.originalArtist.id,
                set_id: this.props.params.id
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            // console.log(res);
            mixpanel.track('Set deleted successfully');
            this.history.pushState(null, '/content');
        })
        .fail((err) => {
            // console.log(err);
            mixpanel.track("Error", {
                "Page": "Set Editor",
                "Message": "Error deleting set"
            });
            alert('Failed to delete the set. If the problem persists, please contact us at support@setmine.com');
            this.setState({
                delete: false
            });
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
        var referenceObject = _.extend({
            uploadedImage: []
        }, this.state.originalSet);

        var changes = _.some(referenceObject, (value, key) => {
            if (!(_.isEqual(value, this.state[key]))) {
                // console.log(value + ' did not match ' + this.state[key]);
                // console.log(referenceObject);
                // console.log(key);
            }
            return !(_.isEqual(value, this.state[key]));
        });

        return changes;
    },

    newImage(callback) {
        // console.log('New set image pending:')
        // console.log(this.state.uploadedImage);

        async.waterfall([this.registerImageS3, this.updateImageDatabase],
            function(err, results) {
                if (err) {
                    // console.log('Error occurred while updating image. ', err);
                    callback(err);
                } else {
                    // console.log('Set image updated.');
                    callback(null);
                }
            }
        );
    },

    registerImageS3(callback) {
        // console.log('Requesting encoding from AWS...');
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
            // console.log('Encoding successful.');
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
                // console.log('Uploading image: ' + percent);
            });

            // console.log('Uploading file to S3...');
            upload.send((err, data) => {
                if (err) {
                    // console.log('An error occurred uploading the file to S3.');
                    callback(err);
                } else {
                    // console.log('Upload successful. File located at: ' + data.Location);
                    callback(null, res.payload.encoded);
                }
            });
        })
        .fail((err) => {
            // console.log('There was an error encoding the file.');
            callback(err);
        });
    },

    updateImageDatabase(imageURL, callback) {
        // console.log('Adding image to databases...');
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
            // console.log('Image successfully added to database.')
            mixpanel.track('Image uploaded successfully');
            callback(null);
        })
        .fail((err) => {
            // console.log('Error adding image to database.');
            mixpanel.track("Error", {
                "Page": "Set Editor",
                "Message": "Error changing set image"
            });
            callback(err);
        });
    },

    newTitle(callback) {
        // console.log('New set title pending.');
        // console.log(this.state.event.event);

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
            // console.log('Set title updated on database.');
            mixpanel.track('Set title changed successfully');
            callback(null);
        })
        .fail((err) => {
            // console.log('Error updating set title on database.');
            mixpanel.track("Error", {
                "Page": "Set Editor",
                "Message": "Error updating set title"
            });
            callback(err);
        });
    },

    applyChanges() {
        var pendingSet = this.state;

        var errors = [];
        if (pendingSet.event != pendingSet.originalSet.event && pendingSet.event.event.length < 1) {
            errors.push('The title for your set cannot be empty.');
        }

        if (errors.length > 0) {
            alert('Please correct the following errors:\n' + errors.join('\n'));
        } else {
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loadingModal: true
                }
            });

            var changeFunctions = [];

            if (pendingSet.uploadedImage.length > 0) {
                changeFunctions.push(this.newImage);
            }

            if (pendingSet.event.event != pendingSet.originalSet.event.event) {
                changeFunctions.push(this.newTitle);
            }

            if (pendingSet.episode != pendingSet.originalSet.episode) {
                changeFunctions.push(this.newEpisodeTitle);
            }

            if (!(_.isEqual(pendingSet.tracklist, pendingSet.originalSet.tracklist))) {
                changeFunctions.push(this.newTracks);
            }

            // console.log('Changes to do');
            // console.log(changeFunctions);
            // console.log('Applying changes...');

            this.setState({
                busy: true,
                applying: true
            }, () => {
                async.parallel(changeFunctions, (err, results) => {
                    this.props.push({
                        type: 'SHALLOW_MERGE',
                        data: {
                            loadingModal: false
                        }
                    });
                    if (err) {
                        // console.log('There was an error when applying changes to this set.');
                        // console.log(err);

                        this.setState({
                            failure: true,
                            applying: false,
                            notify: true
                        });

                        mixpanel.track("Error", {
                            "Page": "Set Editor",
                            "Message": err
                        });
                    } else {
                        // console.log('All changes applied successfully.');

                        this.getSetById(this.props.params.id);
                        mixpanel.track('Set edited successfully');

                        this.setState({
                            applying: false,
                            success: true,
                            notify: true
                        });
                    }
                });
            });
        }
    },

    newEpisodeTitle(callback) {
        // console.log('New episode title pending.');
        // console.log(this.state.episode.episode);

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
            // console.log('Episode title updated on database.');
            mixpanel.track('Episode title changed successfully');
            callback(null);
        })
        .fail((err) => {
            // console.log('An error occurred when updating episode title on database.');
            mixpanel.track("Error", {
                "Page": "Set Editor",
                "Message": "Error updating episode title"
            });
            callback(err);
        });
    },

    newTracks(callback) {
        // console.log('New tracks pending.');
        // console.log(this.state.tracklist);

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
            // console.log('Tracklist updated on database.');
            mixpanel.track('Tracklist changed successfully');
            callback(null);
        })
        .fail((err) => {
            // console.log('An error occurred updating the tracks on the database.');
            mixpanel.track("Error", {
                "Page": "Set Editor",
                "Message": "Error updating tracklist"
            });
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
                    banner_image {
                        imageURL
                    },
                    type
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

        var requestUrl = 'https://api.setmine.com/v/11/graph';
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
            // console.log(res);
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: true,
                    header: `Edit Set - ${res.data.set.event.event}`
                }
            });

            this.setState(_.extend(res.data.set, {
                originalSet: res.data.set
            }));
        })
        .fail((err) => {
            // console.error(err);
        });
    },

    estimateStartTimes: function(e) {
        e.preventDefault();
        var tracklist = this.state.tracklist;
        var setLength = this.timeStringToSeconds(this.state.set_length);

        if (tracklist.length > 0) {
            _.each(tracklist, (track, index) => {
                var updateObj = {};

                updateObj[index] = {$apply: (track) => {
                    var newTime = index/tracklist.length * setLength;
                    track.starttime = this.secondsToMinutes(newTime);
                    return track;
                }};
                tracklist = update(tracklist, updateObj);
            });

            this.setState({
                tracklist: tracklist
            });
        }
    },

    loadTracksFromUrl: function (url) {
        // console.log('Requested to load ' + url);

        var requestUrl = 'https://api.setmine.com/v/10/sets/1001tracklist';

        $.ajax({
            type: 'post',
            url: requestUrl,
            data: {
                set_id: this.props.params.id,
                tracklist_url: url
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            // console.log(res);
            this.setState({
                tracklist: res.payload
            });
        })
        .fail((err) => {
            // console.log(err);
            alert('Please enter a valid 1001 tracklists URL.');
        });
    },
});

module.exports = MobileSetEditor;
