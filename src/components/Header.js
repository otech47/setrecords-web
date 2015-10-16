import React from 'react';
import constants from '../constants/constants';

var Header = React.createClass({

	render() {
		console.log(document.location.pathname);
		return (
			<header className='flex-column'>
				<div className='flex-fixed-2x header-main flex-row'>
					<div className='logo flex-row'>
						<img src='/public/images/setrecords-logo-white.png' />
						setrecords
					</div>
					<h1>{'METRICS'}</h1>
					<div className='buffer'/>
					{this.showArtistOptions()}
				</div>
			</header>
		);
	},

	showArtistOptions() {
		if (this.props.appState) {
			var artistData = this.props.appState.get('artist_data');
			return (
				<div className='artist flex-row'>
					<div className='options flex-column'>
						<h1>{artistData.artist}</h1>
						<p className=''><span onClick={this.props.openUploadSetWizard} >New Set</span> | <span onClick={this.toggleSettingsEditor}>Settings</span> | Logout</p>
					</div>
					<img src={constants.S3_ROOT_FOR_IMAGES + artistData.imageURL} />
				</div>
			);
		} else {
			return '';
		}
	},

	toggleSettingsEditor() {
		if (this.props.appState.get('settings_editor')) {
			this.props.closeSettingsEditor();
		} else {
			this.props.openSettingsEditor();
		}
	}
});

module.exports = Header;