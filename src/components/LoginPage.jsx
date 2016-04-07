import React from 'react';

import Base from './Base';
import ForgotPassword from './ForgotPassword';
import reactLink from '../lib/reactLink';

export default class LoginPage extends Base {
    constructor(props) {
        super(props);
        this.autoBind('logIn', 'signUp');

        this.state = {
            email: '',
            password: ''
        };
    }

    render() {
        var linkState = reactLink(this);
        console.log(this.context.userId);

        return (
            <div id='LoginPage' className='flex column justify-center align-center'>
                <video autoPlay='auto' loop='loop' muted>
                    <source src='/images/recordplayer_clipped.mp4' type='video/mp4'/>
                </video>

                <div className='login-body'>
                    <div className='logo row align-center justify-center flex-2x'>
                        <img src='/images/setrecords-logo-white.png' />
                        <h1>setrecords</h1>
                    </div>

                    <div className='login-form column flex-3x'>
                        <h3>Email</h3>
                        <input type='text' valueLink={linkState('email')} />

                        <h3>Password</h3>
                        <input type='password' valueLink={linkState('password')} />

                        <div className='row login-buttons'>
                            <button className='flex sign-up' type='button' onClick={this.signUp}>
                                Sign Up
                            </button>
                            <button className='flex log-in' onClick={this.logIn}>
                                Log In
                            </button>
                        </div>
                    </div>

                    <div className='flex row justify-center'>
                        <ForgotPassword />
                    </div>
                </div>
            </div>
        )
    }

    logIn() {
        console.log('log in');
    }

    signUp() {
        console.log('sign up');
    }
}

LoginPage.contextTypes = {
    push: React.PropTypes.func,
    userId: React.PropTypes.number
}
