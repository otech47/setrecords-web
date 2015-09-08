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
		var artistData = this.props.appState.get("artistData");
		var sets = artistData.sets;
		var setTiles = [];
		sets.map(function (set, index) {
			setTiles.push(<SetTile set={set} key={set.id} />)
		});

		return (
			<div className="content-page flex-row">
				<div className="flex-fixed-2x set-list">
					{setTiles}
				</div>
				<div className="flex-fixed-7x  set-editor">
					<SetEditor />
				</div>
			</div>
		);
	}
});

module.exports = ContentView;