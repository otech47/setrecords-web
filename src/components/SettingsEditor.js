import React from 'react';
import update from 'react-addons-update';
import Dropzone from 'react-dropzone';
import _ from 'underscore';
import async from 'async';
import Loader from 'react-loader';
import constants from '../constants/constants';
import {History, Lifecycle} from 'react-router';
import {Motion, spring, presets} from 'react-motion';
import Icon from './Icon';
import Notification from './Notification';
import moment from 'moment';

var SettingsEditor = React.createClass({

    mixins: [History, Lifecycle],

    getInitialState() {
        return {
            uploadedImage: [],
            newPass: '',
            confirmPass: '',
            busy: false,
            applying: false,
            success: false,
            failure: false,
            open: false,
            notify: false
        };
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Account',
                loaded: false
            }
        });
    },

    componentDidMount() {
        mixpanel.track("Settings Page Open");
        this.getAccountData();
    },

    routerWillLeave: function (nextLocation) {
        if (this.hasChanges()) {
            return ('You have unsaved changes that will be lost. Are you sure you want to leave?');
        }
    },

    render: function() {
        var deepLinkState = this.deepLinkState;

        var imageUrl = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;

        if (this.state.uploadedImage.length > 0) {
            imageUrl = this.state.uploadedImage[0].preview;
        } else if (this.state.icon_image) {
            imageUrl = constants.S3_ROOT_FOR_IMAGES + this.state.icon_image.imageURL;
        }

        var passwordMatch = this.state.newPass == this.state.confirmPass;

        var passwordWarning = ((this.state.newPass.length > 0 || this.state.confirmPass.length > 0) && !passwordMatch) ? 'warning' : 'hidden';

        if ((this.state.newPass.length > 0 || this.state.confirmPass.length > 0)) {
            var passwordIcon = (passwordMatch ? 'fa fa-check approved' : 'fa fa-times warning');
        } else {
            var passwordIcon = 'hidden';
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
                <div className='flex-column flex' id='SettingsEditor'>

                    <Motion style={{
                        opacity: spring(this.state.notify ? 1 : 0, presets.gentle),
                        visibility: this.state.notify ? 'visible' : 'hidden'
                    }}>
                        {
                            ({opacity, visibility}) =>
                            <Notification dismiss={() => {
                                    this.props.push({
                                        type: 'SHALLOW_MERGE',
                                        data: {
                                            loaded: false
                                        }
                                    });
                                    this.setState(this.getInitialState());
                                    this.getAccountData();
                                }}
                                style={{
                                opacity: `${opacity}`,
                                visibility: `${visibility}`
                            }}>
                                {statusMessage}
                            </Notification>
                        }
                    </Motion>

                    <div className='artist-image flex-row'>
                        <img src={imageUrl} />

                        <Dropzone onDrop={this.onDrop} className='hidden' ref='dropzone' multiple={false} />
                        <button onClick={this.browse} className='dropzone flex-container center'>
                            <Icon>open_in_browser</Icon>
                            Upload a new artist image...
                        </button>
                    </div>


                    <div className='password-change form-panel flex-column center'>
                        <h1>Change Password</h1>
                        <div>
                            <p>New Password {((this.state.newPass.length > 0) ? <span className='warning'>*</span> : '')}</p>
                            <input name='new_pass' valueLink={deepLinkState(['newPass'])} type='password' />
                        </div>
                        <div>
                            <p>Confirm New Password <i className={passwordIcon}></i></p>
                            <p className={passwordWarning}>Passwords must match.</p>
                            <input type='password' name='confirm_pass' valueLink={deepLinkState(['confirmPass'])} />
                        </div>
                    </div>


                    <div className='artist-links form-panel flex-column center'>
                        <h1>Update Links</h1>
                        <div>
                            <p>Web {this.checkChangedField('web_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='web_link' type='text' valueLink={deepLinkState(['web_link'])} />
                        </div>
                        <div>
                            <p>Soundcloud {this.checkChangedField('soundcloud_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='soundcloud_link' type='text' valueLink={deepLinkState(['soundcloud_link'])} />
                        </div>
                        <div>
                            <p>Youtube {this.checkChangedField('youtube_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='youtube_link' type='text' valueLink={deepLinkState(['youtube_link'])} />
                        </div>
                        <div>
                            <p>Twitter {this.checkChangedField('twitter_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='twitter_link' type='text' valueLink={deepLinkState(['twitter_link'])} />
                        </div>
                        <div>
                            <p>Facebook {this.checkChangedField('fb_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='fb_link' type='text' valueLink={deepLinkState(['fb_link'])} />
                        </div>
                        <div>
                            <p>Instagram {this.checkChangedField('instagram_link') ? <span className='warning'>*</span>: ''}</p>
                            <input name='instagram_link' type='text' valueLink={deepLinkState(['instagram_link'])} />
                        </div>
                    </div>


                    <div className='form-panel flex-row center' id='apply-changes'>
                        <div className='flex-fixed apply flex-container' onClick={this.applyChanges}>
                            Apply
                        </div>
                        <div className='flex-fixed revert flex-container' onClick={this.revertChanges}>
                            Revert
                        </div>
                    </div>

                </div>
            </Loader>
        );
    },

    checkChangedField: function(fieldName) {
        return this.state[fieldName] != this.props.artistData[fieldName];
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    getAccountData: function() {
        var query = `{
            artist (id: ${this.props.artistId}) {
                artist,
                icon_image {
                    imageURL
                },
                web_link,
                twitter_link,
                fb_link,
                soundcloud_link,
                youtube_link,
                instagram_link
            }
        }`;

        $.ajax({
            type: 'get',
            url: 'https://api.setmine.com/v/10/setrecordsuser/graph',
            data: {
                query: query
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log(res);
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loaded: true,
                    artist_data: res.payload.artist
                }
            });
            this.setState(res.payload.artist);
        })
        .fail((err) => {
            console.log('An error occurred.');
            console.log(err);
        });
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

    hasChanges: function() {
        var referenceObject = _.extend(this.getInitialState(), this.props.artistData);

        var changes = _.some(referenceObject, (value, key) => {
            return !(_.isEqual(value, this.state[key]));
        });

        return changes;
    },

    applyChanges() {
        var pendingSettings = this.state;
        var passwordMatch = this.state.newPass == this.state.confirmPass;

        if ( (this.state.newPass.length > 0 || this.state.confirmPass.length > 0) && !passwordMatch ) {
            alert('New password and confirm password fields must match.');
        } else {
            var originalSettings = this.props.artistData;

            var changeFunctions = [];

            if (pendingSettings.uploadedImage.length > 0) {
                changeFunctions.push(this.newImage);
            }

            if ((this.state.newPass.length > 0)) {
                changeFunctions.push(this.newPassword);
            }

            switch(true) {
                case pendingSettings.fb_link != originalSettings.fb_link:
                    changeFunctions.push(this.newLinks);
                    break;

                case pendingSettings.twitter_link != originalSettings.twitter_link:
                    changeFunctions.push(this.newLinks);
                    break;

                case pendingSettings.web_link != originalSettings.web_link:
                    changeFunctions.push(this.newLinks);
                    break;

                case pendingSettings.instagram_link != originalSettings.instagram_link:
                    changeFunctions.push(this.newLinks);
                    break;

                case pendingSettings.soundcloud_link != originalSettings.soundcloud_link:
                    changeFunctions.push(this.newLinks);
                    break;

                case pendingSettings.youtube_link != originalSettings.youtube_link:
                    changeFunctions.push(this.newLinks);
                    break;

                default:
                    break;
            }

            console.log('Changes to do');
            console.log(changeFunctions);
            console.log('Applying changes...');

            this.setState({
                busy: true,
                applying: true
            }, () => {
                async.parallel(changeFunctions, (err, results) => {
                    if(err) {
                        console.log('There was an error when applying changes to your settings.');
                        console.log(err);
                        this.setState({
                            failure: true,
                            applying: false,
                            notify: true
                        });

                        mixpanel.track("Error", {
                            "Page": "Settings",
                            "Message": "Error applying changes"
                        });
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
        }
    },

    newImage(callback) {
        console.log('New artist image pending:')
        console.log(this.state.uploadedImage);

        async.waterfall([this.registerImageS3, this.updateImageDatabase],
            (err, results) => {
                if (err) {
                    console.log('Error occurred while updating image. ', err);
                    callback(err);
                } else {
                    console.log('Artist image updated.');
                    callback(null);
                }
        });
    },

    newLinks(cb) {
        var pendingSettings = this.state;
        var links = {
            fb_link: pendingSettings.fb_link,
            twitter_link: pendingSettings.twitter_link,
            instagram_link: pendingSettings.instagram_link,
            soundcloud_link: pendingSettings.soundcloud_link,
            youtube_link: pendingSettings.youtube_link,
            web_link: pendingSettings.web_link
        };

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/artist/link';

        async.forEachOf(links, (value, key, callback) => {
            $.ajax({
                type: 'POST',
                url: requestUrl,
                data: {
                    link_type: key,
                    link_url: value,
                    artist_id: this.props.artistId
                },
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done((res) => {
                callback(null);
            })
            .fail((err) => {
                console.log(err);
                callback(err);
            })
        }, (err) => {
            if (err) {
                cb(err);
            } else {
                cb(null);
            }
        });
    },

    newPassword(callback) {
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/password/update';

        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                new_password: this.state.newPass,
                artist_id: 155
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
                callback(null);
        })
        .fail((err) => {
                callback(err);
        });
    },

    onDrop(file) {
        if (file[0].type == 'image/png' || file[0].type == 'image/jpeg' || file[0].type == 'image/gif') {
            this.setState({
                uploadedImage: file
            });
        } else {
            alert('Please upload a png, jpeg, or gif image.');
        }
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

    revertChanges() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                loaded: false
            }
        });

        this.getAccountData();
        this.setState(this.getInitialState());
    },

    updateImageDatabase(imageURL, callback) {
        console.log('Adding image to databases...');
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/artist/image';

        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                image_url: imageURL,
                artist_id: this.props.artistId
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
                console.log('An error occurred when updating the database.');
                callback(err);
        });
    }
});

module.exports = SettingsEditor;
