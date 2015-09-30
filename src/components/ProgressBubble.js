import React from 'react/addons';

var ProgressBubble = React.createClass({

	render: function() {
		var wizardState = this.props.wizardState;
		var currentStep = wizardState.current_step;
		var step = this.props.step;
		var filled = '';
		var valid = '';

		return (
			<i className={'fa fa-fw fa-circle' + filled + valid} name={this.props.step} onClick={this.props.goToStep} ></i>
		);
	}
});

module.exports = ProgressBubble;