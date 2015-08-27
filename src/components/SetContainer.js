import React from 'react';
import SetTile from './SetTile';

var SetContainer = React.createClass({

	render: function() {
		var data = this.props.data;
		var tiles = data.map(function(set) {
			return(<SetTile data={set} key={set.id}/>);
		});
		return (
			<div className='results-container flex-row flex'>
				{tiles}
			</div>
		);
	}

});

module.exports = SetContainer;