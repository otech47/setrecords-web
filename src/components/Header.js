import React from 'react';
import {Navigation, Link} from 'react-router';
import constants from '../constants/constants';

var Header = React.createClass({
	mixins: [Navigation],
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	showArtistOptions: function (loggedIn) {
		var artistData = this.props.appState.get('artistData');
		var artistName = artistData.artist;
		console.log(artistName);

		if (loggedIn) {
			return (
				<div className="flex-row artist">
					<div className="flex-column artist-options center">
						<span className="artist-name">{artistName}</span>
						<span>Logout</span>
					</div>
					<img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
				</div>
			);
		}
		else {
			return "";
		}
	},
	render: function() {
		var loggedIn = this.props.appState.get('loggedIn');
		return (
			<header className="flex-row">
				<div className="flex-row logo">
					<img className="logo-icon center" src="/public/images/setrecords.png" />
					<span className="center logo-text">setrecords</span>
				</div>
				{this.showArtistOptions(loggedIn)}
			</header>
		);
	}
});

module.exports = Header;