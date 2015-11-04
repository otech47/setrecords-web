import React from 'react';
import Icon from './Icon';

var ForgotPassword = React.createClass({

	getInitialState() {
		return {
			icon: 'mail'
		};
	},

	handleBlur() {
		this.setState({
			icon: 'mail'
		});
	},

	handleFocus() {
		this.setState({
			icon: 'drafts'
		});
	},

	render() {
		var iconStyle = {
			margin: 'auto',
			cursor: 'pointer'
		};

		return (
			<div id='ForgotPassword' className='flex-container center'>
				<div className='flex-row'>
					<input placeholder='Email Address' onFocus={this.handleFocus} onBlur={this.handleBlur} />
					<Icon style={iconStyle}>{this.state.icon}</Icon>
				</div>
			</div>
		);
	}

});

module.exports = ForgotPassword;