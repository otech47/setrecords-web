import React from 'react/addons';
import SetTile from './SetTile';


var SetList = React.createClass({
	_attachStreams: function() {
		var _this = this;
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		var sets = this.props.sets;
		var setTiles = [];
		sets.map(function (set, index) {
			setTiles.push(<SetTile set={set} key={set.id} />)
		});

		return (
			<div>
				{setTiles}
			</div>
		);
	}
});

module.exports = SetList;