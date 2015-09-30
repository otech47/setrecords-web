import React from 'react';
import WizardStepWrapper from './WizardStepWrapper';
import ProgressBubble from './ProgressBubble';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';

var UploadWizardWrapper = React.createClass({
	getInitialState: function() {
		return {
			type: null,
			current_step: 1,
			'1': null,
			'2': null,
			'3': null,
			'4': null,
			'5': null
		}
	},
	render: function() {
		var appState = this.props.appState;
		return (
		<div className='upload-set-wizard flex-column'>
			<div className='wizard-banner set-flex'>
				<p>Upload a Set</p>
			</div>
			<p className='step-counter'>Step {this.state.current_step} of 5</p>
			<div className={'back-arrow' + (this.state.current_step > 1 ? '':' invisible')} onClick={this.stepBackward}>
				<i className='fa fa-chevron-left'></i> back
			</div>
			<div className='flex wizard-body'>
				{this.showWizardStep()}
			</div>
		</div>
		);
	},
	stepForward: function(setData) {
		if (setData) {
			var self = this;
			this.setState(setData, function() {
				console.log(self.state);
			});
		} else {
			console.log("Moving forward (via the forward button presumably...)");
			var nextStep = this.state.current_step + 1;
			this.setState({
				current_step: nextStep
			});
		}
	},
	stepBackward: function() {
		console.log('going backward');
		var previousStep = this.state.current_step - 1;
		this.setState({
			current_step: previousStep
		});
	},
	showWizardStep: function() {
		switch(this.state.current_step) {
			case 1:
			return (<WizardStep1 stepForward={this.stepForward}/>);
			break;

			case 2:
			return (<WizardStep2 stepForward={this.stepForward} />);
			break;

			default:
			break;
		}
	}
});

module.exports = UploadWizardWrapper;