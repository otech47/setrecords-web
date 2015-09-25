import React from 'react/addons';
var Loader = require("react-loader");

var SetList = React.createClass({
	render: function() {
		return (
			<Loader loaded={this.props.isLoaded}>
				<div className="mobile-column flex-row">
					<button className="addSet flex-column">
						<i className="fa fa-plus"></i>
						<p>add a set</p>
					</button>
					<button className="addSong flex-column">
						<i className="fa fa-plus"></i>
						<p>add a track</p>
					</button>
					{this.props.tiles}						
				</div>
			</Loader>
		);
	}
});

module.exports = SetList;