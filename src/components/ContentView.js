import React from 'react';
import SetTile from './SetTile';
import _ from 'underscore';
var Loader = require("react-loader");

var ContentView = React.createClass({
	componentDidMount: function() {
		this.updateSets();
	},
	render: function() {
		var sets = this.props.sets;
		var setTiles = _.map(sets, function(set) {
			return (<SetTile key={set.id} setData={set} />);
		});
		return (
			<Loader loaded={this.props.loaded}>
				<div className='content-page flex-column flex'>
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
	},
	updateSets: function() {
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/sets/' + this.props.artistId;
		$.ajax({
			type: 'GET',
			url: requestURL,
			success: function(res) {
				// console.log('Sets...');
				if (res.status == 'failure') {
					// console.log('An error occurred getting set data.');
				} else {
					this.props.push({
						type: 'SHALLOW_MERGE',
						data: {
							sets: res.payload.sets
						}
					});
				}
			}.bind(this),
			error: function(err) {
				// console.log('There was an error retrieving current sets from the server.');
			}
		});
	},
});

module.exports = ContentView;
