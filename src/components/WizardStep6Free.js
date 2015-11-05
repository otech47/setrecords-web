import React from 'react';
import _ from 'underscore';

var WizardStep6Free = React.createClass({
	render: function() {
		return (
			<div className="flex-column wizard-step" id='WizardStep6Free'>
				<p className='step-info set-flex'>Select any additional sites to release to, then click continue.</p>
				<div className="flex-row buttons">
					<div className={"outlet-button flex-column " + (this.props.outlets.indexOf('Soundcloud') >= 0 ? '':'deactivated')} onClick={this.props.toggleOutlet.bind(null, 'Soundcloud')}>
						<i className='fa fa-soundcloud' />
						<p>Soundcloud</p>
					</div>
				</div>
				<button className='step-button' onClick={this.props.stepForward.bind(null, {})}>
					Finish
				</button>
			</div>
		);
	}
});

module.exports = WizardStep6Free;
