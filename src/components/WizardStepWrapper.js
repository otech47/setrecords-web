import React from 'react';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';

var WizardStepWrapper = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		switch(this.props.wizardData.step) {
			case 1:
			return <WizardStep1 appState={this.props.appState} wizardData={this.props.wizardData} />
			break;

			case 2:
			return <WizardStep2 appState={this.props.appState} wizardData={this.props.wizardData} />
			break;

			case 3:
			return <WizardStep3 appState={this.props.appState} wizardData={this.props.wizardData} />
			break;

			case 4:
			return <WizardStep4 appState={this.props.appState} wizardData={this.props.wizardData} />
			break;

			case 5:
			return <WizardStep5 appState={this.props.appState} wizardData={this.props.wizardData} />
			break;

			default:
			console.log("step out of bounds! ERROROROROROROR");
			break;
		}
	}
});

module.exports = WizardStepWrapper;
