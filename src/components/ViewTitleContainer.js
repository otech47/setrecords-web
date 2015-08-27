var React = require('react')

var ViewTitleContainer = React.createClass({
	render: function() {
		return (
			<div className="flex-column view-title-container flex-zero">
                <div className="center view-title">{this.props.title}</div>
                <div className="divider"></div>
            </div>
		);
	}
});

module.exports = ViewTitleContainer