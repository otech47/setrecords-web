import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Router from 'react-router';
import { IndexRoute, Link, Route, History } from 'react-router';
import GlobalEventHandler from './services/globalEventHandler';
import _ from 'underscore';
import async from 'async';

import Login from './components/Login';
import MobileSetEditor from './components/MobileSetEditor';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import Footer from './components/Footer';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import UploadWizardWrapper from './components/UploadWizardWrapper';
import SettingsEditor from './components/SettingsEditor';
import Contact from './components/Contact';

import BeaconReport from './components/BeaconReport';
import SetmineReport from './components/SetmineReport';
import SocialReport from './components/SocialReport';
import SoundcloudReport from './components/SoundcloudReport';
import YoutubeReport from './components/YoutubeReport';

import UpdateFunctions from './mixins/UpdateFunctions';
import UtilityFunctions from './mixins/UtilityFunctions';

var initialAppState = Immutable.Map({
    settings_editor: false,
    set_editor: false,
    upload_set_wizard: false,
    loaded: false,
    sets: [],
    working_set: {},
    editSet: {},
    artist_data: {
        id: 4026,
        artist: 'Nodex'
    },
    header: '',
    genres: [],
    events: [],
    mixes: [],
    artists: [],
    venues: [],
    setmine_metrics: {
        plays: {
            current: '',
            overtime: []
        },
        views: {
            current: '',
            overtime: []
        },
        favorites: {
            current: '',
            overtime: []
        }
    },
    soundcloud_metrics: {
        plays: {
            current: '',
            last: '',
            overtime: []
        },
        followers: {
            current: '',
            last: '',
            overtime: []
        }
    },
    youtube_metrics: {
        plays: {
            current: '',
            last: '',
            overtime: []
        },
        followers: {
            current: '',
            last: '',
            overtime: []
        }
    },
    beacon_metrics: {
        revenue: {
            current: '',
            last: '',
            overtime: []
        },
        unlocks: {
            current: '',
            last: '',
            overtime: []
        }
    },
    social_metrics: {
        twitter: {
            current: '',
            last: '',
            overtime: []
        },
        facebook: {
            current: '',
            last: '',
            overtime: []
        },
        instagram: {
            current: '',
            last: '',
            overtime: []
        }
    }
});

var evtHandler = GlobalEventHandler(initialAppState);
var evtTypes = evtHandler.types;
var push = evtHandler.push;

var App = React.createClass({

    displayName: 'App container',
    mixins: [UpdateFunctions, UtilityFunctions],

    getInitialState() {
        return {
            appState: initialAppState
        };
    },

    updateArtist() {
        var artistId = this.state.appState.get("artist_data").id;
        var requestURL = "http://localhost:3000/v/10/setrecords/";
        var query = `{
            artist (id: ${artistId}) {
                id,
                artist,
                fb_link,
                twitter_link,
                web_link,
                instagram_link,
                soundcloud_link,
                youtube_link,
                icon_image {
                    imageURL
                }
            }
        }`;
        $.ajax({
            type: "POST",
            url: requestURL,
            data: {
                query: query
            }
        })
        .done((res) => {
            // console.log('Artist...');
            if (res.status == 'failure') {
                console.log("An error occurred getting artist data.");
                console.log(res.payload.error);
            } else {
                push({
                    type: 'SHALLOW_MERGE',
                    data: {
                        artist_info: res.payload.artist,
                        loaded: true
                    }
                });
            }
        })
        .fail((err) => {
            console.log('An error occurred getting artist data.');
            console.log(err);
        });
    },

    _attachStreams() {
        var _this = this;
        evtHandler.floodGate.subscribe(newState => {
            // console.log('UPDATE', newState);
            _this.setState({ appState: newState });
        });
    },

    componentWillMount() {
        this._attachStreams(); //global event handler
        this.updateArtist();
    },

    render() {
        var appState = this.state.appState;
        return (
            <div className='flex-column' id='App'>
                <Header appState={appState} />
                <div className='flex-row view-container'>
                    {this.props.location.pathname == '/' ? '' : <NavBar push={push} /> }
                    <div className='view flex-column flex'>
                        {this.renderChildren()}
                        <Footer/>
                    </div>
                </div>
            </div>
        );
    },

    renderChildren() {
        var appState = this.state.appState;
        return React.Children.map(this.props.children, function (child) {
            var props = {};

            switch (child.type) {
                default:
                props = {push: push, appState: appState};
                break;
            }

            return React.cloneElement(child, props);
        });
    }

});

//TODO move into separate routes
    // showView(appState) {
    //     var updateFunctions = {updateArtist: this.updateArtist, updateSetmine: this.updateSetmine, updateSocial: this.updateSocial, updateBeacons: this.updateBeacons, updateYoutube: this.updateYoutube, updateSoundcloud: this.updateSoundcloud, updateSets: this.updateSets};
    //     if (appState.get('set_editor')) {
    //         return (
    //             <MobileSetEditor set={appState.get('working_set')} close={this.closeSetEditor} appState={appState} {...UtilityFunctions} />
    //         );
    //     } else if (appState.get('settings_editor')) {
    //         return (
    //             <SettingsEditor settings={appState.get('artist_data')} close={this.closeSettingsEditor} appState={appState} {...UtilityFunctions} />
    //         );
    //     } else if (appState.get('upload_set_wizard')) {
    //         return (
    //             <UploadWizardWrapper originalArtist={appState.get('artist_data').artist} eventLookup={appState.get('event_lookup')} events={appState.get('events')} mixes={appState.get('mixes')} genres={appState.get('genres')}
    //                 venues={appState.get('venues')} />
    //         );
    //     } else {
    //         return (
    //             <ViewContainer
    //                 appState={appState}
    //                 {...updateFunctions}
    //                 {...UtilityFunctions}
    //                 push={push}
    //                 routeHandler={RouteHandler}
    //                 openSetEditor={this.openSetEditor}
    //                 openUploadSetWizard={this.openUploadSetWizard}
    //                 loaded={appState.get('loaded')} />
    //         );
    //     }
    // }

var history = createBrowserHistory();

ReactDOM.render(
    <Router>
        <Route path='/' component={App} >
            <IndexRoute component={Login} />

            <Route path='content' component={ContentView} />
            <Route path='metrics' component={MetricsView}>
                <Route path='setmine' component={SetmineReport} />
                <Route path='beacons' component={BeaconReport} />
                <Route path='social' component={SocialReport} />
                <Route path='soundcloud' component={SoundcloudReport} />
                <Route path='youtube' component={YoutubeReport} />
            </Route>
            <Route path='edit/:id' component={MobileSetEditor} />
            <Route path='account' component={SettingsEditor} />
            <Route path='contact' component={Contact} />
            <Route path='upload' component={UploadWizardWrapper} />
        </Route>
    </Router>,
document.getElementById('body-mount-point'));
