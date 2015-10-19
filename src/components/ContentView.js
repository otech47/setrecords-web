import React from 'react';
import SetTile from './SetTile';
import _ from 'underscore';
var Loader = require('react-loader');

var ContentView = React.createClass({

	componentWillMount() {
		this.updateSets();
	},

	render() {
		var sets = this.props.appState.get('sets');
		var self = this;

		var setTiles = _.map(sets, function(set) {
			var setName = set.event;
			if(set.episode != null && set.episode.length > 0) {
				var setName = set.event+' - '+set.episode	;
			}

			if (set.is_radiomix && set.episode) {
				var imageURL = set.episode_imageURL;
			} else {
				var imageURL = set.main_eventimageURL;
			}

			var props = {
				key: set.id,
				setName: setName,
				artist: set.artist,
				imageURL: imageURL,
				set_length: set.set_length,
				popularity: set.popularity,
				loaded: self.props.loaded,
				openSetEditor: self.props.openSetEditor
			};

			return (<SetTile {...props} />);
		});

		return (
			<Loader loaded={true}>
				<div className='content-page flex-row'>
					{setTiles}
				</div>
			</Loader>
		);
	},

	updateSets() {
		var requestURL = 'http://localhost:3000/api/v/7/setrecords/artist/sets/' + this.props.appState.get('artist_data').id;

		$.ajax({
			type: 'GET',
			url: requestURL
		})
		.done(function(res) {
			console.log(res.payload.sets);
			this.props.push({
				type: 'SHALLOW_MERGE',
				data: {
					sets: res.payload.sets,
					header: 'Content'
				}
			});
		}.bind(this))
		.fail(function(err) {
			console.log(err);
		});
	}
});

module.exports = ContentView;
