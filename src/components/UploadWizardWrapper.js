import React from 'react';
import WizardStepWrapper from './WizardStepWrapper';

var UploadWizardWrapper = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var appState = this.props.appState;
		var wizardData = appState.get("wizardData");
		return (
		<div>
			<div className="uploadOverlay"></div>
			<div className="uploadWizard flex-column">
				<div className="wizardBanner set-flex">
					<p>Upload a Set</p>
				</div>
				<div className="wizardBody flex-6x flex-column">
					<p className="stepText">Step {wizardData.step} of 5</p>
					<WizardStepWrapper appState={appState} wizardData={wizardData} />
					<div className="flex-row flex-zero right wizard-progress-bubbles">
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