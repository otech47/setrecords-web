import React from 'react';

var WizardStep3 = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="WizardStep3 wizard set-flex">
				<div className="flex-column step-tile">
					<div className="upload-set flex-fixed-1x">
						<h1>Upload Set</h1>
					</div>
					<div className="flex-fixed-1x" >
						<h1 className="step">    Step 3 of 5</h1>
					</div>

					<div className="upload-directions">
						<p>Enter your set's informatiom</p>
					</div>
					<div className="wizard-input">
						<div >
							<label htmlFor="Mix Name"/>
							<input className="input-page3" type="text" placeholder="Mix Name"/>
						</div >
						<div >
							<label htmlFor="Genre"/>
							<input className="input-page3" type="text" placeholder="Genre"/>
						</div>
						<div >
							<label htmlFor="Episode (optional)"/>
							<input className="input-page3" type="text" placeholder="Episode (optional)"/>
						</div>
					</div>	

					<div className=" selection ">
						<button  className="wizard-buttons" >Continue</button>

					</div>
					<div className="current-page">
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i  id="current-page" className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = WizardStep3;