var React = require('react');

var LandingHome = require('./LandingHome');
var LandingApp = require('./LandingApp');
var LandingBeacon = require('./LandingBeacon');

var LandingView = React.createClass({
	render: function() {
		return (
			<div id="landing" className="flex-column view flex">
				<LandingHome />
				<LandingApp />
				<LandingBeacon />
			</div>
		);
	}

});

module.exports = LandingView;
