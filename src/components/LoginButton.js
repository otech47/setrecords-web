var React = require('react');

var LoginButton = React.createClass({

	render: function() {
		var text = 'Login';
		return (
			// <div className="nav-button click center login" id="login">{loginAction}</div>
			<div className="nav-button click center login" id="login">{text}</div>
		);
	}

});

module.exports = LoginButton;