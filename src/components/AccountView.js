import React from 'react/addons';

var AccountView = React.createClass({
	displayName: 'AccountView',
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div>
				You are now looking at account view
			</div>
		);
	}
});

module.exports = AccountView;