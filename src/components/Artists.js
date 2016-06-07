import React, {PropTypes} from 'react';
import R from 'ramda';

import Base from './Base';
import ArtistTileContainer from './ArtistTileContainer';
import ArtistTile from './ArtistTile';

export default class Artists extends Base {
	constructor(props) {
		super(props);
		this.autoBind('fetchArtists', 'onScroll');
		this.state = {
			loaded: false,
			artists: [],
			page: 1
		};
		this.fetchArtists(this.state.page);
	}
	fetchArtists(page) {
		$.ajax({
		    type: 'GET',
		    url: `https://api.setmine.com/v/10/artists?page=${page}`,
		    crossDomain: true,
		    xhrFields: {
		        withCredentials: true
		    }
		})
		.done((res) => {
		    console.log(res);

		    if (res.payload.artists !== null) {
		        let artists = res.payload.artists;
		        artists = this.state.artists.concat(artists);
		        artists = R.uniq(artists);

		        this.setState({
		        	loaded: true,
		        	artists: artists,
		        	page: page + 1
		        });
		    }
		})
		.fail(function(err) {
		    console.log(err);
		});
	}
	onScroll() {
		this.fetchArtists(this.state.page);
	}
	render() {
		return (
			<div className='artists'>
				<ArtistTileContainer artists={this.state.artists} onScroll={this.onScroll} authArtist={this.props.authArtist}/>
			</div>
		);
	}
}