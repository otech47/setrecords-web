var React = require('react/addons');
import TracklistImproved from './TracklistImproved';

var WizardStep3 = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Create the tracklist for your set, then click Continue.</p>
				<p className='step-info set-flex'>(This step is optional and can be done at any time)</p>
				<button className='step-button' onClick={this.submitStep}>Continue</button>
				<TracklistImproved {...this.props} />
			</div>
		);
	},

	submitStep: function(event) {
		var submission = {};
		this.props.stepForward(submission);
	}
});

module.exports = WizardStep3;
