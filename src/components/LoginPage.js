import React from 'react';
import {History} from 'react-router';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import Icon from './Icon';
import auth from './auth';

module.exports = React.createClass ({

    mixins: [LinkedStateMixin, History],

    componentWillMount: function() {
        auth.loggedIn((artistId) => {
            if (artistId) {
                this.history.replaceState(null, '/dashboard');
            }
        });
    },

    getInitialState: function() {
        return {
            username: '',
            password: '',
            error: null,
            changePassword: false
        }
    },

    render: function () {
        var password = this.state.changePassword ? <ForgotPassword /> : <p onClick={() => this.setState({changePassword: true})}>Forgot password?</p>
        return(
            <div id='Login' className='flex-column'>
                <video id='introvid' autoPlay='auto' loop='loop' muted>
                    <source src='/images/recordplayer_clipped.mp4' type='video/mp4'/>
                </video>
                <form onSubmit={this.submitLogin} className='flex-container'>
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
                </form>

                <div id='CreateAccount'>
                    <h3>Don't have an account? <span onClick={this.openNewArtistModal}>Create one now</span></h3>
                </div>
            </div>
        );
    },

    openNewArtistModal: function(e) {
        e.preventDefault();
        mixpanel.track('Sign Up link clicked');

        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                newArtistModal: true
            }
        });
    },

    submitLogin: function(e) {
        e.preventDefault();
        // console.log('Submitting login with:');
        // console.log(this.state.username);
        // console.log(this.state.password);

        this.props.submitLogIn(this.state.username, this.state.password, (err) => {
            // console.log('Errors?');
            // console.log(err);

            if (err) {
                switch (err.responseJSON.error) {
                    case 'User not found':
                    // console.log('Username was incorrect.');
                    this.setState({
                        username: '',
                        password: '',
                        error: 'User not found.'
                    });
                    break;

                    case 'Incorrect Password':
                    // console.log('Password was incorrect.');
                    this.setState({
                        password: '',
                        error: 'Incorrect password.'
                    });
                    break;

                    default:
                    // console.log('Unknown error.');
                    this.setState({
                        username: '',
                        password: '',
                        error: 'User not found.'
                    });
                    break;
                }
                mixpanel.track("Error", {
                    "Page": "Login Page",
                    "Message": err.responseJSON.error
                });
            } else {
                mixpanel.track('Successfully logged in');
                this.history.pushState(null, '/dashboard');
            }
        });
    },
});
