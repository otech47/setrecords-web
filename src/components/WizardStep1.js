import React from 'react';

var WizardStep1 = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>What kind of set is this?</p>
				<table className="step-button-text">
				<tbody>
					<tr>
						<td><button name="festival" className="step-button" onClick={this.submitStep}>Live</button></td>
						<td><p>From a festival, concert, or another live venue.</p></td>
					</tr>
					<tr>
						<td><button name="mix" className="step-button" onClick={this.submitStep}>Mix</button></td>
						<td><p>A set mixed in a studio, featuring samples from other artists (e.g., a radio show).</p></td>
					</tr>
					<tr>
						<td><button name="album" className="step-button" onClick={this.submitStep}>Album</button></td>
						<td><p>An official, original release.</p></td>
					</tr>
				</tbody>
				</table>
			</div>
		);
	},

	submitStep: function(event) {
		var submission = {};
		submission['type'] = event.currentTarget.name;
		submission['current_step'] = 2;
		submission['1'] = true;
		this.props.stepForward(submission);
	},
});

module.exports = WizardStep1;