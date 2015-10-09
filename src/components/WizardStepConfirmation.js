import React from 'react';
import MockSetTileImproved from './MockSetTileImproved';

var WizardStepConfirmation = React.createClass({
	render: function() {
		var priceData = '';
		if (this.props.release_type == 'Beacon') {
			priceData = (
				<tr>
					<td><p>Price:</p></td>
					<td><p>${this.props.price}</p></td>
				</tr>
			);
		}
		var mockImage = null;
		if (this.props.image) {
			mockImage = this.props.image.preview;
		}
		if (this.props.match_url) {
			mockImage = this.props.match_url;
		}
		var artists = this.props.originalArtist;
		if (this.props.featured_artists.length > 0) {
			artists += ' feat. ' + this.props.featured_artists.join(', ');
		}
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Confirm your set information is correct, then click Upload.</p>
				<div className='flex-row'>
					<div className='flex-column flex-fixed'>
						<table className="step-button-text">
						<tbody>
							<tr>
								<td><p>Genre:</p></td>
								<td><p>{this.props.genre}</p></td>
							</tr>
							<tr>
								<td><p>Set Type:</p></td>
								<td><p>{this.props.set_type}</p></td>
							</tr>
							<tr>
								<td><p>Release:</p></td>
								<td><p>{this.props.release_type}</p></td>
							</tr>
							{priceData}
							<tr>
								<td><p>Release Points:</p></td>
								<td><p>{this.props.outlets.join(', ')}</p></td>
							</tr>
						</tbody>
						</table>
					</div>
					<div className='flex-column flex-fixed'>
						<MockSetTileImproved image={mockImage} artist={artists} name={this.props.name} episode={this.props.set_type == 'Mix' ? this.props.episode : ''} setLength={this.props.set_length} popularity={0} />
					</div>
				</div>
				<button className='step-button' onClick={this.props.uploadSet}>
					Upload
				</button>
			</div>
		);
	}
});

module.exports = WizardStepConfirmation;
