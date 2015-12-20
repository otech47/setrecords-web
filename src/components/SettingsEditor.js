import React from 'react';
import update from 'react-addons-update';
import Dropzone from 'react-dropzone';
import _ from 'underscore';
import R from 'ramda';
import async from 'async';
import Loader from 'react-loader';
import constants from '../constants/constants';
import {History} from 'react-router';
import {Motion, spring, presets} from 'react-motion';
import Icon from './Icon';
import ConfirmChanges from './ConfirmChanges';
import Notification from './Notification';


//
// <div className='form-panel flex-row center' id='apply-changes'>
//     <div className='flex-fixed apply flex-container' onClick={this.applyChanges}>
//         Apply
//     </div>
//     <div className='flex-fixed revert flex-container' onClick={this.revertChanges}>
//         Revert
//     </div>
//     <div className='flex-fixed cancel flex-container' onClick={this.cancelChanges}>
//         Cancel
//     </div>
// </div>

var SettingsEditor = React.createClass({

    mixins: [History],

    getInitialState() {
        return {
            uploadedImage: [],
            newPass: '',
            confirmPass: '',
            changes: false,
            busy: false,
            applying: false,
            success: false,
            failure: false,
            open: false,
            notify: false
        };
    },

    componentDidMount() {
        // mixpanel.track("Settings Page Open");
        this.getAccountData();
    },

    componentWillMount: function() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Account'
            }
        });
    },

    componentWillUnmount() {
        if(this.state.changes) {
            this.setState({
                open: true
            });
        }
    },

    render() {
        // var originalSettings = this.props.appState.get('artist_data');
        // var pendingSettings = this.state;

        var deepLinkState = this.deepLinkState;

        var imageUrl = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;

        if (this.state.uploadedImage.length > 0) {
            imageUrl = this.state.uploadedImage[0].preview;
        } else if (this.state.icon_image) {
            imageUrl = constants.S3_ROOT_FOR_IMAGES + this.state.icon_image.imageURL;
        }

        var passwordMatch = this.state.newPass == this.state.confirmPass && this.state.newPass.length > 0;

        return (
            <div className='flex-column flex' id='SettingsEditor'>

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
                            { /* this.showApplyingStatus() */ }
                        </Notification>
                    }
                </Motion>

                <Motion style={{
                    opacity: spring(this.state.open ? 1 : 0, presets.gentle),
                    visibility: this.state.open ? 'visible' : 'hidden'
                }}>
                    {
                        ({opacity, visibility}) =>
                        <ConfirmChanges cancel={() => this.setState({open: false})} style={{
                            opacity: `${opacity}`,
                            visibility: `${visibility}`
                        }}>
                            Are you sure you want to leave? All unsaved changes will be lost.
                        </ConfirmChanges>
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
                        <p>New Password</p>
                        <input name='new_pass' valueLink={deepLinkState(['newPass'])} type='text' />
                    </div>
                    <div>
                        <p>Confirm New Password<i className={passwordMatch ? 'fa fa-check approved' : 'fa fa-times warning'}></i></p>
                        <p className={passwordMatch ? 'invisible' : 'warning'} >Passwords must match.</p>
                        <input type='text' name='confirm_pass' valueLink={deepLinkState(['confirmPass'])} />
                    </div>
                </div>


                <div className='artist-links form-panel flex-column center'>
                    <h1>Update Links</h1>
                    <div>
                        <p>Web</p>
                        <input name='web_link' type='text' valueLink={deepLinkState(['web_link'])} />
                    </div>
                    <div>
                        <p>Soundcloud</p>
                        <input name='soundcloud_link' type='text' valueLink={deepLinkState(['soundcloud_link'])} />
                    </div>
                    <div>
                        <p>Youtube</p>
                        <input name='youtube_link' type='text' valueLink={deepLinkState(['youtube_link'])} />
                    </div>
                    <div>
                        <p>Twitter</p>
                        <input name='twitter_link' type='text' valueLink={deepLinkState(['twitter_link'])} />
                    </div>
                    <div>
                        <p>Facebook</p>
                        <input name='fb_link' type='text' valueLink={deepLinkState(['fb_link'])} />
                    </div>
                    <div>
                        <p>Instagram</p>
                        <input name='instagram_link' type='text' valueLink={deepLinkState(['instagram_link'])} />
                    </div>
                </div>

            </div>
        );
    },

    browse: function(event) {
        this.refs.dropzone.open();
    },

    getAccountData: function() {
        var query = `{
            artist (id: ${this.props.artistId}) {
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
            type: 'post',
            url: 'http://localhost:3000/v/10/setrecords/',
            data: {
                query: query
            }
        })
        .done((res) => {
            console.log(res);
            this.setState(res.payload.artist, console.log(this.state));
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

    applyChanges() {
        var pendingSettings = this.state;
        var originalSettings = this.props.appState.get('artist_data');

        if (pendingSettings.changes) {
            console.log('Pending changes found.');
            var changeFunctions = [];
            if (pendingSettings.artist_image.length > 0) {
                changeFunctions.push(this.newImage);
            }
            if (pendingSettings.password_match) {
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
                        }, () => {
                            setTimeout(() => {
                                this.replaceState(this.getInitialState());
                            }, 1000);
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
            this.history.push(null, '/');
        }
    },

    cancelChanges() {
        if(this.state.changes) {
            this.setState({
                open: !this.state.open
            });
        } else {
            this.history.push(null, '/');
        }
    },

    changePassField(event) {
        var field = event.target.name;
        var newState = {};
        newState[field] = event.target.value;
        newState['changes'] = true;

        this.setState(newState, () => {
            var passwordsMatch = false;
            if ((this.state.confirm_pass == this.state.new_pass) && this.state.new_pass.length > 0) {
                passwordsMatch = true;
            }
            this.setState({
                password_match: passwordsMatch
            });
        });
    },

    changeLinkField(event) {
        var field = event.target.name;
        var newState = {};
        newState[field] = event.target.value;
        newState['changes'] = true;
        this.setState(newState);
    },

    newImage(callback) {
        // console.log('New tile image pending:')
        // console.log(this.state.artist_image);
        async.waterfall([this.registerImageS3, this.updateImageDatabase],
            (err, results) => {
                if (err) {
                    // console.log('Error occurred while updating image. ', err);
                    callback(err);
                } else {
                    // console.log('Tile image updated.');
                    callback(null);
                }
        });
    },

    newLinks(callback) {
        var pendingSettings = this.state;
        var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/links/' + this.props.appState.get('artist_data').id;
        var links = {
            fb_link: pendingSettings.fb_link,
            twitter_link: pendingSettings.twitter_link,
            instagram_link: pendingSettings.instagram_link,
            soundcloud_link: pendingSettings.soundcloud_link,
            youtube_link: pendingSettings.youtube_link,
            web_link: pendingSettings.web_link
        };
        $.ajax({
            type: 'POST',
            url: requestURL,
            data: {
                links: links
            }
        })
        .done((res) => {
            callback(null);
        })
        .fail((err) => {
            console.log(err);
        });
    },

    newPassword(callback) {
        var pendingPassword = this.state.confirm_pass;
        var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/password/' + this.props.settings.id;
        $.ajax({
            type: 'POST',
            url: requestURL,
            data: {
                password: pendingPassword
            },
            success: (res) => {
                callback(null);
            },
            error: (err) => {
                callback(err);
            }
        });
    },

    onDrop(file) {
        if (file[0].type == 'image/png' || file[0].type == 'image/jpeg' || file[0].type == 'image/gif') {
            this.setState({
                uploadedImage: file,
                changes: true
            });
        } else {
            alert('Please upload a png, jpeg, or gif image.');
        }
    },

    registerImageS3(callback) {
        var file = this.state.artist_image[0];
        // console.log('Requesting encoding from AWS...');
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/aws/configureAWS?filename=' + encodeURIComponent(file.name),
            contentType: 'application/json',
            success: (res) => {
                // console.log('Encoding successful.');
                AWS.config.update(res.settings);
                var encodedFilename = res.encoded;
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
                // upload.on('httpUploadProgress', function(event) {
                //     var percentage = (event.loaded / filesize) * 100;
                //     var percent = parseInt(percentage).toString() + '%';
                //     console.log('Uploading image: ' + percent);
                // });

                // console.log('Uploading file to S3...');
                upload.send((err, data) => {
                    if (err) {
                        // console.log('An error occurred uploading the file to S3.');
                        callback(err);
                    } else {
                        // console.log('Upload successful. File located at: ' + data.Location);
                        callback(null, res.encoded);
                    }
                });
            },
            error: (err) => {
                // console.log('There was an error encoding the file.');
                callback(err);
            }
        });
    },

    revertChanges() {
        this.replaceState(this.getInitialState());
    },

    showApplyingStatus() {
        if (this.state.busy) {
            var statusMessage;

            if (this.state.success) {
                statusMessage = 'Your changes have been applied.';
            } else if (this.state.failure) {
                statusMessage = 'There was an error applying your changes. Please try again.';
            } else {
                statusMessage = 'Applying changes...';
            }

            return statusMessage;
        }
    },

    updateImageDatabase(imageURL, callback) {
        // console.log('Adding image to databases...');
        var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/image/' + this.props.settings.id;
        $.ajax({
            type: 'POST',
            url: requestURL,
            data: {
                image_url: imageURL
            },
            success: (res) => {
                // console.log('Image successfully added to database.')
                callback(null);
            },
            error: (err) => {
                // console.log('An error occurred when updating the database.');
                callback(err);
            }
        });
    }
});

module.exports = SettingsEditor;
