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
            featured_artists: [],
            current_step: 1,
            set_type: null,
            songs: [],
            set_length: 0,
            tracklist: [],
            tracklist_url: null,
            name: '',
            episode: '',
            genre: '',
            image: null,
            release_type: null,
            outlets: [],
            price: '0.00',
            pending_file: null,
            temp_url: null,
            track_id: -1,
            filesize: 0,
            busy: false,
            applying: false,
            success: false,
            failure: false,
            joining: false
        };
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'New Set'
            }
        });
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
            removeSong={this.removeSongFile} />);
            break;

            case 3:
            stepComponent = (<WizardStep3
            stepForward={this.stepForward}
            deepLinkState={this.deepLinkState}
            setLength={this.state.set_length}
            addTrack={this.addTrack}
            deleteTrack={this.deleteTrack}
            tracklist={this.state.tracklist} />);
            break;

            case 4:
            stepComponent = (<WizardStep4 stepForward={this.stepForward}
            originalArtist={this.props.originalArtist}
            linkState={this.linkState}
            type={this.state.set_type}
            events={this.props.events}
            mixes={this.props.mixes}
            artists={this.props.artists}
            genres={this.props.genres}
            image={this.state.image}
            setLength={this.state.set_length}
            addImage={this.addImage}
            eventLookup={this.props.appState.get('event_lookup')}
            featuredArtists={this.state.featured_artists}
            addFeaturedArtist={this.addFeaturedArtist}
            removeFeaturedArtist={this.removeFeaturedArtist}
            changeFeaturedArtist={this.changeFeaturedArtist} />);
            break;

            case 5:
            stepComponent = (<WizardStep5 stepForward={this.stepForward} />);
            break;

            case 6:
            if (this.state.release_type == 'Beacon') {
            stepComponent = (
                <WizardStep6Beacon    stepForward={this.stepForward}
                linkState={this.linkState}
                venues={this.props.appState.get('venues')}
                toggleOutlet={this.toggleOutlet}
                push={this.props.push}
                outlets={this.state.outlets} />
            );
            } else {
                stepComponent = (<WizardStep6Free stepForward={this.stepForward}
                outlets={this.state.outlets} toggleOutlet={this.toggleOutlet} />);
            }
            break;

            case 7:
            stepComponent = (<WizardStepConfirmation {...this.state} uploadSet={this.uploadSet} originalArtist={this.props.appState.get('artist_data').artist} />);
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

    addTrack: function() {
        var tracklist = this.state.tracklist;

        var newTrack = {
            'id': -1,
            'starttime': '',
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
        var self = this;
        if (this.state.songs.length > 1) {
            console.log('More than one audio file detected. Running joiner...');
            this.setState({
                joining: true
            }, function() {
                var toJoin = _.map(self.state.songs, function(song, index) {
                    return song.file;
                });
                Joiner.combineAudioFiles(toJoin, function(err, joinedBlob) {
                    if (err) {
                        console.log('Join unsuccessful');
                        self.setState({
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
                        var newFilename = self.props.appState.get('artist_data').artist + '_joined_' + self.state.songs[0].file.name;
                        var joinedFile = new File([joinedBlob], newFilename);
                        self.setState({
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
            var self = this;
            this.setState({
                filesize: this.state.songs[0].file.size
            }, function() {
                callback(null, self.state.songs[0].file);
            });
        }
    },
    registerS3: function(file, callback) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/aws/configureAWS?filename=' + encodeURIComponent(file.name),
            contentType: 'application/json',
            success: function(response) {
                AWS.config.update(response.settings);
                var encodedFilename = response.encoded;
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
                        callback(null, response.encoded);
                    }
                });
            },
            error: function(err) {
                callback(err);
            }
        });
    },
    registerImage: function(callback) {
        if (this.state.match_url) {
            console.log('Selected event already exists, so we can use that URL.');
            callback(null, this.state.match_url);
        } else if (this.state.image != null) {
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

//TODO something in here with eventlookup breaks step 4
//MODELS from appState.get('event_lookup') are breaking shit here
// TODO get rid of models
// kill the artists
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
        var self = this;
        this.setState({
            busy: true,
            applying: true
        }, function() {
            var pendingSet = self.state;
            var registerFunctions = [
                self.registerAudio,
                self.registerImage
            ];
            console.log('Performing register functions...');
            async.parallel(registerFunctions, function(err, registeredUrls) {
                if (err) {
                    console.log('Error in registration functions:');
                    console.log(err);
                    self.setState({
                        failure: true,
                        applying: false
                    }, function() {
                        setTimeout(function() {
                            self.props.close(true);
                        }, 3000);
                    });
                    mixpanel.track("Error", {
                        "Page": "Upload Wizard",
                        "Message": "Error uploading set"
                    });
                } else {
                    console.log('Registrations successful.');

                    console.log('Creating bundle...');
                    var setData = self.packageSetData(registeredUrls[0]);
                    var eventData = self.packageEventData(registeredUrls[1]);
                    var artists = [self.props.appState.get('artist_data').artist];
                    if (self.state.set_type != 'Album') {
                        _.each(self.state.featured_artists, function(featuredArtist, index) {
                            var match = self.props.artistLookup[featuredArtist];
                            if (match) {
                                artists.push(match);
                            } else {
                                artists.push({
                                    id: -1,
                                    artist: featuredArtist
                                });
                            }
                        });
                    }
                    var tracklist = update(pendingSet.tracklist, {$push: []});
                    if (tracklist.length == 0) {
                        tracklist.push({
                            'track_id': -1,
                            'start_time': '00:00',
                            'artist': self.props.appState.get('artist_data').artist,
                            'song': 'untitled'
                        });
                    }
                    var setBundle = {
                        set_data: setData,
                        event_data: eventData,
                        episode: pendingSet.episode,
                        artists: artists,
                        tracklist: tracklist
                    };
                    console.log('Bundle done:');
                    console.log(setBundle);
                    console.log('Sending bundle to database...');
                    self.updateDatabase(setBundle);
                }
            });
        });
    },
    updateDatabase: function(bundle) {
        var self = this;
        var requestUrl = 'http://localhost:3000/api/v/7/setrecords/upload/set';
        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                bundle: bundle
            },
            success: function(res) {
                if (res.status == 'failure') {
                    console.log('An error occurred when updating the database:');
                    console.log(res);
                    self.setState({
                        failure: true,
                        applying: false
                    }, function() {
                        setTimeout(function() {
                            self.props.close(true);
                        }, 3000);
                    });
                } else {
                    console.log('Database update successful.');
                    console.log(res);
                    self.setState({
                        applying: false,
                        success: true
                    }, function() {
                        setTimeout(function() {
                            self.props.close(true);
                        }, 3000);
                    });
                }
            },
            error: function(err) {
                console.log('An error occurred when updating the database:');
                console.log(err);
                self.setState({
                    failure: true,
                    applying: false
                }, function() {
                    setTimeout(function() {
                        self.props.close(true);
                    }, 3000);
                });
            }
        });
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


//TODO add modal notifications
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
    addFeaturedArtist: function() {
        this.setState({
            featured_artists: update(this.state.featured_artists, {$push: ['']})
        });
    },
    removeFeaturedArtist: function(index) {
        this.setState({
            featured_artists: update(this.state.featured_artists, {$splice: [[index, 1]]})
        });
    },
    changeFeaturedArtist: function(index, event) {
        var updateObj = {};
        updateObj[index] = {
            $set: event.target.value
        };
        this.setState({
            featured_artists: update(this.state.featured_artists, updateObj)
        });
    },



    // addTrack: function() {
    //     var artist = this.props.appState.get('artist_data').artist;
    //     var tracklist = this.state.tracklist;
    //     if (tracklist.length == 0) {
    //         var nextStartTime = '00:00';
    //     } else {
    //         var lastStartTime = this.timeStringToSeconds(_.last(tracklist).start_time);
    //         var nextStartTime = this.secondsToMinutes(lastStartTime + 1);
    //     }
    //     var newTrack = {
    //         'track_id': this.state.track_id,
    //         'start_time': nextStartTime,
    //         'artist': artist,
    //         'song': 'untitled'
    //     };
    //     this.setState({
    //         tracklist: update(tracklist, {$push: [newTrack]}),
    //         track_id: this.state.track_id - 1
    //     });
    // },



    pullTracks: function(url, callback) {
        var tracklistUrl = url;
        if (tracklistUrl == null || tracklistUrl.length == 0) {
            callback(null);
        } else {
            var requestUrl = "http://localhost:3000/api/v/7/setrecords/set/tracklist/";
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
    removeSongFile: function(index) {
        this.setState({
            songs: update(this.state.songs, {$splice: [[index, 1]]})
        });
    },
    toggleOutlet: function(outlet) {
        var self = this;
        var index = this.state.outlets.indexOf(outlet);
        if (index >= 0) {
            this.setState({
                outlets: update(this.state.outlets, {$splice: [[index, 1]]})
            });
        } else {
            this.setState({
                outlets: update(this.state.outlets, {$push: [outlet]})
            });
        }
    },
    addImage: function(file) {
        if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
            this.setState({
                image: file[0]
            });
        } else {
            alert("Please upload a png, jpeg, or gif image.");
        }
    }
});

module.exports = UploadSetWizard;
