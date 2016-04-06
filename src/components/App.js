var React = require('react');

var App = module.exports = React.createClass({
    render: function() {
        return (
            <div>
                App
            </div>
        )
    }
});

// import R from 'ramda';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import LinkedStateMixin from 'react-addons-linked-state-mixin';
// import Immutable from 'immutable';
// import {IndexRoute, Link, Route, Router, History } from 'react-router';
// import GlobalEventHandler from '../services/globalEventHandler';
// import _ from 'underscore';
// import async from 'async';
// import constants from '../constants/constants';
//
// import SetEditor from './SetEditor';
// import Header from './Header';
// import NavBar from './NavBar';
// import Footer from './Footer';
// import ContentView from './ContentView';
// import MetricsView from './MetricsView';
// import UploadSetWizard from './UploadSetWizard';
// import UploadTrackWizard from './UploadTrackWizard';
// import SettingsEditor from './SettingsEditor';
// import Contact from './Contact';
//
// import BeaconReport from './BeaconReport';
// import SetmineReport from './SetmineReport';
// import SocialReport from './SocialReport';
// import SoundcloudReport from './SoundcloudReport';
// import YoutubeReport from './YoutubeReport';
// import LoginPage from './LoginPage';
//
// import ForgotPassword from './ForgotPassword';
// import Icon from './Icon';
//
// import UpdateFunctions from '../mixins/UpdateFunctions';
// import UtilityFunctions from '../mixins/UtilityFunctions';
//
// var defaultValues = {
//     settings_editor: false,
//     set_editor: false,
//     upload_set_wizard: false,
//     loaded: false,
//     loggedIn: false,
//     sets: [],
//     working_set: {},
//     editSet: {},
//     artistId: 0,
//     artist_data: {
//         id: 0,
//         artist: 'Not logged in',
//         icon_image: {
//             imageURL: constants.DEFAULT_IMAGE
//         }
//     },
//     header: '',
//     genres: [],
//     events: [],
//     mixes: [],
//     artists: [],
//     venues: [],
//     setmineMetrics: {
//         plays: {
//             current: '',
//             overtime: []
//         },
//         views: {
//             current: '',
//             overtime: []
//         },
//         favorites: {
//             current: '',
//             overtime: []
//         }
//     },
//     soundcloudMetrics: {
//         plays: {
//             current: '',
//             last: '',
//             overtime: []
//         },
//         followers: {
//             current: '',
//             last: '',
//             overtime: []
//         }
//     },
//     youtubeMetrics: {
//         plays: {
//             current: '',
//             last: '',
//             overtime: []
//         },
//         followers: {
//             current: '',
//             last: '',
//             overtime: []
//         }
//     },
//     beaconMetrics: {
//         revenue: {
//             current: '',
//             last: '',
//             overtime: []
//         },
//         unlocks: {
//             current: '',
//             last: '',
//             overtime: []
//         }
//     },
//     socialMetrics: {
//         twitter: {
//             current: '',
//             last: '',
//             overtime: []
//         },
//         facebook: {
//             current: '',
//             last: '',
//             overtime: []
//         },
//         instagram: {
//             current: '',
//             last: '',
//             overtime: []
//         }
//     }
// };
//
// var initialAppState = Immutable.Map(defaultValues);
//
// var evtHandler = GlobalEventHandler(initialAppState);
// var evtTypes = evtHandler.types;
// var push = evtHandler.push;
//
//
// var loggedIn = function (cb) {
//     // console.log('Checking log in status...');
//
//     var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/login';
//
//     $.ajax({
//         type: 'post',
//         url: requestUrl,
//         crossDomain: true,
//         xhrFields: {
//             withCredentials: true
//         }
//     })
//     .done((res) => {
//         // console.log('==LOGGED IN==');
//         // console.log(res);
//         cb(res.payload.artist_id);
//     })
//     .fail((err) => {
//         // console.log(err);
//         cb();
//     });
// }
//
// var logIn = function (user, pass, cb) {
//     // console.log('Logging in...');
//     cb = arguments[arguments.length - 1];
//
//     loggedIn((artistId) => {
//         if (artistId) {
//             // console.log('Session exists!');
//             onChange(artistId);
//             if (cb) {
//                 cb();
//             }
//             return;
//         }
//
//         // console.log('No session exists, attempting to submit credentials.');
//         submitCredentials(user, pass, (res) => {
//             if (res.status == 'success') {
//                 // console.log('Submission successful.');
//                 onChange(res.payload.setrecordsuser_login.artist_id);
//                 if (cb) {
//                     cb();
//                 }
//             } else {
//                 // console.log('Submission not successful');
//                 onChange();
//                 if (cb) {
//                     cb(res);
//                 }
//             }
//         });
//     });
// }
//
// var logout = function (cb) {
//     // console.log('Logging out...');
//
//     var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/logout';
//     $.ajax({
//         type: 'get',
//         url: requestUrl,
//         crossDomain: true,
//         xhrFields: {
//             withCredentials: true
//         }
//     })
//     .done((res) => {
//         mixpanel.track('Logged out');
//         if (cb) {
//             cb();
//         }
//         onChange(false);
//     })
//     .fail((err) => {
//         mixpanel.track("Error", {
//             "Page": "Login Page",
//             "Message": "Error logging out"
//         });
//         // console.log(err);
//     });
// }
//
// var onChange = function () {}
//
// var submitCredentials = function (user, pass, cb) {
//     // console.log('==SUBMIT CREDENTIALS==');
//     var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/login';
//
//     $.ajax({
//         type: 'POST',
//         url: requestUrl,
//         crossDomain: true,
//         xhrFields: {
//             withCredentials: true
//         },
//         data: {
//             username: user,
//             password: pass
//         }
//     })
//     .done((res) => {
//         // console.log(res);
//         cb(res);
//     })
//     .fail((err) => {
//         // console.log(err);
//         cb(err);
//     });
// }
//
// module.exports = React.createClass({
//
//     displayName: 'App container',
//     mixins: [UpdateFunctions, UtilityFunctions, History],
//
//     getInitialState() {
//         return {
//             appState: initialAppState
//         };
//     },
//
//     updateAuth: function (artistId) {
//         // console.log('Update auth: ' + artistId);
//         if (artistId) {
//             // console.log('Updating auth to artist ID: ' + artistId);
//             push({
//                 type: 'SHALLOW_MERGE',
//                 data: {
//                     artistId: artistId,
//                     loggedIn: true
//                 }
//             });
//             // console.log('==artist id==');
//             // console.log(this.state.appState.get('artistId'));
//
//             this.updateArtist();
//         } else {
//             // console.log('This user not authorized.');
//             push({
//                 type: 'SHALLOW_MERGE',
//                 data: defaultValues
//             });
//         }
//     },
//
//     updateArtist() {
//         push({
//             type: 'SHALLOW_MERGE',
//             data: {
//                 loaded: false
//             }
//         });
//
//         var requestURL = 'https://api.setmine.com/v/10/setrecordsuser/login';
//         $.ajax({
//             type: "POST",
//             url: requestURL,
//             crossDomain: true,
//             xhrFields: {
//                 withCredentials: true
//             }
//         })
//         .done((res) => {
//             // console.log(res);
//             push({
//                 type: 'SHALLOW_MERGE',
//                 data: {
//                     artist_data: res.payload.artist,
//                     artistId: res.payload.artist_id,
//                     loaded: true
//                 }
//             });
//         })
//         .fail((err) => {
//             // console.log('An error occurred getting artist data.');
//             // console.log(err);
//         });
//     },
//
//     _attachStreams() {
//         var _this = this;
//         evtHandler.floodGate.subscribe(newState => {
//             // console.log('UPDATE', newState);
//             _this.setState({ appState: newState });
//         });
//     },
//
//     componentWillMount() {
//         this._attachStreams(); //global event handler
//         onChange = this.updateAuth;
//         // console.log('Will mount');
//         logIn();
//     },
//
//     render() {
//         var appState = this.state.appState;
//
//         return (
//             <div className='flex-column' id='App'>
//                 <Header artistImage={appState.get('artist_data').icon_image.imageURL} artistName={appState.get('artist_data').artist} headerText={appState.get('header')} logOut={this.logOut} loggedIn={appState.get('loggedIn')} />
//
//                 <div className='flex-row view-container'>
//                     {this.props.location.pathname == '/' ? '' : <div className='nav-bar-wrapper'><NavBar push={push} /></div> }
//                     <div className='view flex-column flex'>
//                         {this.renderChildren()}
//                     </div>
//                 </div>
//
//                 <Footer/>
//             </div>
//         );
//     },
//
//     renderChildren() {
//         var appState = this.state.appState;
//         return React.Children.map(this.props.children, function (child) {
//             var props = {};
//
//             switch (child.type) {
//                 case ContentView:
//                 props = {push: push, loaded: appState.get('loaded'), sets: appState.get('sets'), artistId: appState.get('artistId')};
//                 break;
//
//                 case LoginPage:
//                 props = {push: push, loggedIn: appState.get('loggedIn'), submitLogIn: logIn};
//                 break;
//
//                 case SetEditor:
//                 props = {push: push, loaded: appState.get('loaded'), originalArtist: appState.get('artist_data')};
//                 break;
//
//                 case SettingsEditor:
//                 props = {push: push, artistId: appState.get('artistId'), loaded: appState.get('loaded'), artistData: appState.get('artist_data')};
//                 break;
//
//                 case UploadSetWizard:
//                 case UploadTrackWizard:
//                 props = {push: push, originalArtist: appState.get('artist_data'), loaded: appState.get('loaded')};
//                 break;
//
//                 default:
//                 props = {push: push, appState: appState};
//                 break;
//             }
//
//             return React.cloneElement(child, props);
//         });
//     },
//
//     logOut: function () {
//         logout(() => {
//             this.history.pushState(null, '/');
//         });
//     },
// });
