import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import _ from 'underscore';
import BeaconMap from './BeaconMap';
import VenueListing from './VenueListing';

var WizardStep6 = React.createClass({

    mixins:[LinkedStateMixin],
    getInitialState: function() {
        return {
            lat: 26.054792,
            lng: -80.141472,
            query: '',
        }
    },

    render: function() {
        var {addOutlet, removeOutlet, outlets, venues, ...other} = this.props;
        var linkState = this.linkState;
        var venueListings = [];
        // console.log(outlets);

        var outletListings = _.map(outlets, (outlet, index) => {
            return (
                <VenueListing venue={outlet} isOutlet={true} toggleOutlet={removeOutlet.bind(null, index)} focusVenue={this.focusVenue.bind(null, outlet.latitude, outlet.longitude)} key={outlet.venue + 'outlet' + outlet.id} />
            );
        });

        var venueListings = _.chain(venues)
            .filter((venue) => {
                return !(_.findWhere(outlets, {venue: venue.venue}) || venue.venue.toLowerCase().indexOf(this.state.query.toLowerCase()) == -1);
            })
            .map((venue, index) => {
                return (
                    <VenueListing venue={venue} isOutlet={false} toggleOutlet={addOutlet.bind(null, venue.venue)} focusVenue={this.focusVenue.bind(null, venue.latitude, venue.longitude)} key={venue.venue + 'venue' + venue.id} />
                );
            })
            .value();

        return (
            <div className="flex-column wizard-step" id='WizardStep6'>
                <p className='step-info set-flex'>Add beacon locations you'd like to release to, and set the price for your unlock.</p>
                <BeaconMap lat={this.state.lat} lng={this.state.lng} venues={venues} />
                <h1>Beacon Locations:</h1>
                <input type='text' valueLink={linkState('query')} placeholder='Search venues...' />
                <div className='venue-search'>
                    {venueListings}
                </div>

                <h1>Locations Selected:</h1>
                <div className='venue-search'>
                    {outletListings}
                </div>

                <h1>Price</h1>
                <div className='flex-row price'>
                    <h2>$</h2>
                    <input type='text' valueLink={this.props.deepLinkState(['price'])} placeholder='price for unlock' />
                </div>

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
        if (!(format.test(this.props.price))) {
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
