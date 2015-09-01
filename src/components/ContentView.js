import React from 'react/addons';
import SetTile from './SetTile';
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


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
		var artistData = appState.get('artistData');
		var sets = artistData.sets;
		sets.map(function(set, index) {
			setTiles.push(<SetTile key={set.id} set={set} />);
			console.log(set.id);
		});
		return (
			<div className="view">
				<div className="flex-row content-container">
					{setTiles}
				</div>
			</div>
		);
	}
});

module.exports = ContentView;