import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import React from 'react';

import auth from '../lib/auth';
import Base from './Base';
import reactLink from '../lib/reactLink';

export default class LoginPage extends Base {
    constructor(props) {
        super(props);
        this.autoBind('showArtistSignupModal', 'showForgotPasswordModal', 'submitLogin');

        this.state = {
            username: '',
            password: '',
            error: ''
        }
    }

    render() {
        var linkState = reactLink(this);

        return(
            <div id='LoginPage' className='column align-center justify-center'>
                <video autoPlay='auto' loop='loop' muted>
                    <source src='/images/recordplayer_clipped.mp4' type='video/mp4'/>
                </video>

                <div className='logo row align-center'>
                    <img src='/images/setrecords-logo-white.png' />
                    <h1>setrecords</h1>
                </div>

                <form className='login-form column align-stretch' onSubmit={this.submitLogin} >
                    <div className='login-fields column'>
                        <TextField floatingLabelStyle={styles.floatingLabel} inputStyle={styles.input} floatingLabelText='username' value={this.state.username} onChange={linkState('username')} />
                        <TextField floatingLabelStyle={styles.floatingLabel} inputStyle={styles.input} floatingLabelText='password' value={this.state.password} type='password' onChange={linkState('password')} />

                        <div className='login-error warning row justify-center'>
                            <h2>{this.state.error}</h2>
                        </div>
                    </div>

                    <div className='row login-buttons'>
                        <FlatButton onClick={this.showArtistSignupModal} labelStyle={styles.buttonText} style={styles.button} backgroundColor='#36D7B7' className='flex' label='Sign Up' />

                        <FlatButton type='submit' onClick={this.submitLogin} labelStyle={styles.buttonText} style={this.state.username.length == 0 || this.state.password.length == 0 ? styles.disabledButton : styles.button} backgroundColor='#22A7F0' className='flex' label='Log In' disabled={this.state.username.length == 0 || this.state.password.length == 0} />
                    </div>
                </form>

                <FlatButton onClick={this.showForgotPasswordModal} className='forgot-password' style={styles.button} backgroundColor='#9B59B6' label='Forgot Password?' />
            </div>
        );
    }

    showArtistSignupModal(e) {
        e.preventDefault();
        this.context.push({
            artistSignupModal: true
        });
    }

    showForgotPasswordModal(e) {
        e.preventDefault();
        this.context.push({
            forgotPasswordModal: true
        });
    }

    submitLogin(e) {
        e.preventDefault();
        this.context.push({
            loadingModal: {
                open: true,
                title: 'Logging In...'
            }
        });

        auth.login(this.state.username, this.state.password)
            .then((artistId) => {
                this.context.push({
                    artistId: artistId
                });
                this.context.router.push('/dashboard');
                this.context.push({
                    loadingModal: {
                        open: false
                    }
                });
                // mixpanel.track('Successfully logged in');
            })
            .catch((err) => {
                this.context.push({
                    loadingModal: {
                        open: false
                    }
                });
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
};

LoginPage.contextTypes = {
    artistId: React.PropTypes.number,
    push: React.PropTypes.func,
    router: React.PropTypes.object
};

const styles = {
    button: {
        color: 'white',
        height: '3rem',
        margin: '0.5rem'
    },

    buttonText: {
        fontSize: '1.25rem'
    },

    disabledButton: {
        backgroundColor: '#BDC3C7',
        height: '3rem',
        margin: '0.5rem'
    },

    floatingLabel: {
        color: 'white',
        fontSize: '1.25rem'
    },

    input: {
        color: 'white',
        fontSize: '1.5rem'
    }
};
