var React = require('react');

var WizardStep5 = React.createClass({
    render: function() {
        var stepForward = this.props.stepForward;
        return (
        <div className="flex-column wizard-step">
            <p className='step-info set-flex'>How would you like to release this set?</p>
            <table className="step-button-text">
            <tbody>
                <tr>
                    <td><button name="beacon" className="step-button" onClick={stepForward.bind(null, {paid: 1, outlets: []})}>Beacon</button></td>
                    <td><p>Reward your most loyal fans with an exclusive offer at beacon locations.</p></td>
                </tr>
                <tr>
                    <td><button name="free" className="step-button" onClick={stepForward.bind(null, {paid: 0, outlets: ['Setmine']})}>Free</button></td>
                    <td><p>Immediately available to all your fans.</p></td>
                </tr>
            </tbody>
            </table>
        </div>
        );
    }
});

module.exports = WizardStep5;
