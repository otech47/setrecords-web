import React from 'react';
import NavBar from './NavBar';
import constants from '../constants/constants';

var Header = React.createClass({
	render: function() {
		return (
			<header className="flex-column">
				<div className="flex-fixed-2x header-main flex-row">
					<div className="logo flex-row">
						<img src="/public/images/setrecords.png" />
						setrecords
					</div>
					{this.showArtistOptions()}
				</div>
				<NavBar />
			</header>
		);
	},
	showArtistOptions: function () {
		if (this.props.appState) {
			var artistData = this.props.appState.get("artist_data");
			return (
				<div className="artist flex-row">
					<div className="options flex-column">
						<h1>{artistData.artist}</h1>
						<p>New Set | <span onClick={this.toggleSettingsEditor}>Settings</span> | Logout</p>
					</div>
					<img src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
				</div>
			);
		} else {
			return "";
		}
	},
	toggleSettingsEditor: function() {
		if (this.props.appState.get("settings_editor")) {
			this.props.closeSettingsEditor();
		} else {
			this.props.openSettingsEditor();
		}
	}
});

module.exports = Header;