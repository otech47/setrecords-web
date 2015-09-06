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
		if (this.props.appState) {
			var artistData = this.props.appState.get("artistData");
			return (
				<div className="header-artist flex-row">
					<div className="flex-column">
						<h1>{artistData.artist}</h1>
						<p>New Set | Logout</p>
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
			<header className="flex-row">
				<div className="logo flex-row">
					<img src="/public/images/setrecords.png" />
					<p>setrecords</p>
				</div>
				{this.showArtistOptions()}
			</header>
		);
	}
});

module.exports = Header;