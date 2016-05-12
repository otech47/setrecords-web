import React from 'react';

import api from '../lib/api';
import auth from '../lib/auth';
import Base from './Base';
import constants from '../constants/constants';

export default class Header extends Base {
    constructor(props) {
        super(props);
        this.autoBind('fetchArtist', 'logout');

        this.state = {
            artist: '',
            imageUrl: constants.DEFAULT_IMAGE
        };
    }

    componentDidMount() {
        this.fetchArtist(this.context.artistId);
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.artistId !== this.context.artistId) {
            this.fetchArtist(nextContext.artistId);
        }
    }

    render() {
        return (
            <header id='Header' className='row justify-space-between align-center'>
                <h1>{this.props.headerText}</h1>

                <div className='artist-detail row align-center'>
                    <div className='artist-info column align-end justify-center'>
                        <h1 className='bold'>{this.state.artist}</h1>
                        <a href='#' onClick={this.logout}>Logout</a>
                    </div>

                    <img src={constants.S3_ROOT_FOR_IMAGES + this.state.imageUrl} />
                </div>
            </header>
        );
    }

    fetchArtist(artistId) {
        var queryString = `{
            artist (id: ${artistId}) {
                artist,
                icon_image {
                    imageURL
                }
            }
        }`;

        api.graph({
            query: queryString
        }).then((response) => {
            if (response.payload && response.payload.artist) {
                this.setState({
                    artist: response.payload.artist.artist,
                    imageUrl: response.payload.artist.icon_image.imageURL
                });
            }
        })
        .catch((err) => {
            console.log('==err===');
            console.log(err);
        });
    }

    logout(e) {
        e.preventDefault();
        auth.logout()
            .then(() => {
                this.context.router.push('/login');
            })
            .catch((err) => {
                console.log('==err===');
                console.log(err);
            });
    }
};

Header.contextTypes = {
    artistId: React.PropTypes.number,
    push: React.PropTypes.func,
    router: React.PropTypes.object
};
