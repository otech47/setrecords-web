import React from 'react';
import {History} from 'react-router';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import ForgotPassword from './ForgotPassword';
import Icon from './Icon';

var Login = React.createClass ({

    mixins: [LinkedStateMixin, History],

    getInitialState: function() {
        return {
            username: '',
            password: '',
            error: null,
            changePassword: false
        }
    },

    render: function () {
        var password = this.state.changePassword ? <ForgotPassword /> : <p onClick={() => this.setState({changePassword: true})}>Forgot pasword?</p>
        return(
            <div id='Login'>
                <video id='introvid' autoPlay='auto' loop='loop'>
                    <source src='https://setmine.com/videos/setrecords-login-compress.mp4' type='video/mp4'/>
                </video>
                <section className='flex-container'>
                    <div className='form center'>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>perm_identity</Icon>
                            <input type='text' placeholder='Username' valueLink={this.linkState('username')} />
                        </div>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>lock_outline</Icon>
                            <input type='password' placeholder='Password' valueLink={this.linkState('password')} />
                        </div>
                        <div className={'set-flex login-error ' + (this.state.error ? '' : 'hidden')}>
                            {this.state.error}
                        </div>
                        <button className='flex-container' onClick={this.submitLogin} disabled={(this.state.username.length > 0 && this.state.password.length > 0 ? false : true)}>Sign In</button>
                        {password}
                    </div>
                </section>
            </div>
        );
    },

    submitLogin: function() {
        console.log('Submitting login with:');
        console.log(this.state.username);
        console.log(this.state.password);

        var self = this;
        var requestUrl = 'http://localhost:3000/v/10/setrecordsuser/login';
        $.ajax({
            type: 'POST',
            url: requestUrl,
            data: {
                username: self.state.username,
                password: self.state.password
            },
            success: function(res) {
                console.log(res);
                console.log('Login successful.');
                self.props.push({
                    type: 'SHALLOW_MERGE',
                    data: {
                        artistId: res.payload.setrecordsuser_login.artist_id,
                    }
                });
                self.history.pushState(null, '/content');
            },
            error: function(err) {
                console.log(err);
                switch (err.responseJSON.error) {
                    case 'User not found':
                    console.log('Username was incorrect.');
                    self.setState({
                        username: '',
                        password: '',
                        error: 'User not found.'
                    });
                    break;

                    case 'Incorrect Password':
                    console.log('Password was incorrect.');
                    self.setState({
                        password: '',
                        error: 'Incorrect password.'
                    });
                    break;

                    default:
                    console.log('Unknown error.');
                    self.setState({
                        username: '',
                        password: '',
                        error: 'User not found.'
                    });
                    break;
                }
            }
        });
    }
})
module.exports = Login;
