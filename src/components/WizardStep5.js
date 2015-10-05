var React = require('react/addons');

var WizardStep4 = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>How would you like to release this set?</p>
				<table className="step-button-text">
				<tbody>
					<tr>
						<td><button name="beacon" className="step-button" onClick={this.submitStep}>Beacon</button></td>
						<td><p>Reward your most loyal fans with an exclusive offer at beacon locations.</p></td>
					</tr>
					<tr>
						<td><button name="free" className="step-button" onClick={this.submitStep}>Free</button></td>
						<td><p>Immediately available to all your fans.</p></td>
					</tr>
				</tbody>
			</table>
			</div>
		);
	},

	submitStep: function(event) {
		var submission = {};
		submission['release'] = event.currentTarget.name;
		this.props.stepForward(submission);
	},
});

module.exports = WizardStep4;
