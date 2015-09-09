import React from 'react/addons';
import SetEditor from './SetEditor';
import SetTile from './SetTile';


var ContentView = React.createClass({
	displayName: 'ContentView',
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div className="content-page">
				it's the content page!
			</div>
		);
	}
});

module.exports = ContentView;