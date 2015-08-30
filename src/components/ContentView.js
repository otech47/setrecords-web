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
		var setTiles = [];
		var appState = this.props.appState;
		var artistData = appState.get("artistData");
		var sets = artistData.sets;
		sets.map(function(set, index) {
			setTiles.push(<SetTile key={set.id} set={set} />);
		});

		return (
			<div className="view">
				<div className="Grid Grid--1of3 Grid--gutters">
					{setTiles}
				</div>
			</div>
		);
	}
});

module.exports = ContentView;