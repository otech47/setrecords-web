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
			var artistData = this.props.appState.get('artistData');
			return (
				<div className="flex-row artistOptions">
					<div className="flex-column center">
						<span className="artistName bottom">{artistData.artist}</span>
						<span className="bottom">New Set | My Impact | Logout</span>
					</div>
					<img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
				</div>
			);
		} else {
			return "";
		}
	},
	render: function() {
		return (
			<header className="flex-row">
				<div className="flex-row logo center">
					<img className="center" src="/public/images/setrecords.png" />
					<span className="center">setrecords</span>
				</div>
				{this.showArtistOptions()}
			</header>
		);
	}
});

module.exports = Header;