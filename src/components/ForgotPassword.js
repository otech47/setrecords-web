import React from 'react';
import {Motion, spring, presets} from 'react-motion';
import Icon from './Icon';

var ForgotPassword = React.createClass({

	getInitialState() {
		return {
			icon: 'mail',
			email: false,
			value: null
		};
	},

	handleChange() {

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

	submit() {
		var email = this.refs.mail.value;
		var emailIsValid = this.validateEmail(email);
		if(emailIsValid) {
			this.setState({
				email: true,
				value: 'Reset email sent.'
			});
			setTimeout(() => this.setState(this.getInitialState()), 3000);
		} else {
			alert('Please enter a valid email address');
		}
	},

	validateEmail(email) {
		var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		return regex.test(email);
	},

	render() {
		return (
			<div id='ForgotPassword' className='flex-container center'>
					<div className='flex-row'>
						<input placeholder='Email Address' ref='mail' onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.value} onChange={this.handleChange}/>
						<Motion style={{
							shift: spring(this.state.email ? 220 : 0, presets.gentle)
						}}>
							{
								({shift}) =>
								<Icon onClick={this.submit} style={{right: `${shift}`}}>{this.state.icon}</Icon>
							}
						</Motion>
					</div>
			</div>
		);
	}

});

module.exports = ForgotPassword;
