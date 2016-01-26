import React from 'react';

var WizardStep1 = React.createClass({
    render: function() {
        var stepForward = this.props.stepForward;
        return (
            <div className="flex-column wizard-step" id='WizardStep1'>
                <p>What kind of set is this?</p>
                <table>
                    <tbody>
                        <tr>
                            <td><button name="festival" className="step-button" onClick={stepForward.bind(null, {'type': 'festival'})}>Festival</button></td>
                            <td><p>From a live festival.</p></td>
                        </tr>
                        <tr>
                            <td><button name="show" className="step-button" onClick={stepForward.bind(null, {'type': 'show'})}>Show</button></td>
                            <td><p>From a live, standalone show.</p></td>
                        </tr>
                        <tr>
                            <td><button name="mix" className="step-button" onClick={stepForward.bind(null, {'type': 'mix'})}>Mix</button></td>
                            <td><p>A set mixed in a studio, featuring samples from other artists (e.g., a radio show).</p></td>
                        </tr>
                        <tr>
                            <td><button name="album" className="step-button" onClick={stepForward.bind(null, {'type': 'album'})}>Album</button></td>
                            <td><p>An official, original release.</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = WizardStep1;
