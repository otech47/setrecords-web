import React from 'react';
import TracklistImproved from './TracklistImproved';
import Tracklist from './Tracklist';
import _ from 'underscore';
import moment from 'moment';
import UtilityFunctions from '../mixins/UtilityFunctions';

var WizardStep3 = React.createClass({

    mixins: [UtilityFunctions],
    render: function() {
        return (
            <div className='flex-column wizard-step' id='WizardStep3'>
                <p className='step-info flex-container'>Create the tracklist for your set. We'll automatically generate the tracks from any 1001tracklists URL.</p>
                <p className='step-info flex-container'>(This step is optional and can be done at any time)</p>
                <Tracklist {...this.props} />
                <button className='step-button' onClick={this.submitStep}>Continue</button>
            </div>
        );
    },

    submitStep: function(event) {
        var emptyErr = false;
        var timeOrderErr = false;
        var timeFormatErr = false;
        var finalTimeErr = false;
        var errors = [];
        
        var tracklist = this.props.tracklist;
        if (tracklist.length > 0) {
            var prevTime = -1;
            for (var i = 0; i < tracklist.length; i++) {
                if (emptyErr && timeOrderErr & timeFormatErr) {
                    break;
                }
                var track = tracklist[i];
                if (!emptyErr) {
                    if (
                        _.some(track, function(value, key) {
                            return value == '';
                        })
                    ) {
                        emptyErr = true;
                        errors.push(['Fields cannot be empty.']);
                    }
                }
                if (!timeOrderErr) {
                    var current = this.timeStringToSeconds(track.starttime);
                    if (current > prevTime) {
                        prevTime = current;
                    } else {
                        timeOrderErr = true;
                        errors.push(['Start times should be in ascending order.'])
                    }
                }
                if (!timeFormatErr) {
                    var format = /^\d+[:]\d{2}$/;
                    if (!format.test(track.starttime)) {
                        timeFormatErr = true;
                        errors.push(['Start times should be in the format "MM:SS".'])
                    }
                }
            }

            var lastTime = _.last(tracklist).starttime;
            if (this.timeStringToSeconds(lastTime) > this.props.setLength) {
                finalTimeErr = true;
                errors.push(['The last start time is after the length of your set.']);
            }
        }

        if (errors.length == 0) {
            this.props.stepForward();
        } else {
            alert('Please correct the following errors:\n' + errors.join('\n'));
        }
    }
});

module.exports = WizardStep3;
