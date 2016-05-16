import _ from 'lodash';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import validator from 'validator';

import api from '../lib/api';
import Base from './Base';
import reactLink from '../lib/reactLink';

export default class ArtistSignupModal extends Base {
    constructor(props) {
        super(props);
        this.autoBind('createNewAccount', 'handleClose', 'validateFields');

        this.state = defaultState;
    }

    render() {
        var linkState = reactLink(this);

        const actions = [
            <FlatButton label="Cancel" secondary={true} onClick={this.handleClose} />,
            <FlatButton label="Create" primary={true} onClick={this.createNewAccount} disabled={!this.validateFields()} />
        ];

        var validationErrors = [];
        if ((this.state.password.length > 0 || this.state.confirmPassword.length > 0) && (this.state.password != this.state.confirmPassword)) {
            validationErrors.push('Password fields should match.');
        }



        return (
            <div id='NewArtistModal'>
                <Dialog title='New Artist Account' open={!!this.props.modal} actions={actions} modal={false} onRequestClose={this.handleClose} autoScrollBodyContent={true} >
                    <h3 className='warning'>{this.state.error}</h3>
                    <div className='row justify-space-around'>
                        <div className='column'>
                            <TextField value={this.state.artistName} floatingLabelText='Artist Name' onChange={linkState('artistName')} />

                            <TextField value={this.state.username} floatingLabelText='Desired Username' onChange={linkState('username')} />

                            <TextField type='email' floatingLabelText='Email Address' value={this.state.email} onChange={linkState('email')} />
                        </div>

                        <div className='column'>
                            <TextField type='password' value={this.state.password} floatingLabelText='Password' onChange={linkState('password')} />

                            <TextField type='password' floatingLabelText='Confirm Password' value={this.state.confirmPassword} onChange={linkState('confirmPassword')} />

                            <div>
                                {
                                    _.map(validationErrors, (error, index) => {
                                        return (<h3 className='warning' key={index}>{error}</h3>)
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }

    createNewAccount() {
        this.context.push({
            artistSignupModal: false,
            loadingModal: {
                open: true,
                title: 'Creating Account...'
            }
        });

        var queryString = `mutation NewUser {createNewSetrecordsUser(username: \"${this.state.username}\", email: \"${this.state.email}\", password: \"${this.state.password}\", artist_name: \"${this.state.artistName}\")}`;

        api.graph({query: queryString})
            .then((res) => {
                this.context.push({
                    infoModal: {
                        open: true,
                        title: '',
                        message: 'Your new account is ready to be used. Please log in with the credentials you provided.'
                    },
                    loadingModal: {
                        open: false
                    }
                });
                this.setState(defaultState);
            })
            .catch((err) => {
                console.log('==err==');
                console.log(err);

                var errorMessage = err.responseJSON.error[0].message;
                switch(errorMessage) {
                    case 'Artist name is taken.':
                    this.setState({
                        error: 'Sorry, that artist name is taken.'
                    });
                    break;

                    case 'Username is taken.':
                    this.setState({
                        error: 'Sorry, that username is taken.'
                    });
                    break;

                    case 'Email is taken.':
                    this.setState({
                        error: 'Sorry, that email is already in use.'
                    });
                    break;

                    default:
                    this.setState({
                        error: 'An error occurred, please try again.'
                    });
                    break;
                }

                this.context.push({
                    loadingModal: {
                        open: false
                    },
                    artistSignupModal: true
                });
            });
    }

    handleClose() {
        this.setState(defaultState);

        this.context.push({
            artistSignupModal: false
        });
    }

    validateFields() {
        return (this.state.username.length > 0 &&
            validator.isEmail(this.state.email) &&
            this.state.artistName.length > 0 &&
            this.state.password.length > 0 &&
            this.state.confirmPassword.length > 0 &&
            (this.state.password == this.state.confirmPassword)
        );
    }
}

ArtistSignupModal.contextTypes = {
    push: React.PropTypes.func
};

var defaultState = {
    error: null,
    username: '',
    password: '',
    confirmPassword: '',
    artistName: '',
    email: ''
}
