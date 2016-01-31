import React from 'react';
import SetTile from './SetTile';
import _ from 'underscore';
import Loader from 'react-loader';
import constants from '../constants/constants';

var ContentView = React.createClass({
    componentWillMount() {
        this.props.push({
            type: 'SHALLOW_MERGE',
            data: {
                header: 'Uploads',
                loaded: false
            }
        });
    },

    componentDidMount() {
        mixpanel.track("Content Page Open");
        this.updateSets(this.props.artistId);
    },

    shouldComponentUpdate (nextProps, nextState) {
        if (nextProps.artistId != this.props.artistId) {
            this.updateSets(nextProps.artistId);
        }

        return true;
    },

    render() {
        var sets = this.props.sets;

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
                var setName = set.event.event + ' - ' + set.episode.episode;
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
                is_radiomix: set.event.is_radiomix
            };

            return (<SetTile {...props} />);
        });

        return (
            <Loader loaded={this.props.loaded}>
                <div className='content-page flex-row'>
                    {setTiles}
                </div>
            </Loader>
        );
    },

    updateSets(artistId) {
        // console.log(artistId);
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/graph';

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
            type: 'GET',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                query: query
            }
        })
        .done((res) => {
            // console.log(res);

            if (res.payload.artist !== null) {
                this.props.push({
                    type: 'SHALLOW_MERGE',
                    data: {
                        loaded: true,
                        sets: res.payload.artist.sets
                    }
                });
            }
        })
        .fail(function(err) {
            // console.log(err);
        });
    }
});

module.exports = ContentView;
