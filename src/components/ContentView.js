import React from 'react/addons';
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
		var sets = this.props.appState.get("artistData").sets;
		sets.map(function (set, index) {
			setTiles.push(<SetTile set={set} key={set.id} />);
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