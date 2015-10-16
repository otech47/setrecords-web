import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import Router from 'react-router';
import { IndexRoute, Link, Route, History, Redirect } from 'react-router';
import GlobalEventHandler from './services/globalEventHandler';
import MobileSetEditor from './components/MobileSetEditor';
import Header from './components/Header';
import FooterSetrecords from './components/FooterSetrecords';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import _ from 'underscore';
import async from 'async';

import UpdateFunctions from './mixins/UpdateFunctions';
import UtilityFunctions from './mixins/UtilityFunctions';

var initialAppState = Immutable.Map({
	'settings_editor': false,
	'set_editor': false,
	'upload_set_wizard': false,
	'loaded': false,
	"sets": [],
	'working_set': {},
	'artist_data': {
		"id": 4026,
		"artist": "Calvin Harris"
	},
	'genres': [],
	'events': [],
	'mixes': [],
	'artists': [],
	'setmine_metrics': {},
	'soundcloud_metrics': {},
	'youtube_metrics': {},
	"beacon_metrics": {},
	"social_metrics": {}
});

var evtHandler = GlobalEventHandler(initialAppState);
var evtTypes = evtHandler.types;

var push = evtHandler.push;

var PrintObject = React.createClass({
	displayName: 'PrintObject',
	render: function() {
		var s = JSON.stringify(this.props.value, null, 2);
		// console.log('PO APP STATE', this.props.value);
		return React.createElement('code', {
			style: { fontSize: 10 },
			onClick: lol
		}, s);
	}
});

var App = React.createClass({
	mixins: [UpdateFunctions],
	getInitialState: function() {
		return {
			appState: initialAppState
		};
	},
	componentDidMount: function() {
		this._attachStreams(); //global event handler
		this.updateArtist();
	},
	_attachStreams: function() {
		var _this = this;
		evtHandler.floodGate.subscribe(newState => {
			// console.log('UPDATE', newState);
			_this.setState({ appState: newState });
		});
	},
	render: function() {
		console.log('app render');
		var appState = this.state.appState;
		return (
			<div className="main-container flex-column">
				<Header appState={appState} openSettingsEditor={this.openSettingsEditor} closeSettingsEditor={this.closeSettingsEditor} openUploadSetWizard={this.openUploadSetWizard} />
				{
					React.cloneElement(this.props.children, {
						push: push,
						sets: appState.get('sets'),
						loaded: appState.get('loaded'),
						artistId: appState.get('artist_data').id
					})
				}
				<FooterSetrecords />
			</div>
		);
	},
	updateArtist: function() {
		// console.log("Updating artist info...");
		var artistId = this.state.appState.get("artist_data").id;
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/info/" + artistId;
		$.ajax({
			type: "GET",
			url: requestURL,
			success: function(res) {
				// console.log('Artist...');
				if (res.status == 'failure') {
					console.log("An error occurred getting artist data.");
					console.log(res.payload.error);
				} else {
					push({
						type: 'SHALLOW_MERGE',
						data: {
							artist_info: res.payload.artist_info,
							loaded: true
						}
					});
				}
			}.bind(this),
			error: function(err) {
				console.log('An error occurred getting artist data.');
				console.log(err);
			}
		});
	},
	closeSetEditor: function(isChanged) {
		if (isChanged) {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					loaded: false
				}

			});
			this.updateSets(function(err, sets) {
				if (err) {
					// console.log('An error occurred.', err);
				} else {
					push({
						type: 'SHALLOW_MERGE',
						data: {
							sets: sets,
							set_editor: false,
							loaded: true
						}
					});
				}
			});
		} else {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					set_editor: false
				}
			});
		}
	},
	closeSettingsEditor: function(isChanged) {
		// console.log("Settings editor would have been closed!");
		if (isChanged) {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					loaded: false
				}
			});
			this.updateArtist(function(err, settings) {
				if (err) {
					// console.log('An error occurred.', err);
				} else {
					push({
						type: 'SHALLOW_MERGE',
						data: {
							artist_data: settings,
							settings_editor: false,
							loaded: true
						}
					});
				}
			});
		} else {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					settings_editor: false
				}
			})
		}
	},
	openSettingsEditor: function() {
		// console.log("Settings editor would have been opened!");
		push({
			type: 'SHALLOW_MERGE',
			data: {
				settings_editor: true,
				upload_set_wizard: false,
				set_editor: false
			}
		});
	},
	/*showView: function(appState) {
		var updateFunctions = {updateArtist: this.updateArtist, updateSetmine: this.updateSetmine, updateSocial: this.updateSocial, updateBeacons: this.updateBeacons, updateYoutube: this.updateYoutube, updateSoundcloud: this.updateSoundcloud, updateSets: this.updateSets};
		if (appState.get('set_editor')) {
			return (
				<MobileSetEditor set={appState.get('working_set')} close={this.closeSetEditor} appState={appState} {...UtilityFunctions} />
			);
		} else if (appState.get('settings_editor')) {
			return (
				<SettingsEditor settings={appState.get('artist_data')} close={this.closeSettingsEditor} appState={appState} {...UtilityFunctions} />
			);
		} else if (appState.get('upload_set_wizard')) {
			var originalArtist = {
				id: appState.get('artist_data').id,
				artist: appState.get('artist_data').artist
			};
			return (
				<UploadWizardWrapper originalArtist={originalArtist}
				close={this.closeUploadSetWizard} eventLookup={appState.get('event_lookup')} events={appState.get('events')} mixes={appState.get('mixes')} genres={appState.get('genres')}
				venues={appState.get('venues')}
				artists={appState.get('artists')}
				artistLookup={appState.get('artist_lookup')} />
			);
		} else {
			return (
				<ViewContainer appState={appState} {...updateFunctions} {...UtilityFunctions} push={push} routeHandler={RouteHandler} openSetEditor={this.openSetEditor} openUploadSetWizard={this.openUploadSetWizard} loaded={appState.get('loaded')} />
			);
		}
	},*/
	openUploadSetWizard: function() {
		// console.log("opening upload set wizard...");
		push({
			type: 'SHALLOW_MERGE',
			data: {
				set_editor: false,
				settings_editor: false,
				upload_set_wizard: true
			}
		});
	},
	closeUploadSetWizard: function(isChanged) {
		// console.log("closing upload set wizard");
		if (isChanged) {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					loaded: false
				}
			});
			this.updateSets(function(err, sets) {
				if (err) {
					// console.log('An error occurred.', err);
				} else {
					push({
						type: 'SHALLOW_MERGE',
						data: {
							sets: sets,
							upload_set_wizard: false,
							loaded: true
						}
					});
				}
			});
		} else {
			push({
				type: 'SHALLOW_MERGE',
				data: {
					upload_set_wizard: false
				}
			});
		}
	},
	openSetEditor: function(set) {
		var clonedSet = this.cloneObject(set);
		push({
			type: 'SHALLOW_MERGE',
			data: {
				working_set: clonedSet,
				set_editor: true,
				settings_editor: false,
				upload_set_wizard: false
			}
		});
	}
});

var history = createBrowserHistory();

ReactDOM.render(
	<Router>
		<Route path='/' component={App} >
			<IndexRoute component={ContentView} />
			<Route path='metrics/setmine' component={SetmineReport} />
			<Route path='metrics/beacons' component={BeaconReport} />
			<Route path='metrics/social' component={SocialReport} />
			<Route path='metrics/soundcloud' component={SoundcloudReport} />
			<Route path='metrics/youtube' component={YoutubeReport} />
			<Route path='edit/:id' component={MobileSetEditor} />
			<Route path='account' component={SettingsEditor} />
			<Route path='upload' component={UploadWizardWrapper} />
		</Route>
	</Router>,
	document.getElementById('body-mount-point'));
