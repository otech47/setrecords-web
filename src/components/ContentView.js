import React from 'react';
import SetTile from './SetTile';
import _ from 'underscore';
import Loader from 'react-loader';

var ContentView = React.createClass({

	getInitialState() {
		return {
			loaded: false
		};
	},

	componentWillMount() {
		this.updateSets();
	},

	render() {
		var sets = this.props.appState.get('sets');
		var setTiles = _.map(sets, (set) => {
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
				id: set.id,
				setName: setName,
				artist: set.artist,
				imageURL: imageURL,
				set_length: set.set_length,
				popularity: set.popularity,
				is_radiomix: set.is_radiomix,
				push: this.props.push
			};
			
			return (<SetTile {...props} />);
		});

		return (
			<Loader loaded={this.state.loaded}>
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
		.done((res) => {
			this.setState({
				loaded: true
			}, this.props.push({
				type: 'SHALLOW_MERGE',
				data: {
					sets: res.payload.sets,
					header: 'Content'
				}
			}));
		})
		.fail(function(err) {
			console.log(err);
		});
	}
});

module.exports = ContentView;
