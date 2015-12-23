import React from 'react';
import SetTile from './SetTile';
import _ from 'underscore';
import Loader from 'react-loader';
import constants from '../constants/constants';

var ContentView = React.createClass({

    getInitialState() {
        return {
            loaded: false
        };
    },

    componentWillMount() {
        this.updateSets();
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Uploads'
            }
        });
    },

    componentDidMount() {
        mixpanel.track("Content Page Open");
    },

    render() {
        var sets = this.props.appState.get('sets');
        var setTiles = _.map(sets, (set) => {
            if (!set.event) {
                set.event = {
                    event: 'error',
                    banner_image: {
                        imageURL: constants.DEFAULT_IMAGE
                    }
                };
            }
            var setName = set.event.event;
            if(set.episode != null && set.episode.episode.length > 0) {
                var setName = set.event.event+' - '+set.episode.episode    ;
            }

            var imageURL;
            if (set.icon_image && set.icon_image.imageURL) {
                imageURL = set.icon_image.imageURL;
            } else {
                imageURL = set.event.banner_image.imageURL;
            }

            var artists = _.map(set.artists, function(artist) {
                return artist.artist;
            }).join(', ');

            var props = {
                key: set.id,
                id: set.id,
                setName: setName,
                artist: artists,
                imageURL: imageURL,
                set_length: set.set_length,
                popularity: set.popularity,
                is_radiomix: set.event.is_radiomix,
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
        var artistId = this.props.appState.get('artistId');
        var requestURL = 'http://localhost:3000/v/10/setrecords/';
        var query = `{
            artist (id: ${artistId}) {
                sets {
                    id,
                    icon_image {
                        imageURL
                    },
                    event {
                        event,
                        is_radiomix,
                        banner_image {
                            imageURL
                        }
                    },
                    episode {
                        episode,
                        icon_image {
                            imageURL
                        }
                    },
                    datetime,
                    popularity,
                    set_length,
                    tracklistURL,
                    artists {
                        id,
                        artist
                    },
                    tracks {
                        id,
                        starttime,
                        artistname,
                        songname
                    }
                }
            }
        }`;

        $.ajax({
            type: 'POST',
            url: requestURL,
            data: {
                query: query
            }
        })
        .done((res) => {
            // console.log(res);
            this.setState({
                loaded: true
            }, this.props.push({
                type: 'SHALLOW_MERGE',
                data: {
                    sets: res.payload.artist.sets
                }
            }));
        })
        .fail(function(err) {
            console.log(err);
        });
    }
});

module.exports = ContentView;
