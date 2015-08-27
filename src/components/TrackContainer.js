import React from 'react';
import TrackTile from './TrackTile';

var TrackContainer = React.createClass({

	render: function() {
		var data = this.props.data;
		var tiles = data.map(function(set) {
			return(<TrackTile data={set} key={set.id}/>)
		});
		return (
			<div className='results-container flex-row flex'>
				{tiles}
			</div>
		);
	}

});

module.exports = TrackContainer;