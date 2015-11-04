var React = require('react');
import _ from 'underscore';
var constants = require('../constants/constants');

var BeaconMap = React.createClass({
    componentDidMount: function() {
        $(document).on('click', '.venue-info', (function(event) {
            event.stopPropagation();
            this.lastLat = null;
            this.lastLng = null;
            this.componentDidUpdate();
        }).bind(this))
        this.componentDidUpdate();
    },

    componentDidUpdate: function() {
        if (this.lastLat == this.props.lat && this.lastLng == this.props.lng) {
            return;
        }
        this.lastLat = this.props.lat;
        this.lastLng = this.props.lng;

        var self = this;
        var map = new GMaps({
            el: '#map',
            lat: this.props.lat,
            zoom: 16,
            lng: this.props.lng
        });

        map.addControl({
            position: 'top_right',
            content: 'My Location',
            style: {
                margin: '5px',
                padding: '1px 6px',
                border: 'solid 1px #717B87',
                background: '#fff'
            },
            events: {
                click: function() {
                    self.geolocate(function(err, pos) {
                        if (err) {
                            alert('Geolocation is not available at this time: ' + err);
                        } else {
                            map.setCenter(pos.coords.latitude, pos.coords.longitude);
                            map.setZoom(16);
                        }
                    });
                }
            }
        });

        var outlets = this.props.outlets;

        _.each(this.props.venues, function(venue, index) {
            var socialLinks = '';
            if (venue.web_link) {
                socialLinks += '<p><a href=\''+venue.web_link+'\' target=\'_blank\'>Web Link</a></p>';
            }
            map.addMarker({
                lat: venue.latitude,
                lng: venue.longitude,
                infoWindow: {
                 content: `
				    	<h1>${venue.venue}</h1>
				    	<p>${venue.address}</p>
				    `,
                  disableAutoPan: false
                }
            });
        });
    },

    // <img style='height: 8rem; width:8rem; margin:auto;' src='${constants.S3_ROOT_FOR_IMAGES + venue.imageURL}' />

	render: function() {
		return (
			<div id='map'></div>
		);
	},

    geolocate(callback) {
        GMaps.geolocate({
            success: function(pos) {
                callback(null, pos);
            },
            error: function(err) {
                callback(err);
            },
            not_supported: function() {
                alert('Your browser does not support geolocation.');
                callback('not supported');
            }
        });
    }
});

module.exports = BeaconMap;
