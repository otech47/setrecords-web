import React from 'react';

var WizardStep1 = React.createClass({
	render: function() {
		var stepForward = this.props.stepForward;
		return (
			<div className="flex-column wizard-step" id='WizardStep1'>
				<p>What kind of set is this?</p>
				<table>
					<tbody>
						<tr>
							<td><button name="festival" className="step-button" onClick={stepForward.bind(null, {'set_type': 'Live'})}>Live</button></td>
							<td><p>From a festival, concert, or another live venue.</p></td>
						</tr>
						<tr>
							<td><button name="mix" className="step-button" onClick={stepForward.bind(null, {'set_type': 'Mix'})}>Mix</button></td>
							<td><p>A set mixed in a studio, featuring samples from other artists (e.g., a radio show).</p></td>
						</tr>
						<tr>
							<td><button name="album" className="step-button" onClick={stepForward.bind(null, {'set_type': 'Album'})}>Album</button></td>
							<td><p>An official, original release.</p></td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});

module.exports = WizardStep1;