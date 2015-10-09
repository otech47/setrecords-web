import React from 'react';
import MockSetTileImproved from './MockSetTileImproved';

var WizardStepConfirmation = React.createClass({
	render: function() {
		var setData = this.props;
		var priceData;
		if (setData.release_type == 'Beacon') {
			priceData = (
				<tr>
					<td><p>Price:</p></td>
					<td><p>${setData.price}</p></td>
				</tr>
			);
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
								<td><p>{setData.genre}</p></td>
							</tr>
							<tr>
								<td><p>Set Type:</p></td>
								<td><p>{setData.set_type}</p></td>
							</tr>
							<tr>
								<td><p>Release:</p></td>
								<td><p>{setData.release_type}</p></td>
							</tr>
							{priceData}
							<tr>
								<td><p>Release Points:</p></td>
								<td><p>{setData.outlets.join(', ')}</p></td>
							</tr>
						</tbody>
						</table>
					</div>
					<div className='flex-column flex-fixed'>
						<MockSetTileImproved {...this.props} matchImage={setData.match_url} />
					</div>
				</div>
				<button className='step-button' onClick={setData.uploadSet}>
					Upload
				</button>
			</div>
		);
	}
});

module.exports = WizardStepConfirmation;
