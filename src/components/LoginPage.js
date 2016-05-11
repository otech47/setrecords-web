import React from 'react';
import {History} from 'react-router';

import CreateAccount from './CreateAccount';
import Icon from './Icon';
import auth from '../lib/auth';
import Base from './Base';
import reactLink from '../lib/reactLink';

export default class LoginPage extends Base {
    constructor(props) {
        super(props);
        this.autoBind('openNewArtistModal', 'submitLogin');

        this.state = {
            username: '',
            password: '',
            error: null,
            changePassword: false
        };
    }

    componentWillMount() {
        console.log('component will mount');

        auth.login()
            .then((artistId) => {
                this.props.push({
                    type: 'SHALLOW_MERGE',
                    data: {
                        artistId: artistId
                    }
                });
            })
            .catch((err) => {
                console.log('==err===');
                console.log(err);
            });
    }

    render() {
        var linkState = reactLink(this);
        return(
            <div id='Login' className='flex-column'>
                <video id='introvid' autoPlay='auto' loop='loop' muted>
                    <source src='/images/recordplayer_clipped.mp4' type='video/mp4'/>
                </video>
                <form onSubmit={this.submitLogin} className='flex-container'>
                    <div className='form center'>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>perm_identity</Icon>
                            <input type='text' placeholder='Username' value={this.state.username} onChange={linkState('username')} />
                        </div>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>lock_outline</Icon>
                            <input type='password' placeholder='Password' value={this.state.password} onChange={linkState('password')} />
                        </div>
                        <div className={'set-flex login-error ' + (this.state.error ? '' : 'hidden')}>
                            {this.state.error}
                        </div>
                        <button className='flex-container' onClick={this.submitLogin} disabled={(this.state.username.length > 0 && this.state.password.length > 0 ? false : true)}>Sign In</button>
                    </div>
                </form>

                <div id='CreateAccount'>
                    <h3>Don't have an account? <span className='create-link' onClick={this.openNewArtistModal}>Create one now</span></h3>
                </div>
            </div>
        );
    }

    openNewArtistModal(e) {
        e.preventDefault();
        mixpanel.track('Sign Up link clicked');

        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                newArtistModal: true
            }
        });
    }

    submitLogin(e) {
        e.preventDefault();
        // console.log('Submitting login with:');
        // console.log(this.state.username);
        // console.log(this.state.password);

        auth.login(this.state.username, this.state.password)
            .then((artistId) => {
                console.log('==artistId===');
                console.log(artistId);
                // mixpanel.track('Successfully logged in');
            })
            .catch((err) => {
                console.log('==err===');
                console.log(err);

                switch (err) {
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
                // mixpanel.track("Error", {
                //     "Page": "Login Page",
                //     "Message": err.responseJSON.error
                // });
            });
    }
}
