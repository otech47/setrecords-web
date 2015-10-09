var React = require('react/addons');

var VenueListing = React.createClass({
	render: function() {
		var venue = this.props.venue;
		return (
			<div className="flex-row venue-listing">
				<div className='flex-column flex venue-info' onClick={this.props.focusVenue}>
					<h1>{venue.venue}</h1>
					<p>{venue.address}</p>
				</div>
				<div className='venue-add set-flex' onClick={this.props.toggleOutlet}>
					<i className={'fa ' + (this.props.isOutlet ? 'fa-times warning' : 'fa-plus approved')}></i>
				</div>
			</div>
		);
	}
});

module.exports = VenueListing;
