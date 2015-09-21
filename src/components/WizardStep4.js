import React from 'react';
import WizardStep1 from './WizardStep1';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep5 from './WizardStep5';


var WizardStep4 = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="WizardStep4 wizard set-flex">
				<div className="flex-column step-tile">
					<div className="upload-set flex-fixed-1x">
						<h1>Upload A Set</h1>
					</div>
					<div className="flex-fixed-1x" >
						<h1 className="step">    Step 4 of 5</h1>
					</div>
					<div className="upload-directions">
						<p>How would you like to release this set?</p>
					</div>
					<div className=" flex-column selection">
						<div className="flex-row beacon">
							<button  className="wizard-buttons">Beacon</button>
							<p id="reward">Reward you most loyal fans with an<br/> exclusive offer at beacon locations</p>
						</div>
						<div className="flex-row free">
							<button  className="wizard-buttons">Free</button>
							<p id="immediately">Immediately available to all your fans.</p>
						</div>
						
					</div>
					<div className="current-page">
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i id="current-page" className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = WizardStep4;