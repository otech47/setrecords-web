import React from 'react';

var CreateAccount = React.createClass({
    render: function() {
        return (
            <div id='CreateAccount' className='flex-column center'>
                Don't have an account?

                <button onClick={console.log('Hey')}>Sign Up</button>
            </div>
        );
    }
});

module.exports = CreateAccount;
