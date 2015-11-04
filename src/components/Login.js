import React from 'react';
import {History} from 'react-router';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Motion, spring, presets} from 'react-motion';

import ForgotPassword from './ForgotPassword';
import Icon from './Icon';

var Login = React.createClass ({

	mixins: [LinkedStateMixin, History],

	getInitialState: function() {
		return {
			username: '',
			password: '',
			error: null,
		}
	},

	render: function () {
		return(
			<div id='Login'>
				<video id='introvid' autoPlay='auto' loop='loop'>
					<source src='https://setmine.com/videos/setrecords-login-compress.mp4' type='video/mp4'/>
				</video>
				<section className='flex-container'>
					<div className='form center hidden'>
						<div className='flex-row'>
							<Icon className='center'>perm_identity</Icon>
							<input type='text' placeholder='Username' valueLink={this.linkState('username')} />
						</div>
						<div className='flex-row'>
							<Icon className='center'>lock_outline</Icon>
							<input type='password' placeholder='Password' valueLink={this.linkState('password')} />
						</div>
						<button className='flex-container' onClick={this.submitLogin} disabled={(this.state.username.length > 0 && this.state.password.length > 0 ? false : true)}>Sign In</button>
						<p>Forgot pasword?</p>
					</div>
					<ForgotPassword />
				</section>
			</div>
		);
	},

	submitLogin: function() {
		console.log('Submitting login with:');
		console.log(this.state.username);
		console.log(this.state.password);

		var self = this;
		var requestUrl = 'http://localhost:3000/setrecords/login';
		$.ajax({
			type: 'POST',
			url: requestUrl,
			data: {
				username: self.state.username,
				password: self.state.password
			},
			success: function(res) {
				console.log(res);
				if (res.info == 'authenticated') {
					console.log('Login successful.');
					self.props.push({
						type: 'SHALLOW_MERGE',
						data: {
							artist_data: {
								id: res.artist_id
							}
						}
					});
					self.history.pushState(null, '/main');
				} else {
					switch (res.info) {
						case 'username':
						console.log('Username was incorrect.');
						self.setState({
							username: '',
							password: '',
							error: 'username'
						});
						break;

						case 'password':
						console.log('Password was incorrect.');
						self.setState({
							password: '',
							error: 'password'
						});
						break;

						default:
						console.log('Unknown error.');
						self.setState({
							username: '',
							password: '',
							error: 'unknown'
						});
						break;
					}
				}
			},
			error: function(err) {
				console.log('An error occurred with login route.');
				console.log(err);
			}
		});
	}
})
module.exports = Login;