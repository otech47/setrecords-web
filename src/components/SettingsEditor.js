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

var SettingsEditor = React.createClass({
    render() {
        return (
            <div>
                settings editor
            </div>
        )
    }
});

var SettingsEditor2 = React.createClass({

	mixins: [History],

	getInitialState() {
		var settings = this.props.appState.get('artist_data');
		var settingsCopy = R.clone(settings);

		settingsCopy['artist_image'] = [];
		settingsCopy['new_pass'] = null;
		settingsCopy['confirm_pass'] = null;
		settingsCopy['password_match'] = false;
		settingsCopy['changes'] = false;
		settingsCopy['busy'] = false;
		settingsCopy['applying'] = false;
		settingsCopy['success'] = false;
		settingsCopy['failure'] = false;
		settingsCopy['open'] = false;
		settingsCopy['notify'] = false;
		return settingsCopy;
	},

	componentDidMount() {
		mixpanel.track("Settings Page Open");
	},

	componentWillMount: function() {
		this.props.push({
			type: 'SHALLOW_MERGE',
			data: {
				header: 'Preferences'
			}
		})
	},

	componentWillUnmount() {
		if(this.state.changes) {
			this.setState({
				open: true
			});
		}
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
									this.history.pushState(null, '/');
								}, 1000);
							});
						}
				});
			});

		} else {
			console.log('No pending changes. Closing window...');
			this.history.pushState(null, '/');
		}
	},

	cancelChanges() {
		if(this.state.changes) {
			this.setState({
				open: !this.state.open
			});
		} else {
			this.history.pushState(null, '/');
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
				artist_image: file,
				changes: true
			});
		} else {
			this.setState({
				artist_image: []
			});
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
				// 	var percentage = (event.loaded / filesize) * 100;
				// 	var percent = parseInt(percentage).toString() + '%';
				// 	console.log('Uploading image: ' + percent);
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
	},

	render() {
		var originalSettings = this.props.appState.get('artist_data');
		var pendingSettings = this.state;

		return (
			<div className='flex-column flex' id='SettingsEditor'>

				<Motion style={{
					opacity: spring(this.state.notify ? 1 : 0, presets.gentle),
					visibility: this.state.notify ? 'visible' : 'hidden'
				}}>
					{
						({opacity, visibility}) =>
						<Notification dismiss={() => this.history.pushState(null, '/')} style={{
							opacity: `${opacity}`,
							visibility: `${visibility}`
						}}>
							{this.showApplyingStatus()}
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
	    			<img src={pendingSettings.artist_image.length > 0 ? pendingSettings.artist_image[0].preview : constants.S3_ROOT_FOR_IMAGES + originalSettings.imageURL} />
    				<Dropzone onDrop={this.onDrop} className='dropzone flex-container center' multiple={false}>
    					<Icon>open_in_browser</Icon>
    					<p>Upload a new artist image</p>
    				</Dropzone>
				</div>

				<div className='password-change form-panel flex-column center'>
					<h1>Password</h1>
					<div>
						<p>New Password</p>
						<input name='new_pass' value={pendingSettings.new_pass} type='text' onChange={this.changePassField} />
					</div>
					<div>
						<p>Confirm New Password<i className={pendingSettings.password_match ? 'fa fa-check approved' : 'fa fa-times warning'}></i></p>
						<p className={pendingSettings.password_match ? 'invisible' : 'warning'} >Passwords must match.</p>
						<input type='text' name='confirm_pass' value={pendingSettings.confirm_pass} onChange={this.changePassField} />
					</div>
				</div>

				<div className='artist-links form-panel flex-column center'>
					<h1>Update Links</h1>
					<div>
						<p>Web</p>
						<input name='web_link' type='text' value={pendingSettings.web_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Soundcloud</p>
						<input name='soundcloud_link' type='text' value={pendingSettings.soundcloud_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Youtube</p>
						<input name='youtube_link' type='text' value={pendingSettings.youtube_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Twitter</p>
						<input name='twitter_link' type='text' value={pendingSettings.twitter_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Facebook</p>
						<input name='fb_link' type='text' value={pendingSettings.fb_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Instagram</p>
						<input name='instagram_link' type='text' value={pendingSettings.instagram_link} onChange={this.changeLinkField} />
					</div>
				</div>

				<div className='form-panel flex-row center' id='apply-changes'>
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
		);
	}
});

module.exports = SettingsEditor;
