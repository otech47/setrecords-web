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
import {History} from 'react-router';
import LoadingNotification from './LoadingNotification';

var SC = require('soundcloud');

var UploadSetWizard = React.createClass({

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
            existingImage: '',
            event: '',
            artists: [this.props.originalArtist],
            episode: '',
            tags: [],
            image: null,
            tagList: [],
            eventList: [],
            venueList: [],
            eventLookup: {},
            artistList: [],
            venue: '',

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

        // console.log('Initializing soundcloud...');
        SC.initialize({
            client_id: 'c00cb419a074ad09052ef2d44fdc65ff',
            redirect_uri: 'https://setrecords.setmine.com/soundcloudcallback'
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
            processedSong.name = moment().unix() + this.state.pending_file.name;
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
            tracklistUrl={this.state.tracklist_url}
            deleteTrack={this.deleteTrack}
            estimateStartTimes={this.estimateStartTimes}
            tracklist={this.state.tracklist}
            loadTracksFromUrl={this.loadTracksFromUrl} />);
            break;

            case 4:
            var setData = {
                event: this.state.event,
                tags: this.state.tags,
                artists: this.state.artists,
                image: this.state.image,
                episode: this.state.episode,
                setLength: this.state.set_length,
                type: this.state.type,
                tagList: this.state.tagList,
                venue: this.state.venue,
                eventList: this.state.eventList,
                eventLookup: this.state.eventLookup,
                artistList: this.state.artistList,
                venueList: this.state.venueList,
                venueLookup: this.state.venueLookup
            };

            stepComponent = (<WizardStep4 stepForward={this.stepForward}
            loadDatalists={this.loadDatalists}
            deepLinkState={this.deepLinkState}
            addImage={this.addImage}
            addFeaturedArtist={this.addFeaturedArtist}
            removeFeaturedArtist={this.removeFeaturedArtist}
            addTag={this.addTag}
            removeTag={this.removeTag}
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
            <LoadingNotification title='Uploading set...' open={this.state.applying} />
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

    estimateStartTimes: function(e) {
        e.preventDefault();
        var tracklist = this.state.tracklist;
        var setLength = this.state.set_length;

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

    addTrack: function() {
        var tracklist = this.state.tracklist;

        var newTrack = {
            'id': -1,
            'starttime': '00:00',
            'artistname': '',
            'songname': ''
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
        // console.log('Add venue ' + venueName);
        this.setState({
            outlets: update(this.state.outlets, {$push: [_.findWhere(this.state.venues, {venue: venueName})]})
        });
    },

    removeOutlet: function (index) {
        // console.log('Remove index ' + index);
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
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            this.setState({
                venues: res.payload.venues
            });
        })
        .fail((error) => {
            // console.error(error)
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
                        // console.log('Join unsuccessful');
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
                        // console.log('Join successful.');
                        var newFilename = this.props.originalArtist.artist + '_joined_' + this.state.songs[0].file.name + moment().unix();
                        var joinedFile = new File([joinedBlob], newFilename);
                        this.setState({
                            filesize: joinedFile.size,
                            finalFile: joinedFile,
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
                filesize: this.state.songs[0].file.size,
                finalFile: this.state.songs[0].file
            }, () => {
                callback(null, this.state.songs[0].file);
            });
        }
    },

    registerS3: function(file, callback) {
        console.log('registerS3');

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
            console.log('registerS3: done');

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
                    console.log('registerS3: done: uploadsend err');
                    console.log(err)
                    callback(err);
                } else {
                    console.log('registerS3: done: uploadsend');

                    callback(null, res.payload.encoded);
                }
            });
        })
        .fail((err) => {
            console.log(err)
            console.log('registerS3: fail:  err');

            callback(err);
        });
    },

    registerImage: function(callback) {
        console.log('registerImage');

        if (this.state.existingImage != null) {
            console.log('Image exists already on our database.');
            callback(null, this.state.existingImage);
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

    uploadSet: function() {
        console.log('Beginning upload process.');
        mixpanel.track("Upload initiated");
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
                console.log(err);
                console.log(registeredUrls);

                if (err) {
                    console.log('Error in registration functions:');
                    // console.log(err);

                    this.setState({
                        failure: true,
                        applying: false
                    }, () => {
                        this.history.pushState(null, '/content');
                    });

                    mixpanel.track("Error", {
                        "Page": "Upload Wizard",
                        "Message": "Error uploading set"
                    });
                } else {
                    // console.log('Registrations successful.');

                    console.log('Creating bundle...');
                    var additionalArtists = _.pluck(_.rest(this.state.artists), 'artist');

                    console.log(this.props.originalArtist.id)

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
                        image_url: registeredUrls[1],
                        tags: this.state.tags,
                        venue: this.state.venue,
                        artist_id: this.props.originalArtist.id
                    };
                    console.log('Bundle done:');
                    // console.log(setBundle);

                    console.log('Prepping tracklist...');
                    var tracklist = update(this.state.tracklist, {$push: []});
                    if (tracklist.length == 0) {
                        tracklist.push({
                            'id': -1,
                            'starttime': '00:00',
                            'artistname': 'unknown artist',
                            'songname': 'unknown track'
                        });
                    }
                    // console.log('Tracklist done:');
                    // console.log(tracklist);

                    setBundle.tracklist = tracklist;

                    var releaseFunctions = [
                        this.updateDatabase.bind(this, setBundle)
                    ];

                    this.updateDatabase(setBundle, (err, newSetId) => {
                        if (err) {
                            console.log('An error occurred.');
                            // console.log(err);
                            mixpanel.track("Error", {
                                "Page": "Upload Set",
                                "Message": err
                            });
                        } else {
                            console.log('Running release function...');

                            if (this.state.paid == 1) {
                                // console.log('Release to beacon.');
                                this.beaconRelease(newSetId, this.cleanUp);
                            } else {
                                console.log('Free release.');
                                this.freeRelease(this.state.finalFile, this.cleanUp);
                            }
                        }
                    });
                }
            });
        });
    },

    updateDatabase: function(bundle, callback) {
        console.log('Sending bundle to database:');
        // console.log(bundle);

        var requestUrl = 'https://localhost:3000/v/10/sets/register';

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
            // console.log(res);
            callback(null, res.payload.new_set);
        })
        .fail((err) => {
            console.log('An error occurred when updating the database.');
            console.log(err);
            callback(err);
        });
    },

    freeRelease: function (setFile, callback) {
        // console.log('Free release for file:');
        // console.log(setFile);

        if (this.state.outlets.indexOf('Soundcloud') > -1) {
            var uploadName = this.state.event;
            if (this.state.episode && this.state.episode.length > 0) {
                uploadName += ` - ${this.state.episode}`;
            }
            // console.log('Upload name is ' + uploadName);

            // console.log('Authenticating...');
            SC.connect()
            .then( () => {
                // console.log('Successfully authenticated.');

                // console.log('Uploading file to Soundcloud...');
                var upload = SC.upload({
                    file: setFile,
                    title: uploadName
                });

                upload.request.addEventListener('progress', (e) => {
                    // console.log('Soundcloud ', (e.loaded / e.total) * 100, '%');
                });

                upload.then( (track) => {
                    // console.log('Soundcloud complete. Link: ', track.permalink_url);
                    callback(null);
                })
                .catch( (err) => {
                    // console.log('Error uploading to Soundcloud.');
                    // console.log(err);
                    callback(err);
                });
            })
            .catch( (err) => {
                // console.log('Error authenticating.');
                // console.log(err);
                callback(err);
            });
        } else {
            // console.log('Done.');
            callback(null);
        }
    },

    beaconRelease: function (setId, callback) {
        // console.log('Beacon release for set ID ' + setId);

        var venueIds = _.pluck(this.state.outlets, 'id');
        // console.log('Venue IDs:');
        // console.log(venueIds);

        var price = this.state.price.replace(".", "");
        // console.log('==price==');
        // console.log(price);

        var requestUrl = 'https://api.setmine.com/v/10/offers/beaconRelease';

        $.ajax({
            type: 'post',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                set_id: setId,
                price: parseFloat(price),
                venues: venueIds,
                artist_id: this.props.originalArtist.id
            }
        })
        .done( (res) => {
            // console.log('Set released to beacons.');
            // console.log(res);

            callback(null);
        })
        .fail( (err) => {
            // console.log('Error releasing sets to beacons.');
            // console.log(err);

            callback(err);
        });
    },

    loadDatalists: function (listObjects) {
        this.setState(listObjects);
    },

    cleanUp: function (err) {
        // console.log('Set registration and uploads complete. Returning to content...');
        mixpanel.track('Set upload successful');
        this.history.pushState(null, '/content');
    },

    pullTracks: function(url, callback) {
        var tracklistUrl = url;
        if (tracklistUrl == null || tracklistUrl.length == 0) {
            callback(null);
        } else {
            var requestUrl = "https://api.setmine.com/v/10/sets/1001tracklist";
            $.ajax({
                type: "GET",
                url: requestUrl,
                data: {
                    tracklist_url: tracklistUrl
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
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

    loadTracksFromUrl: function (url) {
        // console.log('Requested to load ' + url);

        var requestUrl = 'https://api.setmine.com/v/10/sets/1001tracklist';

        $.ajax({
            type: 'post',
            url: requestUrl,
            data: {
                set_id: -1,
                tracklist_url: url
            },
            crossDoman: true,
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

module.exports = UploadSetWizard;
