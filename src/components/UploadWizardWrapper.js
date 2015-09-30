import React from 'react';
import WizardStepWrapper from './WizardStepWrapper';
import ProgressBubble from './ProgressBubble';
import WizardStep1 from './WizardStep1';

var UploadWizardWrapper = React.createClass({
	getInitialState: function() {
		return {
			type: null,
			current_step: 1
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
				<i className='fa fa-chevron-left'></i> go back
			</div>
			<div className='flex wizard-body'>
				{this.showWizardStep()}
			</div>
		</div>
		);
	},
	stepForward: function() {
		console.log('going forward');
	},
	stepBackward: function() {
		console.log('going backward');
	},
	showWizardStep: function() {
		switch(this.state.current_step) {
			case 1:
			return (<WizardStep1 />)
			break;

			default:
			break;
		}
	}
});

module.exports = UploadWizardWrapper;