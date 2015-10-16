var React = require('react');
import _ from 'underscore';
import BeaconMap from './BeaconMap';
import VenueListing from './VenueListing';

var WizardStep6 = React.createClass({
	getInitialState: function() {
		return {
			lat: 26.054792,
			lng: -80.141472,
			query: ''
		}
	},
	render: function() {
		var {venues, toggleOutlet, outlets, ...other} = this.props;
		var linkState = this.linkState;
		var venueListings = [];
		var outletListings = [];
		var self = this;
		_.each(venues, function(venue, index) {
			if (outlets.indexOf(venue.venue) >= 0) {
				outletListings.push(
					<VenueListing venue={venue} isOutlet={true} toggleOutlet={toggleOutlet.bind(null, venue.venue)} key={venue.venue + '_' + venue.id} />
				);
			} else if ((venue.venue.toLowerCase()).indexOf(self.state.query.toLowerCase()) == -1) {
				return;
			} else {
				venueListings.push(
					<VenueListing venue={venue} isOutlet={false} toggleOutlet={toggleOutlet.bind(null, venue.venue)} key={venue.venue + '_' + venue.id} />
				);
			}
		});

		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Add beacon locations you'd like to release to, and set the price for your unlock.</p>
				<BeaconMap lat={this.state.lat} lng={this.state.lng} venues={venues} />
				<h1>Beacon Locations:</h1>
				<input type='text' valueLink={linkState('query')} placeholder='Search venues...' />
				<div className='flex-column venue-search'>
					{venueListings}
				</div>

				<h1>Locations Selected:</h1>
				<div className='flex-column venue-search'>
					{outletListings}
				</div>
				<span>$<input type='text' valueLink={this.props.linkState('price')} placeholder='price for unlock' /></span>
				<button className='step-button' onClick={this.submitStep}>
					Finish
				</button>
			</div>
		);
	},

	focusVenue: function(lat, lng) {
		this.setState({
			lat: lat,
			lng: lng
		});
	},
	submitStep: function(event) {
		var errors = [];
		if (this.props.outlets.length == 0) {
			errors.push('You must select at least one outlet.');
		}
		var format = /^\d*\.\d{2}$/;
		if (!(format.test(this.props.linkState('price').value))) {
			errors.push('Your price should be in the format \'#.##\'');
		}
		if (errors.length > 0) {
			alert("Please correct the following errors, then click Continue:\n" + errors.join('\n'));
		} else {
			this.props.stepForward();
		}
	}
});

module.exports = WizardStep6;
