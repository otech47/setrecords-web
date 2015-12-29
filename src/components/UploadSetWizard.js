import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import _ from 'underscore';
import R from 'ramda';
import moment from 'moment';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';
import WizardStep5 from './WizardStep5';
import WizardStep6Beacon from './WizardStep6Beacon';
import WizardStep6Free from './WizardStep6Free';
import WizardStepConfirmation from './WizardStepConfirmation';
var constants = require('../constants/constants');
import UtilityFunctions from '../mixins/UtilityFunctions';
import Joiner from '../services/Joiner';
import async from 'async';
import Icon from './Icon';

var UploadSetWizard = React.createClass({

    mixins: [LinkedStateMixin, UtilityFunctions],

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

            // step 1
            type: null,

            // step 2
            songs: [],
            set_length: 0,
            pending_file: null,
            temp_url: null,

            // step 3
            tracklist: [],
            tracklist_url: null,

            // step 4
            event: '',
            artists: [this.props.originalArtist],
            episode: '',
            genre: '',
            image: null,

            // step 5
            paid: 0,

            // step 6
            outlets: [],
            price: '0.00',
        };
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'New Set'
            }
        });
        this.getVenues();
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
            URL.revokeObjectURL(this.state.temp_url);
            this.setState({
                pending_file: null,
                temp_url: null,
                songs: update(this.state.songs, {$push: [processedSong]}),
                set_length: newSetLength
            });
        }).bind(this);
    },

    render: function() {
        var stepComponent;

        switch(this.state.current_step) {
            case 1:
            stepComponent =
            (<WizardStep1 stepForward={this.stepForward} />);
            break;

            case 2:
            stepComponent =
            (<WizardStep2 songs={this.state.songs}
            stepForward={this.stepForward}
            addSongFile={this.addSong}
            removeSong={this.removeSong} />);
            break;

            case 3:
            stepComponent = (<WizardStep3 stepForward={this.stepForward}
            deepLinkState={this.deepLinkState}
            setLength={this.state.set_length}
            addTrack={this.addTrack}
            deleteTrack={this.deleteTrack}
            tracklist={this.state.tracklist} />);
            break;

            case 4:
            var setData = {
                event: this.state.event,
                genre: this.state.genre,
                artists: this.state.artists,
                image: this.state.image,
                episode: this.state.episode,
                setLength: this.state.set_length,
                type: this.state.type
            };

            stepComponent = (<WizardStep4 stepForward={this.stepForward}
            deepLinkState={this.deepLinkState}
            addImage={this.addImage}
            addFeaturedArtist={this.addFeaturedArtist}
            removeFeaturedArtist={this.removeFeaturedArtist}
            changeFeaturedArtist={this.changeFeaturedArtist}
            {...setData} />);
            break;

            case 5:
            stepComponent = (<WizardStep5 stepForward={this.stepForward} />);
            break;

            case 6:
            if (this.state.paid == 1) {
            stepComponent = (
                <WizardStep6Beacon stepForward={this.stepForward}
                deepLinkState={this.deepLinkState}
                addOutlet={this.addOutlet}
                removeOutlet={this.removeOutlet}
                price={this.state.price}
                venues={this.state.venues}
                outlets={this.state.outlets} />
            );
            } else {
                stepComponent = (<WizardStep6Free stepForward={this.stepForward}
                outlets={this.state.outlets} toggleOutlet={this.toggleOutlet} />);
            }
            break;

            case 7:
            stepComponent = (<WizardStepConfirmation {...this.state} uploadSet={this.uploadSet} originalArtist={this.props.originalArtist} />);
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
                    <h1 className='center'>{this.state.current_step < 7 ? 'Step ' + this.state.current_step + ' of 6' : 'Confirmation'}</h1>
                    <Icon className='hidden-fade'>chevron_right</Icon>
                </div>

                <div className='flex wizard-body'>
                    {stepComponent}
                </div>
            </div>

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

    addSong: function(file) {
        console.log(file);
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

    addTrack: function() {
        var tracklist = this.state.tracklist;

        var newTrack = {
            'id': -1,
            'starttime': '00:00',
            'artistname': this.props.originalArtist.artist,
            'songname': 'untitled'
        };

        this.setState({
            tracklist: update(tracklist, {$push: [newTrack]}),
            changes: true
        });
    },

    deleteTrack: function(index) {
        this.setState({
            tracklist: update(this.state.tracklist, {$splice: [[index, 1]]})
        });
    },

    addFeaturedArtist: function() {
        var newArtist = {
            id: -1,
            artist: ''
        };

        this.setState({
            artists: update(this.state.artists, {$push: [newArtist]})
        });
    },

    removeFeaturedArtist: function(index) {
        this.setState({
            artists: update(this.state.artists, {$splice: [[index, 1]]})
        });
    },

    addImage: function(file) {
        if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
            this.setState({
                image: file[0]
            });
        } else {
            alert("Please upload a png, jpeg, or gif image.");
        }
    },

    toggleOutlet: function(outletName) {
        var index = this.state.outlets.indexOf(outletName);
        if (index >= 0) {
            this.setState({
                outlets: update(this.state.outlets, {$splice: [[index, 1]]})
            });
        } else {
            this.setState({
                outlets: update(this.state.outlets, {$push: [outletName]})
            });
        }
    },

    addOutlet: function (venueName) {
        console.log('Add venue ' + venueName);
        this.setState({
            outlets: update(this.state.outlets, {$push: [_.findWhere(this.state.venues, {venue: venueName})]})
        });
    },

    removeOutlet: function (index) {
        console.log('Remove index ' + index);
        this.setState({
            outlets: update(this.state.outlets, {$splice: [[index, 1]]})
        });
    },

    getVenues: function() {
        var query = `{
            venues (beacon: 1) {
                id,
                venue,
                web_link,
                address,
                latitude,
                longitude
            }
        }`;
        $.ajax({
            url: 'https://api.setmine.com/v/10/setrecordsuser/graph',
            type: 'get',
            data: {
                query: query
            }
        })
        .done((res) => {
            this.setState({
                venues: res.payload.venues
            });
        })
        .fail((error) => {
            console.error(error)
        });
    },

    registerAudio: function(callback) {
        console.log('Registering audio...');
        async.waterfall([this.joinFiles, this.registerS3], function(err, audioUrl) {
            if (err) {
                console.log('An error occurred with registering audio.');
                console.log(err);
                callback(err);
                mixpanel.track("Error", {
                    "Page": "Upload Wizard",
                    "Message": "Error registering audio"
                });
            } else {
                console.log('Audio registered on S3.');
                console.log(audioUrl);
                callback(null, audioUrl);
            }
        });
    },

    joinFiles: function(callback) {
        if (this.state.songs.length > 1) {
            console.log('More than one audio file detected. Running joiner...');
            this.setState({
                joining: true
            }, () => {
                var toJoin = _.map(this.state.songs, function(song, index) {
                    return song.file;
                });

                Joiner.combineAudioFiles(toJoin, (err, joinedBlob) => {
                    if (err) {
                        console.log('Join unsuccessful');
                        this.setState({
                            joining: false
                        }, function() {
                            callback(err);
                        });
                        mixpanel.track("Error", {
                            "Page": "Upload Wizard",
                            "Message": "Error joining files"
                        });
                    } else {
                        console.log('Join successful.');
                        var newFilename = this.props.originalArtist + '_joined_' + this.state.songs[0].file.name + moment().unix();
                        var joinedFile = new File([joinedBlob], newFilename);
                        this.setState({
                            filesize: joinedFile.size,
                            joining: false
                        }, function() {
                            callback(null, joinedFile);
                        });
                    }
                });
            })
        } else {
            console.log('Only one file detected. No join needed.');
            this.setState({
                filesize: this.state.songs[0].file.size
            }, () => {
                callback(null, this.state.songs[0].file);
            });
        }
    },

    registerS3: function(file, callback) {
        var uniqueFilename = moment().unix() + file.name;
        $.ajax({
            type: 'POST',
            url: 'https://api.setmine.com/v/10/aws/configureAWS',
            data: {
                filename: encodeURIComponent(uniqueFilename)
            }
        })
        .done((res) => {
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
            var options = {partSize: 10 * 1024 * 1024, queueSize: 2};
            var upload = s3.upload(params, options);
            upload.on("httpUploadProgress", function(event) {
                var percentage = (event.loaded / filesize) * 100;
                var percent = parseInt(percentage).toString() + "%";
                console.log('Uploading ' + file.type + ' file: ' + percent);
            });

            upload.send(function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, res.payload.encoded);
                }
            });
        })
        .fail((err) => {
            callback(err);
        });
    },

    registerImage: function(callback) {
        if (this.state.image != null) {
            console.log('Image is new and needs to be registered on S3.');
            this.registerS3(this.state.image, function(err, imageUrl) {
                if (err) {
                    console.log('An error occurred with registering image.');
                    callback(err);
                    mixpanel.track("Error", {
                        "Page": "Upload Wizard",
                        "Message": "Error registering image to S3"
                    });
                } else {
                    console.log('Image successfully registered on S3.');
                    callback(null, imageUrl);
                }
            });
        } else {
            console.log('No image has been uploaded. Will use the default URL.');
            var defaultUrl = constants.DEFAULT_IMAGE;
            callback(null, defaultUrl);
        }
    },

    packageSetData: function(audioURL) {
        console.log('Packaging set data...');
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
        console.log('Set data packaged.');
        return setData;
    },

    packageEventData: function(imageURL) {
        console.log('Packaging event data...');
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
        console.log('Event data packaged.');
        return eventData;
    },

    uploadSet: function() {
        console.log('Beginning upload process.');
        this.setState({
            busy: true,
            applying: true
        }, () => {
            var pendingSet = this.state;
            var registerFunctions = [
                this.registerAudio,
                this.registerImage
            ];

            console.log('Performing register functions...');
            async.parallel(registerFunctions, (err, registeredUrls) => {
                if (err) {
                    console.log('Error in registration functions:');
                    console.log(err);

                    this.setState({
                        failure: true,
                        applying: false
                    }, () => {
                        console.log('This is where the upload wizard would close and we would redirect to the content view.');
                        // setTimeout(function() {
                        //     this.props.close(true);
                        // }, 3000);
                    });

                    mixpanel.track("Error", {
                        "Page": "Upload Wizard",
                        "Message": "Error uploading set"
                    });
                } else {
                    console.log('Registrations successful.');

                    console.log('Creating bundle...');
                    var additionalArtists = _.pluck(_.rest(this.state.artists), 'artist');

                    var setBundle = {
                        event_name: this.state.event,
                        event_type: this.state.type.toLowerCase(),
                        episode: this.state.episode,
                        audio_url: registeredUrls[0],
                        filesize: this.state.filesize,
                        set_length: this.secondsToMinutes(this.state.set_length),
                        tracklist_url: this.state.tracklist_url,
                        paid: this.state.paid,
                        additional_artists: additionalArtists,
                        image_url: registeredUrls[1]
                    };
                    console.log('Bundle done:');
                    console.log(setBundle);

                    console.log('Prepping tracklist...');
                    var tracklist = update(this.state.tracklist, {$push: []});
                    if (tracklist.length == 0) {
                        tracklist.push({
                            'id': -1,
                            'starttime': '00:00',
                            'artistname': this.props.originalArtist,
                            'songname': 'untitled'
                        });
                    }
                    console.log('Tracklist done:');
                    console.log(tracklist);

                    console.log('Sending bundle and tracklist to database...');
                    this.updateDatabase(setBundle, tracklist);
                }
            });
        });
    },

    updateDatabase: function(bundle, tracklist) {
        async.waterfall([
            function (callback) {
                var requestUrl = 'https://api.setmine.com/v/10/sets/register';
                $.ajax({
                    type: 'POST',
                    url: requestUrl,
                    data: bundle
                })
                .done((res) => {
                    console.log('Set registered on database.');
                    console.log(res);
                    callback(null, res.payload.register.id);
                })
                .fail((err) => {
                    console.log('An error occurred when updating the database.');
                    console.log(err);
                    callback(err);
                });
            },

            function (newSetId, callback) {
                console.log('Adding tracklist for set ID = ' + newSetId);
                var requestUrl = 'https://api.setmine.com/v/10/sets/tracklist';
                $.ajax({
                    type: 'POST',
                    url: requestUrl,
                    data: {
                        tracklist: tracklist,
                        set_id: newSetId
                    }
                })
                .done((res) => {
                    console.log('Tracklist added to the new set.');
                    console.log(res);
                    console.log('This is where we would close the upload wizard.');
                })
                .fail((err) => {
                    console.log('An error occurred when adding the tracklist to the new set.');
                    console.log(err);
                    console.log('This is where we would close the upload wizard.');
                })
            }
        ], function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
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

    pullTracks: function(url, callback) {
        var tracklistUrl = url;
        if (tracklistUrl == null || tracklistUrl.length == 0) {
            callback(null);
        } else {
            var requestUrl = "https://api.setmine.com/api/v/7/setrecords/set/tracklist/";
            $.ajax({
                type: "GET",
                url: requestUrl,
                data: {
                    tracklist_url: tracklistUrl
                },
                success: function(res) {
                    if (res.status == "failure") {
                        callback(null);
                    } else {
                        callback(res.payload.set_tracklist);
                    }
                },
                error: function(err) {
                    callback(null);
                }
            });
        }
    },

    loadTracksFromURL: function() {
        var self = this;
        this.pullTracks(this.state.tracklistURL, function(tracks) {
            if (tracks == null) {
                alert("Please enter a valid 1001 tracklists URL.");
            } else {
                var newTracklist = update(self.state.tracklist, {$set: tracks});
                self.setState({
                    tracklist: update(self.state.tracklist,  {$set: tracks})
                });
            }
        });
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
            console.log('Nice try, hacker.');
        }
    }
});

module.exports = UploadSetWizard;
