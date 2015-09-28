import React from 'react';
import NavBar from './NavBar';
import constants from '../constants/constants';

var Header = React.createClass({
	showArtistOptions: function () {
		if (this.props.appState) {
			var artistData = this.props.appState.get("artist_data");
			return (
				<div className="artist flex-row">
					<div className="options flex-column">
						<h1>{artistData.artist}</h1>
						<p>New Set | Settings | Logout</p>
					</div>
					<img src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
				</div>
			);
		} else {
			return "";
		}
	},
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
	}
});

module.exports = Header;