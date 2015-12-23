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
            changes: false,
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
                        <h1>Episode Name</h1>
                        <input type='text' valueLink={deepLinkState(['episode', 'episode'])} />
                    </div>
                )
            }

            var image = this.state.uploadedImage.length > 0 ? this.state.uploadedImage[0].preview : constants.S3_ROOT_FOR_IMAGES + this.state.event.banner_image.imageURL;

            editTitleComponent = (
                <div className='edit-mix flex-column form-panel'>
                    <img src={image} />
                    <Dropzone onDrop={this.onDrop} className='hidden' ref='dropzone' multiple={false} />
                    <button onClick={this.browse} className='dropzone flex-container center'>
                        <Icon>open_in_browser</Icon>
                          <p>Upload a new set image</p>
                    </button>

                    <div className='center'>
                        <h1>Mix Name</h1>
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
                            <Notification dismiss={() => this.history.push(null, '/')} style={{
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
                        tracklist={this.state.tracklist || []} />

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

    addTrack: function() {
        var newTrack = {
            'id': -1,
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
        return true;
    },

    applyChanges() {
        var pendingSet = this.state;

        if (pendingSet.changes) {
            console.log('Pending changes found.');
            var changeFunctions = [];
            if (pendingSet.tile_image.length > 0) {
                changeFunctions.push(this.newImage);
            }
            if (pendingSet.event != this.state.set.event) {
                changeFunctions.push(this.newTitle);
            }
            if (pendingSet.episode != this.state.set.episode) {
                changeFunctions.push(this.newEpisodeTitle);
            }
            // console.log('Comparing tracklists to determine a change...');
            var originalTracklist = R.clone(this.state.set.tracklist);
            var pendingTracklist = this.state.tracklist;
            // console.log('PENDING');
            // console.log(pendingTracklist);
            // console.log('ORIGINAL');
            // console.log(originalTracklist);

            // var tracklistChanged = !(_.isEqual(pendingTracklist, originalTracklist));
            var tracklistChanged = !(R.equals(pendingTracklist, originalTracklist));

            // console.log('Change?');
            // console.log(tracklistChanged);

            if (tracklistChanged) {
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
                        }, () => {
                            setTimeout(() => {
                                this.history.push(null, '/');
                            }, 1000);
                        });
                        mixpanel.track("Error", {
                            "Page": "Set Editor",
                            "Message": "Error applying changes"
                        });
                    } else {
                            console.log('All changes applied successfully.');
                            this.setState({
                                applying: false,
                                success: true,
                                notify: true
                            }, () => {
                                setTimeout(() => {
                                    this.history.push(null, '/');
                                }, 1000);
                            });
                        }
                });
            });

        } else {
            console.log('No pending changes. Closing window...');
            this.props.close(false);
        }
    },

    getSetById: function(setId) {
        var query = `{
            set (id: ${setId}) {
                id,
                event {
                    event,
                    is_radiomix,
                    banner_image {
                        imageURL
                    }
                },
                episode {
                    episode,
                    icon_image {
                        imageURL
                    }
                },
                tracklist: tracks {
                    id,
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

        $.ajax({
            type: 'post',
            url: 'http://localhost:3000/v/10/setrecords',
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
});

module.exports = MobileSetEditor;





//
//
// newEpisodeTitle(callback) {
//     // console.log('New episode title pending.');
//     // console.log(this.state.episode);
//     var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/episode/' + this.state.episode_id;
//     var pendingEpisode = this.state.episode;
//     $.ajax({
//         type: 'POST',
//         url: requestURL,
//         data: {
//             episode: pendingEpisode
//         },
//         success: function(res) {
//             // console.log('Episode title updated on database.');
//             callback(null);
//         },
//         error: function(err) {
//             // console.log('An error occurred when updating episode title on database.');
//             callback(err);
//         }
//     });
// },
//
// newImage(callback) {
//     // console.log('New tile image pending:')
//     // console.log(this.state.tile_image);
//     async.waterfall([this.registerImageS3, this.updateImageDatabase],
//         function(err, results) {
//             if (err) {
//                 // console.log('Error occurred while updating image. ', err);
//                 callback(err);
//             } else {
//                 // console.log('Tile image updated.');
//                 callback(null);
//             }
//         }
//     );
// },
//
// newTitle(callback) {
//     // console.log('New set title pending.');
//     // console.log(this.state.event);
//     var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/title/' + this.state.set.id;
//     var pendingTitle = this.state.event;
//     $.ajax({
//         type: 'POST',
//         url: requestURL,
//         data: {
//             event: pendingTitle
//         }
//     })
//     .done((res) => {
//         callback(null);
//     })
//     .fail((err) => {
//         callback(err);
//     });
// },
//
// newTracks(callback) {
//     // console.log('New tracks pending.');
//     // console.log(this.state.tracklist);
//     var pendingTracklist = this.state.tracklist;
//     var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/tracklist/' + this.state.set.id;
//     $.ajax({
//         type: 'POST',
//         url: requestURL,
//         data: {
//             tracklist: pendingTracklist
//         }
//     })
//     .done((res) => {
//         callback(null);
//     })
//     .fail((err) => {
//         callback(err);
//     });
// },
//

//

//
// registerImageS3(callback) {
//     var file = this.state.tile_image[0];
//     // console.log('Requesting encoding from AWS...');
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost:3000/aws/configureAWS?filename=' + encodeURIComponent(file.name),
//         contentType: 'application/json',
//         success: function(response) {
//             // console.log('Encoding successful.');
//             AWS.config.update(response.settings);
//             var encodedFilename = response.encoded;
//             var filesize = file.size;
//             var s3 = new AWS.S3();
//
//             s3.timeout = 50000;
//             var params = {
//                 Bucket: 'stredm',
//                 Key: 'namecheap/' + encodedFilename,
//                 ContentType: file.type,
//                 Body: file
//             };
//             var upload = s3.upload(params);
//             // upload.on('httpUploadProgress', function(event) {
//             //     var percentage = (event.loaded / filesize) * 100;
//             //     var percent = parseInt(percentage).toString() + '%';
//             //     console.log('Uploading image: ' + percent);
//             // });
//
//             // console.log('Uploading file to S3...');
//             upload.send(function(err, data) {
//                 if (err) {
//                     // console.log('An error occurred uploading the file to S3.');
//                     callback(err);
//                 } else {
//                     // console.log('Upload successful. File located at: ' + data.Location);
//                     callback(null, response.encoded);
//                 }
//             });
//         },
//         error: function(err) {
//             // console.log('There was an error encoding the file.');
//             callback(err);
//         }
//     });
// },
//

//
// updateImageDatabase(imageURL, callback) {
//     // console.log('Adding image to databases...');
//     var requestURL = 'http://localhost:3000/api/v/7/setrecords/mix/image/' + this.state.set.id;
//     $.ajax({
//         type: 'POST',
//         url: requestURL,
//         data: {
//             image_url: imageURL
//         }
//     })
//     .done((res) => {
//         // console.log('Image successfully added to database.')
//         callback(null);
//     })
//     .fail((err) => {
//         // console.log('Image successfully added to database.')
//         callback(err);
//     });
// },
//
// showApplyingStatus() {

// },
//
