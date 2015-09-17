import React from 'react';

var WizardStep2 = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="WizardStep2 wizard set-flex">
				<div className="flex-column step-tile">
					<div className="upload-set flex-fixed-1x">
						<h1>Upload Set</h1>
					</div>
					<div className="flex-fixed-1x" >
						<h1 className="step">    Step 2 of 5</h1>
					</div>
					<div className="upload-directions">
						<p>Choose a set to upload.(mp3 preferred)</p>
					</div>
					<div className=" selection ">
						<button  className="wizard-buttons" >Choose File</button>

					</div>
					<div className="current-page">
						<i className="fa fa-circle-o"></i>
						<i id="current-page" className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = WizardStep2;