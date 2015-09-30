import React from 'react';

var WizardStep1 = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step">
				<p className='step-info'>What kind of set is this?</p>
				<div className="flex-row flex step-button-text">
					<button className="step-button">Live</button>
					From a festival, concert, or another live venue.
				</div>
				<div className="flex-row flex step-button-text">
					<button className="step-button">Mix</button>
					A set mixed in a studio, featuring samples from other artists (e.g., a radio show).
				</div>
				<div className="flex-row flex step-button-text">
					<button className="step-button">Album</button>
					An official, original release.
				</div>
			</div>
		);
	}
});

module.exports = WizardStep1;