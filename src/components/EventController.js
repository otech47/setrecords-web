var React = require('react')

var EventController = React.createClass({
    render: function() {
        return (
            <div className="tile-controls flex-row flex">
                <a href={this.props.ticketLink} className="set-flex flex click ticket-link tile-button">
                    <i className="fa fa-fw fa-ticket center"></i>
                </a>
                <div className="flex-3x flex-column event-info">
                    <div className="click center">{this.props.event.event}</div>
                    <div className="click center">{this.props.event.address}</div>
                </div>
                <div className="set-flex flex click event view-trigger tile-button">
                    <i className="fa fa-fw fa-long-arrow-right center"></i>
                </div>
            </div>
        );
    }
})

module.exports = EventController