import React from 'react';
import BrowseTile from './BrowseTile';

var BrowseContainer = React.createClass({

	render: function() {
		var data = this.props.appState.get('browseData');
		var tiles = data.map(function(set) {
			return(<BrowseTile data={set} key={set.id}/>)
		});
		return (
			<div className='results-container flex-row flex'>
				{tiles}
			</div>
		);
	}

});

module.exports = BrowseContainer;