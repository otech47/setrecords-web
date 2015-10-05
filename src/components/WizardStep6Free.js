import React from 'react';

var WizardStep5Free = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Select any additional sites to release to, then click continue.</p>
				<div className="flex-row step-buttons">
					<div className={"outlet-button flex-column " + (this.props.soundcloud ? '':'deactivated')} onClick={this.props.toggleSoundcloud}>
						<i className='fa fa-soundcloud' />
						<p>Soundcloud</p>
					</div>
				</div>
				<button className='step-button' onClick={this.submitStep}>
					Continue
				</button>
			</div>
		);
	},

	submitStep: function(event) {
		var submission = {};
		this.props.stepForward(submission);
	}
});

module.exports = WizardStep5Free;
