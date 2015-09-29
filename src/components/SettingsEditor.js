import React from 'react/addons';
var Dropzone = require("react-dropzone");
import _ from 'underscore';
import async from 'async';
var Loader = require("react-loader");
var constants = require('../constants/constants');

var SettingsEditor = React.createClass({
	getInitialState: function() {
		var settingsCopy = this.props.cloneObject(this.props.settings);
		settingsCopy["artist_image"] = [];
		settingsCopy["new_pass"] = null;
		settingsCopy["confirm_pass"] = null;
		settingsCopy["password_match"] = false;
		settingsCopy["changes"] = false;
		settingsCopy["busy"] = false;
		settingsCopy["applying"] = false;
		settingsCopy["success"] = false;
		settingsCopy["failure"] = false;
		return settingsCopy;
	},
	render: function() {
		var originalSettings = this.props.settings;
		var pendingSettings = this.state;
		return (
			<div className="mobile-settings-editor flex-column">
				{this.showApplyingStatus()}
				<div className="flex-row apply-editor">
					<button className="flex-fixed apply set-flex" onClick={this.applyChanges}>
						Apply
					</button>
					<button className="flex-fixed revert set-flex" onClick={this.revertChanges}>
						Revert
					</button>
					<button className="flex-fixed cancel set-flex" onClick={this.cancelChanges}>
						Cancel
					</button>					
				</div>
				<div className="artist-name flex-row">
					{originalSettings.artist}
				</div>
				<div className="artist-image">
	    			<img src={pendingSettings.artist_image.length > 0 ? pendingSettings.artist_image[0].preview : constants.S3_ROOT_FOR_IMAGES + originalSettings.imageURL} />
	    				<Dropzone onDrop={this.onDrop} className="upload-image set-flex" multiple={false}>
	    					<p>Click or drag file here to upload new artist image.</p>
	    				</Dropzone>
				</div>
				<div className="flex-column password-change">
					<div>
						<p>New Password</p>
						<input name="new_pass" value={pendingSettings.new_pass} type="text" onChange={this.changePassField} />
					</div>
					<div>
						<p>Confirm New Password<i className={pendingSettings.password_match ? "fa fa-check approved" : "fa fa-times warning"}></i></p>
						<p className={pendingSettings.password_match ? "invisible" : "warning"} >Passwords must match.</p>
						<input type="text" name="confirm_pass" value={pendingSettings.confirm_pass} onChange={this.changePassField} />
					</div>
				</div>
				<div className="artist-links flex-column">
					<div>
						<p>Website Link</p>
						<input name="web_link" type="text" value={pendingSettings.web_link} onChange={this.changeLinkField}  />
					</div>
					<div>
						<p>Soundcloud Link</p>
						<input name="soundcloud_link" type="text" value={pendingSettings.soundcloud_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Youtube Link</p>
						<input name="youtube_link" type="text" value={pendingSettings.youtube_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Twitter Link</p>
						<input name="twitter_link" type="text" value={pendingSettings.twitter_link} onChange={this.changeLinkField} />
					</div>
					<div>
						<p>Facebook Link</p>
						<input name="fb_link" type="text" value={pendingSettings.fb_link} onChange={this.changeLinkField} />
					</div>						
					<div>
						<p>Instagram Link</p>
						<input name="instagram_link" type="text" value={pendingSettings.instagram_link} onChange={this.changeLinkField} />
					</div>
				</div>
			</div>
		);
	},
	changePassField: function(event) {
		var self = this;
		var field = event.target.name;
		var newState = {};
		newState[field] = event.target.value;
		newState["changes"] = true;
		this.setState(newState, function() {
			var passwordsMatch = false;
			if ((self.state.confirm_pass == self.state.new_pass) && self.state.new_pass.length > 0) {
			passwordsMatch = true;
			}
			self.setState({
				password_match: passwordsMatch
			});
		});
	},
	changeLinkField: function(event) {
		var field = event.target.name;
		var newState = {};
		newState[field] = event.target.value;
		newState["changes"] = true;
		this.setState(newState);
	},
	newImage: function(callback) {
		// console.log("New tile image pending:")
		// console.log(this.state.artist_image);
		async.waterfall([this.registerImageS3, this.updateImageDatabase],
			function(err, results) {
				if (err) {
					// console.log("Error occurred while updating image. ", err);
					callback(err);
				} else {
					// console.log("Tile image updated.");
					callback(null);
				}
		});
	},
	newLinks: function(callback) {
		var pendingSettings = this.state;
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/links/" + this.props.settings.id;
		var links = {
			fb_link: pendingSettings.fb_link,
			twitter_link: pendingSettings.twitter_link,
			instagram_link: pendingSettings.instagram_link,
			soundcloud_link: pendingSettings.soundcloud_link,
			youtube_link: pendingSettings.youtube_link,
			web_link: pendingSettings.web_link
		};
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				links: links
			},
			success: function(res) {
				callback(null);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	newPassword: function(callback) {
		var pendingPassword = this.state.confirm_pass;
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/password/" + this.props.settings.id;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				password: pendingPassword
			},
			success: function(res) {
				callback(null);
			},
			error: function(err) {
				callback(err);
			}
		});
	},
	onDrop: function(file) {
		if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
			this.setState({
				artist_image: file,
				changes: true
			});
		} else {
			this.setState({
				artist_image: []
			});
			alert("Please upload a png, jpeg, or gif image.");
		}
	},
	showApplyingStatus: function() {
		if (this.state.busy) {
			var statusMessage;

			if (this.state.success) {
				statusMessage = "Your changes have been applied.";
			} else if (this.state.failure) {
				statusMessage = "There was an error applying your changes. Please try again.";
			} else {
				statusMessage = "Applying changes...";
			}

			return (
				<div className="applying-changes-overlay set-flex">
					{statusMessage}
				</div>
			);
		}
	},
	registerImageS3: function(callback) {
		var file = this.state.artist_image[0];
		var self = this;
		// console.log("Requesting encoding from AWS...");
		$.ajax({
			type: "GET",
			url: "http://localhost:3000/aws/configureAWS?filename=" + encodeURIComponent(file.name),
			contentType: "application/json",
			success: function(response) {
				// console.log("Encoding successful.");
				AWS.config.update(response.settings);
				var encodedFilename = response.encoded;
				var filesize = file.size;
				var s3 = new AWS.S3();

				s3.timeout = 50000;
				var params = {
					Bucket: "stredm",
					Key: "namecheap/" + encodedFilename,
					ContentType: file.type,
					Body: file
				};
				var upload = s3.upload(params);
				// upload.on("httpUploadProgress", function(event) {
				// 	var percentage = (event.loaded / filesize) * 100;
				// 	var percent = parseInt(percentage).toString() + "%";
				// 	console.log("Uploading image: " + percent);
				// });

				// console.log("Uploading file to S3...");
				upload.send(function(err, data) {
					if (err) {
						// console.log("An error occurred uploading the file to S3.");
						callback(err);
					} else {
						// console.log("Upload successful. File located at: " + data.Location);
						callback(null, response.encoded);
					}
				});
			},
			error: function(err) {
				// console.log("There was an error encoding the file.");
				callback(err);
			}
		});
	},
	updateImageDatabase: function(imageURL, callback) {
		// console.log("Adding image to databases...");
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/image/" + this.props.settings.id;
		$.ajax({
			type: "POST",
			url: requestURL,
			data: {
				image_url: imageURL
			},
			success: function(res) {
				// console.log("Image successfully added to database.")
				callback(null);
			},
			error: function(err) {
				// console.log("An error occurred when updating the database.");
				callback(err);
			}
		});
	},

	applyChanges: function() {
		var pendingSettings = this.state;
		var originalSettings = this.props.settings;
		var self = this;

		if (pendingSettings.changes) {
			console.log("Pending changes found.");
			var changeFunctions = [];
			if (pendingSettings.artist_image.length > 0) {
				changeFunctions.push(this.newImage);
			}
			if (pendingSettings.password_match) {
				changeFunctions.push(this.newPassword);
			}
			if (pendingSettings.fb_link != originalSettings.fb_link
				|| pendingSettings.twitter_link != originalSettings.twitter_link
				|| pendingSettings.web_link != originalSettings.web_link
				|| pendingSettings.instagram_link != originalSettings.instagram_link
				|| pendingSettings.soundcloud_link != originalSettings.soundcloud_link
				|| pendingSettings.youtube_link != originalSettings.youtube_link) {
				changeFunctions.push(this.newLinks);
			}

			console.log("Changes to do");
			console.log(changeFunctions);
			console.log("Applying changes...");
			this.setState({
				busy: true,
				applying: true
			}, function() {
				async.parallel(changeFunctions, function(err, results) {
					if (err) {
						console.log("There was an error when applying changes to this set.");
						console.log(err);
						self.setState({
							failure: true,
							applying: false
						}, function() {
							setTimeout(function() {
								self.props.close(true);	
							}, 3000);
						});
					} else {
							console.log("All changes applied successfully.");
							self.setState({
								applying: false,
								success: true
							}, function() {
								setTimeout(function() {
									self.props.close(true);	
								}, 3000);
							});
						}
				});
			});

		} else {
			console.log("No pending changes. Closing window...");
			this.props.close(false);
		}
	},
	revertChanges: function() {
		// console.log("Reverting...");
		var settingsCopy = this.props.cloneObject(this.props.settings);
		settingsCopy["artist_image"] = [];
		settingsCopy["new_pass"] = null;
		settingsCopy["confirm_pass"] = null;
		settingsCopy["password_match"] = false;
		settingsCopy["changes"] = false;
		settingsCopy["busy"] = false;
		settingsCopy["applying"] = false;
		settingsCopy["success"] = false;
		settingsCopy["failure"] = false;
		this.replaceState(settingsCopy);
	},
	cancelChanges: function() {
		this.props.close(false);
	}
});

module.exports = SettingsEditor;