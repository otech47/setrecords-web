import React from 'react/addons';


var SetEditor = React.createClass({
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div className="set-editor">
				edit set info here
			</div>
		);
	}
});

module.exports = SetEditor;