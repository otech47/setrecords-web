import React from 'react';

var WizardStepConfirmation = React.createClass({
	render: function() {
		var setData = this.props.setData;
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Confirm your set information is correct, then click Upload.</p>
				<table className="step-button-text">
				<tbody>
					<tr>
						<td><p>Type:</p></td>
						<td><p>{setData.type}</p></td>
					</tr>
					<tr>
						<td><p>Mix</p></td>
						<td><p>A set mixed in a studio, featuring samples from other artists (e.g., a radio show).</p></td>
					</tr>
					<tr>
						<td><button name="album" className="step-button" onClick={this.submitStep}>Album</button></td>
						<td><p>An official, original release.</p></td>
					</tr>
				</tbody>
				</table>
				<button className='step-button' onClick={this.props.uploadSet}>
					Upload
				</button>
			</div>
		);
	}
});

module.exports = WizardStepConfirmation;
