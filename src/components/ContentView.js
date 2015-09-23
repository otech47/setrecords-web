import React from 'react/addons';
import MobileSetEditor from './MobileSetEditor';
import SetTile from './SetTile';
import _ from 'underscore';
var Loader = require("react-loader");

var ContentView = React.createClass({
	displayName: 'ContentView',
	getInitialState: function() {
		return {
			loaded: false,
			editor: false,
			currentSet: {
				"id": 2163,
				"artist_id": [40],
				"artist": "Calvin Harris",
				"event": "Lollapalooza Chicago 2014",
				"event_id": 125,
				"episode": "",
				"genre": "Progressive House",
				"episode_imageURL": null,
				"eventimageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
				"main_eventimageURL": "8035464a1f8870cce06b320fbab09a73d4994b54.jpg",
				"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
				"songURL": "850123b85fd2246c014fc6f9ce427708b72a97da.mp3",
				"datetime": "2014-08-06T03:31:35.000Z",
				"popularity": 7686,
				"is_radiomix": 0,
				"set_length": "48:49",
				"tracklistURL": null,
				"imageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
				"artist_preview": [
					{
					"id": 40,
					"artist": "Calvin Harris",
					"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
					"set_count": 14,
					"event_count": 5
					}
				],
				"model_type": "set"
			}
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
	setEditor: function() {
		if (this.state.editor) {
			return (<MobileSetEditor set={this.state.currentSet} close={this.closeSetEditor} push={this.props.push} />);
		}
	},
	openSetEditor: function(setData) {
		this.setState({
			editor: true,
			currentSet: setData
		});
	},
	closeSetEditor: function() {
		this.setState({
			editor: false
		});
	},
	render: function() {
		var appState = this.props.appState;
		var sets = appState.get("artistData").sets;
		var self = this;
		var setTiles = _.map(sets, function(set) {
			return (<SetTile key={set.id} setData={set} setClick={self.openSetEditor} />);
		});
		return (
			<div className="content-page flex-column">
				{this.setEditor()}
				<Loader loaded={this.state.loaded}>
					<div className={"mobile-column flex-row " + (this.state.editor ? "hidden":"")} >
						<button className="addSet flex-column">
							<i className="fa fa-plus"></i>
							<p>add a set</p>
						</button>
						<button className="addSong flex-column">
							<i className="fa fa-plus"></i>
							<p>add a track</p>
						</button>
						{setTiles}						
					</div>
				</Loader>
			</div>
		);
	}
});

module.exports = ContentView;