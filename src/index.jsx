import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import Immutable from 'immutable';
import {IndexRoute, Link, Route, Router, History } from 'react-router';
import GlobalEventHandler from './services/globalEventHandler';
import _ from 'underscore';
import async from 'async';
import constants from './constants/constants';
import auth from './components/auth';

import MobileSetEditor from './components/MobileSetEditor';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import Footer from './components/Footer';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import UploadSetWizard from './components/UploadSetWizard';
import SettingsEditor from './components/SettingsEditor';
import Contact from './components/Contact';

import BeaconReport from './components/BeaconReport';
import SetmineReport from './components/SetmineReport';
import SocialReport from './components/SocialReport';
import SoundcloudReport from './components/SoundcloudReport';
import YoutubeReport from './components/YoutubeReport';

import ForgotPassword from './components/ForgotPassword';
import Icon from './components/Icon';

import UpdateFunctions from './mixins/UpdateFunctions';
import UtilityFunctions from './mixins/UtilityFunctions';

var initialAppState = Immutable.Map({
    settings_editor: false,
    set_editor: false,
    upload_set_wizard: false,
    loaded: false,
    loggedIn: false,
    sets: [],
    working_set: {},
    editSet: {},
    artistId: 0,
    artist_data: {
        id: 0,
        artist: 'Not logged in',
        icon_image: {
            imageURL: constants.DEFAULT_IMAGE
        }
    },
    header: '',
    genres: [],
    events: [],
    mixes: [],
    artists: [],
    venues: [],
    setmineMetrics: {
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
    soundcloudMetrics: {
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
    youtubeMetrics: {
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
    beaconMetrics: {
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
    socialMetrics: {
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
    mixins: [UpdateFunctions, UtilityFunctions, History],

    getInitialState() {
        return {
            appState: initialAppState
        };
    },

    updateAuth: function (artistId) {
        console.log('Update auth: ' + artistId);
        if (artistId) {
            console.log('Updating auth to artist ID: ' + artistId);
            push({
                type: 'SHALLOW_MERGE',
                data: {
                    artistId: artistId,
                    loggedIn: true
                }
            });
            this.updateArtist();
        } else {
            console.log('This user not authorized.');
            push({
                type: 'SHALLOW_MERGE',
                data: {
                    artistId: 0,
                    loggedIn: false
                }
            });
        }
    },

    updateArtist() {
        push({
            type: 'SHALLOW_MERGE',
            data: {
                loaded: false
            }
        });

        var requestURL = 'https://api.setmine.com/v/10/setrecordsuser/login';
        $.ajax({
            type: "POST",
            url: requestURL,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log(res);
            push({
                type: 'SHALLOW_MERGE',
                data: {
                    artist_data: res.payload.artist,
                    artistId: res.payload.artist_id,
                    loaded: true
                }
            });
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
        auth.onChange = this.updateAuth;
        console.log('Will mount');
        auth.logIn();
    },

    render() {
        var appState = this.state.appState;

        return (
            <div className='flex-column' id='App'>
                <Header artistImage={appState.get('artist_data').icon_image.imageURL} artistName={appState.get('artist_data').artist} headerText={appState.get('header')} />
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
                case BeaconReport:
                props = {push: push, loaded: appState.get('loaded'), beaconMetrics: appState.get('beaconMetrics'), artistId: appState.get('artistId')};
                break;

                case Login:
                props = {push: push};
                break;

                case MobileSetEditor:
                props = {push: push, loaded: appState.get('loaded'), originalArtist: appState.get('artist_data')};
                break;

                case SetmineReport:
                props = {push: push, loaded: appState.get('loaded'), setmineMetrics: appState.get('setmineMetrics'), artistId: appState.get('artistId')};
                break;

                case SettingsEditor:
                props = {push: push, artistId: appState.get('artistId'), loaded: appState.get('loaded'), artistData: appState.get('artist_data')};
                break;

                case SocialReport:
                props = {push: push, loaded: appState.get('loaded'), socialMetrics: appState.get('socialMetrics'), artistId: appState.get('artistId')};
                break;

                case SoundcloudReport:
                props = {push: push, loaded: appState.get('loaded'), soundcloudMetrics: appState.get('soundcloudMetrics'), artistId: appState.get('artistId')};
                break;

                case UploadSetWizard:
                props = {push: push, originalArtist: appState.get('artist_data')};
                break;

                case YoutubeReport:
                props = {push: push, loaded: appState.get('loaded'), youtubeMetrics: appState.get('youtubeMetrics'), artistId: appState.get('artistId')};
                break;

                default:
                props = {push: push, appState: appState};
                break;
            }

            return React.cloneElement(child, props);
        });
    }
});

var Login = React.createClass ({

    mixins: [LinkedStateMixin, History],

    getInitialState: function() {
        return {
            username: '',
            password: '',
            error: null,
            changePassword: false
        }
    },

    render: function () {
        var password = this.state.changePassword ? <ForgotPassword /> : <p onClick={() => this.setState({changePassword: true})}>Forgot password?</p>
        return(
            <div id='Login'>
                <video id='introvid' autoPlay='auto' loop='loop'>
                    <source src='https://setmine.com/videos/setrecords-login-compress.mp4' type='video/mp4'/>
                </video>
                <section className='flex-container'>
                    <div className='form center'>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>perm_identity</Icon>
                            <input type='text' placeholder='Username' valueLink={this.linkState('username')} />
                        </div>
                        <div className='flex-row' onClick={() => this.setState({changePassword:false})}>
                            <Icon className='center'>lock_outline</Icon>
                            <input type='password' placeholder='Password' valueLink={this.linkState('password')} />
                        </div>
                        <div className={'set-flex login-error ' + (this.state.error ? '' : 'hidden')}>
                            {this.state.error}
                        </div>
                        <button className='flex-container' onClick={this.submitLogin} disabled={(this.state.username.length > 0 && this.state.password.length > 0 ? false : true)}>Sign In</button>
                        {password}
                    </div>
                </section>
            </div>
        );
    },

    submitLogin: function() {
        console.log('Submitting login with:');
        console.log(this.state.username);
        console.log(this.state.password);

        auth.logIn(this.state.username, this.state.password, (result) => {
            console.log('Login Result:');
            console.log(result);

            if (result) {
                this.history.pushState(null, '/content');
            }
        });
    },
});

var bodyMount = document.getElementById('body-mount-point');

import createBrowserHistory from 'history/lib/createBrowserHistory';
var history = createBrowserHistory();

var routes = (
    <Route path='/' component={App} >
        <IndexRoute component={Login} />
        <Route path='content' component={ContentView} />

        <Route path='metrics/setmine' component={SetmineReport} />
        <Route path='metrics/beacons' component={BeaconReport} />
        <Route path='metrics/social' component={SocialReport} />
        <Route path='metrics/soundcloud' component={SoundcloudReport} />
        <Route path='metrics/youtube' component={YoutubeReport} />

        <Route path='edit/:id' component={MobileSetEditor} />
        <Route path='account' component={SettingsEditor} />
        <Route path='contact' component={Contact} />
        <Route path='upload-set' component={UploadSetWizard} />
    </Route>
);

ReactDOM.render(
    <Router history={history}>
        {routes}
    </Router>
, bodyMount);
