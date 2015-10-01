import React from 'react';
var Dropzone = require('react-dropzone');
import _ from 'underscore';

var WizardStep2 = React.createClass({
	getInitialState: function() {
		return {
			files: []
		};
	},
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<Dropzone onDrop={this.onDrop} multiple={true}>
					Drop files here!
				</Dropzone>
				<button onClick={this.sendFiles}>Click to send</button>
			</div>
		);
	},

	onDrop: function(files) {
		var newFiles = this.state.files;
		_.each(files, function(file) {
			newFiles.push(file);
		});

		this.setState({
			files: newFiles
		}, function() {
			console.log(this.state.files);
		});
	},
	sendFiles: function(event) {
		console.log("Adding files to form data...");
		var formData = new FormData();
		_.each(this.state.files, function(file) {
			formData.append('files[]', file, file.name);
		});

		console.log("Complete.");
		console.log("Sending to server...");
		var requestURL = "http://localhost:3000/api/v/7/setrecords/upload/files";
		$.ajax({
			type: 'POST',
			url: requestURL,
			data: {
				package: formData
			},
			success: function(res) {
				console.log("Success. Result:");
				console.log(res);
			},
			error: function(err) {
				console.log("An error occurred:");
				console.log(err);
			}
		});

		console.log("Deleting existing files...");
		this.setState({
			files: []
		});
		console.log("Done.");
	}
});

module.exports = WizardStep2;