import React from 'react/addons';
import SetTile from './SetTile';
import _ from 'underscore';
var Loader = require('react-loader');

var ContentView = React.createClass({
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
			<Loader loaded={self.props.loaded}>
				<div className='content-page flex-row'>
					{setTiles}
				</div>
			</Loader>
		);
	}
});

module.exports = ContentView;