import Base from './Base';
import React from 'react';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import reactLink from '../lib/reactLink';

export default class NewArtistModal extends Base {
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

        var confirmPasswordIcon;
        if (this.state.password.length > 0 || this.state.confirmPassword.length > 0) {
            confirmPasswordIcon = (this.state.password == this.state.confirmPassword ?
                <i className='fa fa-check approved' />
                :
                <i className='fa fa-times warning' />);
        }

        return (
            <div id='NewArtistModal'>
                <Dialog title='New Artist Account' open={this.props.open} actions={actions} modal={false} onRequestClose={this.handleClose} >
                    <h3 className='warning'>{this.state.error}</h3>
                    <div className='flex-column'>
                        <h4>Artist Name</h4>
                        <input type='text' valueLink={linkState('artistName')} />
                        <h4>Desired Username</h4>
                        <input type='text' valueLink={linkState('username')} />
                        <h4>Password</h4>
                        <input type='password' valueLink={linkState('password')} />
                        <h4>Confirm Password {confirmPasswordIcon}</h4>
                        <input type='password' valueLink={linkState('confirmPassword')} />
                        <h4>Email Address</h4>
                        <input type='text' valueLink={linkState('email')} />
                    </div>
                </Dialog>
            </div>
        )
    }

    createNewAccount() {
        var requestUrl = 'https://api.setmine.com/v/10/graphql';

        var query = `mutation NewUser {createNewSetrecordsUser(username: \"${this.state.username}\", email: \"${this.state.email}\", password: \"${this.state.password}\", artist_name: \"${this.state.artistName}\")}`;

        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                newArtistModal: false,
                loadingModal: true
            }
        });

        $.ajax({
            type: 'POST',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                query: query
            }
        })
        .done((res) => {
            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loadingModal: false,
                    messageModal: 'Your new account is ready to be used. Please log in with the credentials you provided.'
                }
            });

            this.handleClose();
        })
        .fail((err) => {
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

            this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    loadingModal: false,
                    newArtistModal: true
                }
            });
        });
    }

    handleClose() {
        this.setState(defaultState);

        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                newArtistModal: false
            }
        });
    }

    validateFields() {
        return (this.state.username.length > 0 &&
            require('validator').isEmail(this.state.email) &&
            this.state.artistName.length > 0 &&
            this.state.password.length > 0 &&
            this.state.confirmPassword.length > 0 &&
            (this.state.password == this.state.confirmPassword)
        );
    }
}

var defaultState = {
    error: null,
    username: '',
    password: '',
    confirmPassword: '',
    artistName: '',
    email: ''
}
