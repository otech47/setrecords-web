import React from 'react';
import constants from '../constants/constants';

var Header = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	showArtistOptions: function () {
		var artistData = this.props.appState.get('artistData');
		var artistName = artistData.artist;
		return (
			<div className="flex-row artist">
				<div className="flex-column artist-options center">
					<span className="artist-name">{artistName}</span>
					<span>New Set  |  Impact  |  Logout</span>
				</div>
				<img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
			</div>
		);
	},
	render: function() {
		return (
			<header className="flex-row">
				<div className="flex-row logo">
					<img className="logo-icon center" src="/public/images/setrecords.png" />
					<span className="center logo-text">setrecords</span>
				</div>
				{this.showArtistOptions()}
			</header>
		);
	}
});

module.exports = Header;