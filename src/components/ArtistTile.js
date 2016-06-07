import React, {PropTypes} from 'react';
import {S3_ROOT_FOR_IMAGES, DEFAULT_IMAGE} from '../constants/constants';

const ArtistTile = ({artist, imageURL, setCount, eventCount, authArtist}, {router}) => {
	let image = { backgroundImage: `url('${S3_ROOT_FOR_IMAGES+imageURL}')` };
	let setText = setCount > 1 ? 'sets' : 'set';
	let eventText = eventCount != 1 ? 'events' : 'event';
	let artistInfo = `${setCount} ${setText} | ${eventCount} ${eventText}`;

	return (
		<div className=''>
			<div className='artist-tile flex-column' onClick={authArtist} title={artist}>
				<h5>{artist}</h5>
			</div>
		</div>
	);
}

const {object, string, number, func} = PropTypes;

ArtistTile.contextTypes = {
	router: object
};

ArtistTile.propTypes = {
	artist: string,
	imageURL: string,
	setCount: number,
	eventCount: number,
	authArtist: func
};

ArtistTile.defaultProps = {
	imageURL: DEFAULT_IMAGE
};

export default ArtistTile;