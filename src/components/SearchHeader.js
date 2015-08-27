var React = require('react');

var SearchHeader = React.createClass({

	render: function() {
		return (
			<div className="flex-column view-title-container flex-row">
                <div className="center view-title">{this.state.title}</div>
                <div className="divider"></div>
            </div>
		);
	}

});

module.exports = SearchHeader;