import React from 'react/addons';
import SetEditor from './SetEditor';
import SetTile from './SetTile';
import MoibleSetEditor from './MoibleSetEditor'
import _ from 'underscore';
var Loader = require("react-loader");

var ContentView = React.createClass({
	displayName: 'ContentView',
	getInitialState: function() {
		return {
			loaded: false
		}
	},
	_attachStreams: function() {
		var _this = this;
	},
	componentWillMount: function() {
		var artistId = this.props.appState.get("artistData").id;
		var push = this.props.push;
		var requestUrl = "http://localhost:3000/api/v/7/artist/" + artistId;
		console.log(requestUrl);
		var self = this;
		$.ajax({
			type: "GET",
			url: requestUrl,
			success: function(res) {
				console.log(res);
				push({
					type: "SHALLOW_MERGE",
					data: {
						artistData:	res.payload.artist
					}
				});
			self.setState({
				loaded: true
			});
			}
		});
	},
	render: function() {
		var appState = this.props.appState;
		var sets = appState.get("artistData").sets;
		var setTiles = _.map(sets, function(set) {
			return (<SetTile key={set.id} setData={set} />);
		});
		return (
			<div className="content-page flex-column">
				<Loader loaded={this.state.loaded}>
				<div className="mobile-column flex-row  ">
					<button className="addSet flex-column">
						<i className="fa fa-plus"></i>
						<p>add a set</p>
					</button>
					<button className="addSong flex-column">
						<i className="fa fa-plus"></i>
						<p>add a song</p>
					</button>
					{setTiles}						
				</div>

				</Loader>
			</div>
		);
	}
});

module.exports = ContentView;