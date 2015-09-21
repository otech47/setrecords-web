import React from 'react';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';

var WizardStep5 = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="WizardStep5 wizard set-flex">
				<div className="flex-column step-tile">
					<div className="upload-set flex-fixed-1x">
						<h1>Upload Set</h1>
					</div>
					<div className="flex-fixed-1x" >
						<h1 className="step">    Step 5 of 5</h1>
					</div>
					<div className="upload-directions">
						<p>Select Beacon locations for release</p>
					</div>
					<div className="beacon-location">
						<select>
							<option value="Sethau5">Sethau5</option>
							<option value="1Hotel">1Hotel</option>
							<option value="Oscars">Oscars House</option>
							<option value="Jesus's">Jesus House</option>
							<option value="Scarlett's">Scarletts</option>
						</select>
					</div>
					<div className=" selection ">
						<button href="" className="wizard-buttons" >Finish</button>

					</div>
					<div className="current-page">
						<i className="fa fa-circle-o"></i>
						<i  className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i id="current-page" className="fa fa-circle-o"></i>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = WizardStep5;