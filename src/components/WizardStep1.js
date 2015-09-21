import React from 'react';
import WizardStep2 from './WizardStep2';
import WizardStep3 from './WizardStep3';
import WizardStep4 from './WizardStep4';
import WizardStep5 from './WizardStep5';


var WizardStep1 = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
			<div className="WizardStep1 wizard set-flex">
				<div className="flex-column step-tile">
					<div className="upload-set flex-fixed-1x">
						<h1>Upload A Set</h1>
					</div>
					<div className="flex-fixed-1x" >
						<h1 className="step">    Step 1 of 5</h1>
					</div>
					<div className="upload-directions">
						<p>Is this a Live Set or a Mix</p>
					</div>
					<div className="  selection">
						<button  className="wizard-buttons">Live Set</button>
						<button  className="wizard-buttons">Mix</button>
					</div>
					<div className="current-page">
						<i id="current-page"className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
						<i className="fa fa-circle-o"></i>
					</div>
				</div>

			</div>
		);
	}
});

module.exports = WizardStep1;