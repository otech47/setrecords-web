import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import TextField from 'material-ui/TextField';
import validator from 'validator';

import Base from './Base';
import reactLink from '../lib/reactLink';

export default class ForgotPasswordModal extends Base {
    constructor(props) {
        super(props);
        this.autoBind('closeModal');

        this.state = {
            email: ''
        };
    }

    render() {
        var linkState = reactLink(this);
        var validEmail = validator.isEmail(this.state.email);
        console.log(!validEmail);

        var actions = [
            <FlatButton onClick={this.closeModal} labelStyle={styles.buttonText} style={styles.button} backgroundColor='#BDC3C7' label='Cancel' />,
            <FlatButton type='submit' onClick={this.submitPasswordRecovery} labelStyle={styles.buttonText} style={this.state.email.length == 0 || !validEmail ? styles.disabledButton : styles.button} backgroundColor='#22A7F0' label='Submit' disabled={this.state.email.length == 0 || !validEmail} />
        ];

        return (
            <Dialog title='Password Recovery' open={true} contentStyle={{width: '50%'}} bodyStyle={{textAlign: 'center'}} actions={actions} >
                <h2>Enter your email address below to receive a password reset link.</h2>

                <TextField fullWidth={true} floatingLabelStyle={styles.floatingLabel} inputStyle={styles.input} floatingLabelText='email address' value={this.state.email} type='email' onChange={linkState('email')} />
            </Dialog>
        )
    }

    closeModal(e) {
        e.preventDefault();
        this.context.push({
            modal: null
        });
    }

    submitPasswordRecovery(e) {
        e.preventDefault();
    }
};

ForgotPasswordModal.contextTypes = {
    push: React.PropTypes.func
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
        color: '#22a7f0',
        fontSize: '1.25rem'
    },

    input: {
        color: 'black',
        fontSize: '1.5rem'
    }
}
