import React from 'react';

var Contact = React.createClass({

    componentWillMount() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Contact'
            }
        });
    },

    render() {
        return (
            <div id='Contact' className='column'>
                <div>
                    <h2>Have a question?</h2>
                    <p>Send an email to artists@setmine.com with any questions, problems or concerns, and we'll get back to you promptly.</p>
                </div>
            </div>
        );
    }

});

module.exports = Contact;
