var React = require('react')

var EventDate = React.createClass({
    render: function () {
    	var month = moment(this.props.event.start_date).format('MMM')
    	var day = moment(this.props.event.start_date).format('D')

        return (
        	<div className="event-date-container flex-5x flex-column">
		        <div className="month">{month}</div>
		        <div className="divider"></div>
		        <div className="day">{day}</div>
		    </div>
        );
    }
})

module.exports = EventDate