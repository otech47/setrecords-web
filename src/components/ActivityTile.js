var React = require('react');

var ActivityTile = React.createClass({
	render: function() {
		return (
			<div>
				<div className="activity-tile flex-column overlay-container" style={{background: "url('" + S3_ROOT_FOR_IMAGES + this.props.activity.imageURL + "')"}}>
				<div className="activity-tile flex-column overlay-container">
				    <div className="overlay"></div>
				    <div className="flex-row flex-3x">
				        <i className="fa fa-fw fa-random center click"></i>
				        <i className="fa fa-4x center"></i>
				        <i className="fa fa-fw fa-bars center click"></i>
				    </div>
				    <div className="set-flex flex actvity-name center">{this.props.activity.activity}</div>
				</div>
			</div>
		);
	}
});

module.exports = ActivityTile;