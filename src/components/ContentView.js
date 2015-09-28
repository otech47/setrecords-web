import React from 'react/addons';
import SetTile from './SetTile';
import _ from 'underscore';
var Loader = require("react-loader");

var ContentView = React.createClass({
	render: function() {
		var {appState, loaded, ...other} = this.props;
		var sets = appState.get('sets');
		var setTiles = _.map(sets, function(set) {
			return (<SetTile key={set.id} setData={set} {...other} />);
		});
		return (
			<Loader loaded={loaded}>
				<div className='content-page flex-column'>
					<div className='mobile-column flex-row'>
						<button className='addSet flex-column'>
							<i className='fa fa-plus'></i>
							<p>add a set</p>
						</button>
						<button className="addSong flex-column">
							<i className="fa fa-plus"></i>
							<p>add a track</p>
						</button>
						{setTiles}
					</div>
				</div>
			</Loader>
		);
	}
});

module.exports = ContentView;