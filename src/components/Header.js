import React from 'react';
import {Navigation, Link} from 'react-router';
import LoginButton from'./LoginButton';

var Header = React.createClass({
	mixins: [Navigation],
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	showArtistOptions: function (loggedIn) {
		if (loggedIn) {
			return (
				<div className="flex-row artist">
					<div className="flex-column artist-options center">
						<span className="artist-name">DJ Quinn Harley</span>
						<span>Logout</span>
					</div>
					<img className="artist-image" src="/public/images/userImage.jpg" />
				</div>
			);
		}
		else {
			return "";
		}
	},
	render: function() {
		var appState = this.props.appState;
		return (
			<header className="flex-row">
				<div className="flex-row logo">
					<img className="logo-icon center" src="/public/images/setrecords.png" />
					<span className="center logo-text">setrecords</span>
				</div>
				{this.showArtistOptions(appState.get('loggedIn'))}
			</header>
		);
	}
});

module.exports = Header;