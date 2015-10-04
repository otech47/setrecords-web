import React from 'react';

var WizardStepConfirmation = React.createClass({
	render: function() {
		var setData = this.props.setData;
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Confirm your set information is correct, then click Upload.</p>
				<table className="step-button-text">
				<tbody>
					{this.showName()}
					{this.showEpisode()}
					<tr>
						<td><p>Genre:</p></td>
						<td><p>{setData.genre}</p></td>
					</tr>
					{this.showReleasePoints()}
				</tbody>
				</table>
				<button className='step-button' onClick={this.props.uploadSet}>
					Upload
				</button>
			</div>
		);
	},

	showName: function() {
		var setData = this.props.setData;
		if (setData.type == 'festival') {
			return (
				<tr>
					<td><p>Event:</p></td>
					<td><p>{setData.event_name}</p></td>
				</tr>
			);
		} else if (setData.type == 'mix') {
			return (
				<tr>
					<td><p>Mix:</p></td>
					<td><p>{setData.mix_name}</p></td>
				</tr>
			);
		} else {
			return (
				<tr>
					<td><p>Album:</p></td>
					<td><p>{setData.album_name}</p></td>
				</tr>
			);
		}
	},

	showEpisode: function() {
		var setData = this.props.setData;
		if (setData.episode_name) {
			return (
				<tr>
					<td><p>Episode:</p></td>
					<td><p>{setData.episode_name}</p></td>
				</tr>
			);
		} else {
			return '';
		}
	},

	showReleasePoints: function() {
		var setData = this.props.setData;
		return (
			<tr>
				<td><p>Release Points:</p></td>
				<td><p>{'Setmine' + (setData.soundcloud ? ', Soundcloud': '')}</p></td>
			</tr>
		);
	}
});

module.exports = WizardStepConfirmation;
