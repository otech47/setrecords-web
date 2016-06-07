import React, {PropTypes} from 'react';
import ArtistTile from './ArtistTile';
import InfiniteScrollify from './InfiniteScrollify';

const ArtistTileContainer = ({artists, authArtist}) => (
	<div className='artist-tile-container'>
		{
			artists.map((artist, index) => {
				return React.createElement(ArtistTile, {
					artist: artist.artist,
					key: index,
					imageURL: artist.icon_image.imageURL,
					setCount: artist.set_count,
					eventCount: artist.event_count,
					authArtist: authArtist
				})
			})
		}
	</div>
);

ArtistTileContainer.propTypes = {
	artists: PropTypes.array.isRequired,
	onScroll: PropTypes.func,
	authArtist: PropTypes.func
};

export default InfiniteScrollify(ArtistTileContainer);