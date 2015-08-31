import React from 'react';
import WizardStepWrapper from './WizardStepWrapper';

var UploadWizardWrapper = React.createClass({
	getInitialState: function() {
		return {
			step: 1,
			uploadType: '',
			uploadFile: '',
			uploadInfo: {
				name: '',
				genre: '',
				episode: ''
			},
			releaseType: '',
			beaconLocations: []
		};
	},
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	nextStep: function() {
		this.setState({
			step: this.state.step + 1
		});
		console.log("going to next step");
	},
	previousStep: function() {
		this.setState({
			step: this.state.step -1
		});
		console.log("going to previous step");
	},
	saveAndContinue: function() {
		console.log("saving and continuing");
	},
	submitUpload: function(data) {
		//take the data (its wizardData) and put it in our state
	},
	render: function() {
		return (
		<div>
			<div className="uploadOverlay"></div>
			<div className="uploadWizard flex-column set-flex">
				<div className="wizardBanner flex-zero set-flex">
					<p className="center">Upload a Set</p>
				</div>
				<div className="wizardBody flex-6x flex-column">
					<p className="stepText">Step {this.state.step} of 5</p>
					<WizardStepWrapper wizardData={this.state} nextStep={this.nextStep} previousStep={this.previousStep} />
					<div className="flex-row flex-zero center wizard-progress-bubbles">
						<i className={'fa fa-fw fa-circle click'} id='step-1'></i>
						<i className={'fa fa-fw fa-circle-o click'} id='step-2'></i>
						<i className={'fa fa-fw fa-circle-o click'} id='step-3'></i>
						<i className={'fa fa-fw fa-circle-o click'} id='step-4'></i>
						<i className={'fa fa-fw fa-circle-o click'} id='step-5'></i>
					</div>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = UploadWizardWrapper;