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

    submit(e) {
        e.preventDefault();
        var email = this.refs.mail.value;
        var emailIsValid = this.validateEmail(email);
        if(emailIsValid) {
            var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/password/recover';
            $.ajax({
                type: 'post',
                url: requestUrl,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    email: email
                }
            })
            .done( (res) => {
                mixpanel.track('Password recovery email sent');
                this.setState({
                    email: true,
                    value: 'Reset email sent.'
                });
                setTimeout(() => {
                    if (this.isMounted) {
                        this.setState(this.getInitialState());
                    }
                }, 3000);
            })
            .fail( (err) => {
                mixpanel.track("Error", {
                    "Page": "Forgot Password",
                    "Message": "Error sending password recovery email"
                });
                alert('Sorry, we couldn\'t find an account with that email. Please try a different email.');
            });
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
                        <Icon onClick={this.submit}>{this.state.icon}</Icon>
                    </div>
            </div>
        );
    }

});

module.exports = ForgotPassword;
