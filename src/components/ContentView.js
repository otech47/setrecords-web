import React from 'react/addons';
import MobileSetEditor from './MobileSetEditor';
import SetTile from './SetTile';
import SetList from './SetList';
import _ from 'underscore';

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
	componentWillMount: function() {
		this.updateSets();
	},
	updateSets: function() {
		// here's where we make sure that we have all the current set data
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/sets/" + this.props.appState.get("artistData").id;
		var push = this.props.push;
		var self = this;
		$.ajax({
			type: "GET",
			url: requestURL,
			success: function(res) {
				// console.log("Successfully got current sets.");
				push({
					type: "SHALLOW_MERGE",
					data: {
						sets: res.payload.sets
					}
				});
				self.setState({
					loaded: true
				});
			},
			error: function(err) {
				// console.log("There was an error retrieving current sets from the server.");
				// console.log(err);
			}
		});
	},
	editorOrList: function() {
		if (this.state.editor) {
			return (<MobileSetEditor set={this.state.currentSet} close={this.closeSetEditor} push={this.props.push} appState={this.props.appState} />);
		} else {
			var appState = this.props.appState;
			var sets = appState.get("sets");
			var self = this;
			var setTiles = _.map(sets, function(set) {
				return (<SetTile key={set.id} setData={set} setClick={self.openSetEditor} />);
			});
			return (<SetList isLoaded={this.state.loaded} tiles={setTiles} push={this.props.push} />);
		}
	},
	openSetEditor: function(setData) {
		this.setState({
			editor: true,
			currentSet: setData
		});
	},
	closeSetEditor: function(changed) {
		var self = this;
		if (changed) {
			this.setState({
				editor: false,
				loaded: false
			}, self.updateSets());
		} else {
			this.setState({
				editor: false,
			});
		}
	},
	render: function() {
		return (
			<div className="content-page flex-column">
				{this.editorOrList()}
			</div>
		);
	}
});

module.exports = ContentView;