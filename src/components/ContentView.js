import React from 'react';
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
		var tiles = [];
		var artistData = this.props.appState.get("artistData");
		var sets = artistData.sets;
		sets.map(function(set, index) {
			tiles.push(<SetTile />);
		});

		return (
			<div className="content-container view">

			</div>
		);
	}
});

module.exports = ContentView;