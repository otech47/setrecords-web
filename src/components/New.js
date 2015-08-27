import React from 'react';
import SetTile from './SetTile';

var New = React.createClass({

	render: function() {
		var data = this.props.data.new;
		var tiles = data.map(function(set) {
			return (<SetTile data={set} key={set.id}/>);
		})
		return (
			<div className="flex-row flex-fixed-3x results-container">
				{tiles}
			</div>
		);
	}

});

module.exports = New;