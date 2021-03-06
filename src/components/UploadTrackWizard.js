import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import Loader from 'react-loader';

import _ from 'underscore';
import R from 'ramda';
import moment from 'moment';
import TrackWizardStep1 from './TrackWizardStep1';
import TrackWizardStep2 from './TrackWizardStep2';
import TrackWizardStep3 from './TrackWizardStep3';
import TrackWizardConfirmation from './TrackWizardConfirmation';
var constants = require('../constants/constants');
import UtilityFunctions from '../mixins/UtilityFunctions';
import Joiner from '../services/Joiner';
import Downloader from '../services/Downloader';
import async from 'async';
import Icon from './Icon';
import {History} from 'react-router';
import LoadingNotification from './LoadingNotification';

var UploadTrackWizard = React.createClass({

    mixins: [LinkedStateMixin, UtilityFunctions, History],

    getInitialState: function() {
        return {
            // wizard vars
            current_step: 1,
            filesize: 0,
            busy: false,
            applying: false,
            success: false,
            failure: false,
            joining: false,
            singlesSets: [],

            // step 1
            selectedSetIndex: -1,

            // step 2
            songs: [],
            set_length: 0,
            pending_file: null,
            temp_url: null,

            // step 3
            trackName: '',
            trackArtist: '',
            event: '',
            tags: [],
            uploadedImage: null,
            tagList: []
        };
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'New Track',
                loaded: false
            }
        });
        this.getSinglesSets();
    },

    componentDidMount: function() {
        var counter = ReactDOM.findDOMNode(this.refs.counter);
        counter.onloadedmetadata = (function(e) {
            var duration = counter.duration;
            var newSetLength = _.reduce(this.state.songs, function(counter, song) {
                return counter + song.duration
            }, duration);

            var processedSong = {};
            processedSong.file = this.state.pending_file;
            processedSong.duration = duration;
            processedSong.name = moment().unix() + this.state.pending_file.name;
            URL.revokeObjectURL(this.state.temp_url);
            this.setState({
                pending_file: null,
                temp_url: null,
                songs: update(this.state.songs, {$push: [processedSong]}),
                setLength: newSetLength
            });
        }).bind(this);
    },

    render: function() {
        var stepComponent;

        switch(this.state.current_step) {
            case 1:
            stepComponent =
            (<TrackWizardStep1 stepForward={this.stepForward}
            singlesSets={this.state.singlesSets}
            originalArtist={this.props.originalArtist} />);
            break;

            case 2:
            stepComponent =
            (<TrackWizardStep2 songs={this.state.songs}
            stepForward={this.stepForward}
            addSongFile={this.addSong}
            removeSong={this.removeSong} />);
            break;

            case 3:
            if (this.state.selectedSetIndex > -1) {
                var selectedSet = this.state.singlesSets[this.state.selectedSetIndex];

                var setLength = this.timeStringToSeconds(selectedSet.set_length) + this.state.setLength;

                var setData = {
                    set_id: selectedSet.id,
                    image: {
                        preview: constants.S3_ROOT_FOR_IMAGES + selectedSet.icon_image.imageURL
                    },
                    event: selectedSet.event.event,
                    setLength: setLength,
                    popularity: selectedSet.popularity
                };
            } else {
                var setData = {
                    set_id: -1,
                    image: this.state.uploadedImage,
                    event: this.state.event,
                    setLength: this.state.setLength,
                    tags: this.state.tags,
                    popularity: 0,
                    tagList: this.state.tagList
                };
            }

            stepComponent = (<TrackWizardStep3 stepForward={this.stepForward}
            deepLinkState={this.deepLinkState} {...setData} trackName={this.state.trackName} trackArtist={this.state.trackArtist}
            addImage={this.addImage}
            addTag={this.addTag}
            removeTag={this.removeTag}
            loadDatalists={this.loadDatalists}
            originalArtist={this.props.originalArtist} />);
            break;

            case 4:
            if (this.state.selectedSetIndex > -1) {
                var selectedSet = this.state.singlesSets[this.state.selectedSetIndex];

                var setLength = this.timeStringToSeconds(selectedSet.set_length) + this.state.setLength;

                var setData = {
                    set_id: selectedSet.id,
                    image: {
                        preview: constants.S3_ROOT_FOR_IMAGES + selectedSet.icon_image.imageURL
                    },
                    event: selectedSet.event.event,
                    setLength: setLength,
                    popularity: selectedSet.popularity
                };
            } else {
                var setData = {
                    set_id: -1,
                    image: this.state.uploadedImage,
                    event: this.state.event,
                    tags: this.state.tags,
                    popularity: 0,
                    setLength: this.state.setLength
                };
            }

            stepComponent = (<TrackWizardConfirmation uploadTrack={this.uploadTrack} {...setData} trackName={this.state.trackName} trackArtist={this.state.trackArtist}
            originalArtist={this.props.originalArtist} />);
            break;

            default:
            break;
        };

        return (
        <div className='flex-column' id='UploadSetWizard'>
            {this.showApplyingStatus()}
            <audio ref='counter' preload='metadata' src={this.state.temp_url}/>

            <div className='form-panel'>
                <div className='step-counter flex-row'>
                    <Icon className={`${this.state.current_step > 1 ? '': 'hidden-fade'}`} onClick={this.stepBackward}>chevron_left</Icon>
                    <h1 className='center'>{this.state.current_step < 4 ? 'Step ' + this.state.current_step + ' of 3' : 'Confirmation'}</h1>
                    <Icon className='hidden-fade'>chevron_right</Icon>
                </div>

                <div className='flex wizard-body'>
                    <Loader loaded={this.props.loaded}>
                        {stepComponent}
                    </Loader>
                </div>
            </div>

            <LoadingNotification title='Uploading...' open={this.state.applying} />
        </div>
        );
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

    getSinglesSets: function() {
        var requestUrl = 'https://api.setmine.com/v/11/graph';
        var query = `{
            artist (id: ${this.props.originalArtist.id}) {
                sets (event_type: \"singles\") {
                    id,
                    event {
                        id,
                        event
                    },
                    icon_image {
                        imageURL
                    },
                    songURL,
                    tracklist: tracks {
                        songname,
                        artistname,
                        starttime
                    },
                    episode {
                        episode
                    },
                    set_length,
                    popularity
                }
            }
        }`;

        $.ajax({
            url: requestUrl,
            type: 'get',
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                query: query
            }
        })
        .done( (res) => {
            // console.log(res);
            this.setState({
                singlesSets: res.data.artist.sets
            });

            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: true
                }
            });
        })
        .fail( (err) => {
            // console.log(err);
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: true
                }
            });
        });
    },

    addSong: function(file) {
        // console.log(file);
        if (file[0].type == 'audio/mp3' || file[0].type == 'audio/mp4' || file[0].type == 'audio/x-m4a' || file[0].type == 'audio/mpeg' || file[0].type == 'audio/wav') {

            var tempAudio = URL.createObjectURL(file[0]);
            this.setState({
                pending_file: file[0],
                temp_url: tempAudio
            });
        } else {
            alert('Only mp3 and wav files are supported.');
        }
    },

    removeSong: function(index) {
        this.setState({
            songs: update(this.state.songs, {$splice: [[index, 1]]})
        });
    },

    addTag: function() {
        this.setState({
            tags: update(this.state.tags, {$push: ['']})
        });
    },

    removeTag: function(index) {
        this.setState({
            tags: update(this.state.tags, {$splice: [[index, 1]]})
        });
    },

    addImage: function(file) {
        if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
            this.setState({
                uploadedImage: file[0]
            });
        } else {
            alert("Please upload a png, jpeg, or gif image.");
        }
    },

    registerAudio: function() {
        return new Promise((resolve, reject) => {
            console.log('Registering audio...');
            this.registerS3(this.state.songs[0].file)
                .then((audioUrl) => {
                    resolve(audioUrl);
                })
                .catch((err) => {
                    mixpanel.track("Error", {
                        "Page": "Upload Wizard",
                        "Message": "Error registering audio in Track Wizard"
                    });
                    reject(err);
                });

            // if (this.state.selectedSetIndex == -1) {
            //     console.log('Set is new and audio needs to be registered.');
            //
            //     this.registerS3(this.state.songs[0].file, encodeURIComponent(moment().unix() + this.state.songs[0].file.name), (err, audioUrl) => {
            //         if (err) {
            //             // console.log('An error occurred with registering audio.');
            //             // console.log(err);
            //             callback(err);
            //             mixpanel.track("Error", {
            //                 "Page": "Upload Wizard",
            //                 "Message": "Error registering audio in Track Wizard"
            //             });
            //         } else {
            //             // console.log('Audio registered on S3.');
            //             // console.log(audioUrl);
            //             callback(null, audioUrl);
            //         }
            //     });
            // } else {
            //     // console.log('Track needs to be joined to the existing audio for this set.');
            //
            //     async.waterfall([this.joinFiles, this.updateS3], (err, audioUrl) => {
            //         if (err) {
            //             // console.log('An error occurred with registering audio.');
            //             // console.log(err);
            //             callback(err);
            //             mixpanel.track("Error", {
            //                 "Page": "Upload Wizard",
            //                 "Message": "Error registering audio"
            //             });
            //         } else {
            //             // console.log('Audio registered on S3.');
            //             // console.log(audioUrl);
            //             callback(null, audioUrl);
            //         }
            //     });
            // }
        });
    },

    joinFiles: function(params) {
        return new Promise((resolve, reject) => {
            console.log('join files...');
            var newUrl = params.new_url;
            var oldUrl = params.old_url;

            var requestUrl = 'https://api.setmine.com/v/11/graph';

            var queryString = `mutation {
                joinAudio(
                    new_url: \"${newUrl}\",
                    old_url: \"${oldUrl}\"
                )
            }`;

            var graphData = {
                query: queryString,
                operationName: 'mutation'
            };

            fetch(requestUrl, {
                method: 'post',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                timeout: 0,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphData),
                credentials: 'include'
            })
            .then((response) => {
                return Promise.resolve(response.json());
            })
            .then((response) => {
                if (response && response.status == 'failure') {
                    return Promise.reject(response.error);
                } else {
                    return Promise.resolve(response);
                }
            })
            .then((res) => {
                console.log('==res==');
                console.log(res);
                resolve()
            })
            .catch((err) => {
                mixpanel.track("Error", {
                    "Page": "Upload Wizard",
                    "Message": "Error joining files"
                });
                reject(err);
            });
        });
    },

    registerS3: function(file) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'POST',
                url: 'https://api.setmine.com/v/10/aws/configureAWS',
                data: {
                    filename: encodeURIComponent(moment().unix() + file.name)
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            }).done((res) => {
                AWS.config.update(res.payload.settings);
                var encodedFilename = res.payload.encoded;
                var filesize = file.size;
                var s3 = new AWS.S3();
                console.log('==file.type==');
                console.log('audio/mp3');

                s3.timeout = 50000;
                var params = {
                    Bucket: 'stredm',
                    Key: 'namecheap/' + encodedFilename,
                    ContentType: file.type,
                    Body: file
                };
                var options = {partSize: 10 * 1024 * 1024, queueSize: 2};
                var upload = s3.upload(params, options);
                upload.on("httpUploadProgress", function(event) {
                    var percentage = (event.loaded / filesize) * 100;
                    var percent = parseInt(percentage).toString() + "%";
                    console.log('Uploading ' + file.type + ' file: ' + percent);
                });

                upload.send(function(err, data) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.payload.encoded);
                    }
                });
            }).fail((err) => {
                reject(err);
            });
        });
    },

    loadDatalists: function (listObjects) {
        this.setState(listObjects);
    },

    updateS3: function(file, callback) {
        // console.log('Update S3 File:');
        // console.log(file);
        $.ajax({
            type: 'POST',
            url: 'https://api.setmine.com/v/10/aws/configureAWS',
            data: {
                filename: file.name
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            AWS.config.update(res.payload.settings);
            var encodedFilename = file.name;
            var filesize = file.size;
            var s3 = new AWS.S3();

            s3.timeout = 50000;
            var params = {
                Bucket: 'stredm',
                Key: 'namecheap/' + encodedFilename,
                ContentType: file.type,
                Body: file
            };
            var options = {partSize: 10 * 1024 * 1024, queueSize: 2};
            var upload = s3.upload(params, options);
            upload.on("httpUploadProgress", function(event) {
                var percentage = (event.loaded / filesize) * 100;
                var percent = parseInt(percentage).toString() + "%";
                // console.log('Uploading ' + file.type + ' file: ' + percent);
            });

            upload.send(function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, file.name);
                }
            });
        })
        .fail((err) => {
            callback(err);
        });
    },

    registerImage: function() {
        return new Promise((resolve, reject) => {
            if (this.state.selectedSetIndex == -1) {
                console.log('Image is new and needs to be registered on S3.');
                var uniqueFilename = encodeURIComponent(moment().unix() + this.state.uploadedImage.name);
                this.registerS3(this.state.uploadedImage)
                    .then((imageUrl) => {
                        console.log('Image successfully registered on S3');
                        resolve(imageUrl);
                    })
                    .catch((err) => {
                        mixpanel.track("Error", {
                            "Page": "Upload Wizard",
                            "Message": "Error registering image to S3"
                        });
                        reject(err);
                    });
            } else {
                console.log('No new image needed, using image URL from existing set.');
                var imageUrl = this.state.singlesSets[this.state.selectedSetIndex].icon_image.imageURL;
                resolve(imageUrl);
            }
        });
    },

    packageSetData: function(audioURL) {
        // console.log('Packaging set data...');
        var genreId = _.findWhere(this.props.genres, {genre: this.state.genre}).id;
        var setLength = this.secondsToMinutes(this.state.set_length);
        var paid = 0;
        if (this.state.release_type == 'Beacon') {
            paid = 1;
        }
        var setData = {
            genre: genreId,
            audio_url: audioURL,
            tracklist_url: this.state.tracklist_url,
            filesize: this.state.filesize,
            set_length: setLength,
            paid: paid
        };
        // console.log('Set data packaged.');
        return setData;
    },

    packageEventData: function(imageURL) {
        // console.log('Packaging event data...');
        var exists = false;
        var type;
        var radioMix = false;
        var matchedEvent = null;
        switch (this.state.set_type) {
            case 'Live':
            if (this.state.match_url) {
                exists = true;
                matchedEvent = this.props.eventLookup[this.state.name];
            }
            type = 'festival';
            break;

            case 'Mix':
            type = 'mix';
            radioMix = true;
            break;

            case 'Album':
            type = 'album';
            break;

            default:
            break;
        }
        var eventData = {
            does_exist: exists,
            event: this.state.name,
            is_radiomix: radioMix,
            type: type,
            image_url: imageURL,
            matched_event: matchedEvent
        };
        // console.log('Event data packaged.');
        return eventData;
    },

    appendTrack: function(newTrackUrl) {
        return new Promise((resolve, reject) => {
            this.joinFiles({
                new_url: newTrackUrl,
                old_url: this.state.singlesSets[this.state.selectedSetIndex].songURL
            }).then(() => {
                console.log('Set on the database needs to be updated.');
                return Promise.all([
                    this.updateSetLength(),
                    this.updateTracklist()
                ]);
            }).then(() => {
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    },

    uploadTrack: function() {
        console.log('Beginning upload process.');
        var pendingSet = this.state;
        var registeredUrls = [];

        mixpanel.track("Upload initiated");
        this.setState({
            busy: true,
            applying: true
        });

        this.registerAudio()
            .then((audioUrl) => {
                registeredUrls.push(audioUrl);
                return this.registerImage();
            })
            .then((imageUrl) => {
                registeredUrls.push(imageUrl);
                return registeredUrls;
            })
            .then((registeredUrls) => {
                console.log('Registrations successful.');
                if (this.state.selectedSetIndex == -1) {
                    console.log('This is a brand new set, no join needed.');
                    var setBundle = {
                        id: -1,
                        event_name: this.state.event,
                        event_type: 'singles',
                        episode: '',
                        audio_url: registeredUrls[0],
                        filesize: this.state.filesize,
                        set_length: this.secondsToMinutes(this.state.setLength),
                        tracklist_url: '',
                        image_url: registeredUrls[1],
                        tags: this.state.tags,
                        paid: 0,
                        tracklist: [
                            {
                                starttime: '00:00',
                                artistname: this.state.trackArtist,
                                songname: this.state.trackName
                            }
                        ]
                    };

                    console.log('Bundle done.');
                    console.log(setBundle);
                    return this.registerSet(setBundle);
                } else {
                    console.log('New track needs to be appended to old singles set.');
                    var newUrl = registeredUrls[0];
                    return this.appendTrack(newUrl);
                }
            })
            .then(() => {
                mixpanel.track('Track uploaded successfully');
                this.history.pushState(null, '/content');
            })
            .catch((err) => {
                console.log('Error:');
                console.log(err);

                this.setState({
                    failure: true,
                    applying: false
                });

                mixpanel.track("Error", {
                    "Page": "Upload Wizard",
                    "Message": "Error uploading track"
                });

                this.history.pushState(null, '/content');
            });
    },

    updateSetLength: function () {
        return new Promise((resolve, reject) => {
            console.log('Updating set length on database...');
            var originalSet = this.state.singlesSets[this.state.selectedSetIndex]
            var newSetLength = this.secondsToMinutes(this.timeStringToSeconds(originalSet.set_length) + this.state.setLength);
            var requestUrl = 'https://api.setmine.com/v/10/sets/setLength';

            $.ajax({
                type: 'POST',
                url: requestUrl,
                data: {
                    set_id: this.state.singlesSets[this.state.selectedSetIndex].id,
                    set_length: newSetLength
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done((res) => {
                // console.log('Set length updated on database.');
                resolve();
            })
            .fail((err) => {
                // console.log('An error occurred when updating set length on database.');
                reject(err);
            });
        });
    },

    updateTracklist: function () {
        return new Promise((resolve, reject) => {
            console.log('Updating tracklist on database...');
            console.log('Prepping tracklist...');
            var originalSet = this.state.singlesSets[this.state.selectedSetIndex];
            var originalSeconds = this.timeStringToSeconds(originalSet.set_length);
            originalSeconds += 1;
            var newStartTime = this.secondsToMinutes(originalSeconds);
            var newTracklist = update(originalSet.tracklist, {$push: [
                {
                    starttime: newStartTime,
                    songname: this.state.trackName,
                    artistname: this.state.trackArtist
                }
            ]});

            var requestUrl = 'https://api.setmine.com/v/10/sets/tracklist';

            $.ajax({
                type: 'POST',
                url: requestUrl,
                data: {
                    tracklist: newTracklist,
                    set_id: originalSet.id
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done( (res) => {
                console.log('Tracklist updated on database.');
                resolve();
            })
            .fail( (err) => {
                console.log('An error occurred when updating tracklist on database.');
                reject(err);
            });
        });
    },

    registerSet: function(bundle) {
        return new Promise((resolve, reject) => {
            var requestUrl = 'https://api.setmine.com/v/10/sets/register';
            $.ajax({
                type: 'POST',
                url: requestUrl,
                data: bundle,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done((res) => {
                console.log('Set registered on database.');
                resolve();
            })
            .fail((err) => {
                console.log('An error occurred when updating the database.');
                reject(err);
            });
        });
    },

    showApplyingStatus: function() {
        if (this.state.busy) {
            var statusMessage;
            if (this.state.joining) {
                statusMessage = 'Joining audio files. This may take a few minutes. Please do not close this window or refresh the page.';
            } else if (this.state.success) {
                statusMessage = 'Your changes have been applied.';
            } else if (this.state.failure) {
                statusMessage = 'There was an error applying your changes. Please try again.';
            } else {
                statusMessage = 'Applying changes...';
            }

            return (
                <div className='applying-changes-overlay set-flex'>
                    {statusMessage}
                </div>
            )
        } else {
            return '';
        }
    },

    stepForward: function(setData) {
        if (setData) {
            var newData = update(setData, {$merge: {current_step: this.state.current_step + 1}});
        } else {
            var newData = {
                current_step: this.state.current_step + 1
            };
        }
        this.setState(newData);
    },

    stepBackward: function() {
        if (this.state.current_step > 1) {
            var newData = {
                current_step: this.state.current_step - 1
            };
            this.setState(newData);
        } else {
            // console.log('Nice try, hacker.');
        }
    }
});

module.exports = UploadTrackWizard;
