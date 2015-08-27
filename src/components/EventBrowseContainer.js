var React = require('react');
var constants = require('../constants/constants')
var EventTile = require('./EventTile')

var EventBrowseContainer = React.createClass({
	render: function() {
		var eventTiles = [];
		this.props.currentEvents.map(function(tile, index){
			eventTiles.push(<EventTile data={tile} key={index}/>)
		})
		return (
			<div className="results-container flex-row flex">
				{eventTiles}
			</div>
		);
	}

});

module.exports = EventBrowseContainer;