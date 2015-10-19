import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import Router from 'react-router';
import { IndexRoute, Link, Route, History } from 'react-router';
import GlobalEventHandler from './services/globalEventHandler';
import MobileSetEditor from './components/MobileSetEditor';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import Footer from './components/Footer';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import UploadWizardWrapper from './components/UploadWizardWrapper';
import _ from 'underscore';
import async from 'async';

import BeaconReport from './components/BeaconReport';
import SetmineReport from './components/SetmineReport';
import SettingsEditor from './components/SettingsEditor';
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
	artist_data: {
		id: 4026,
		artist: 'Nodex'
	},
	header: 'Content',
	genres: [],
	events: [],
	mixes: [],
	artists: [],
	setmine_metrics: {
		plays: {
			current: [],
			overtime: []
		},
		views: {
			current: [],
			overtime: []
		},
		favorites: {
			current: [],
			overtime: []
		}
	},
	soundcloud_metrics: {},
	youtube_metrics: {},
	beacon_metrics: {},
	social_metrics: {}
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
		var requestURL = "http://localhost:3000/api/v/7/setrecords/artist/info/" + artistId;
		$.ajax({
			type: "GET",
			url: requestURL,
		})
		.done(function(res) {
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
		}.bind(this))
		.fail(function(err) {
			console.log('An error occurred getting artist data.');
			console.log(err);
		}); 
	},

	_attachStreams() {
		var _this = this;
		evtHandler.floodGate.subscribe(newState => {
			console.log('UPDATE', newState);
			_this.setState({ appState: newState });
		});
	},

	componentWillMount() {
		this._attachStreams(); //global event handler
		this.updateArtist();
	},

	closeSetEditor(isChanged) {
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

	closeSettingsEditor(isChanged) {
		console.log("Settings editor would have been closed!");
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

	closeUploadSetWizard(isChanged) {
		console.log("closing upload set wizard");
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

	openSettingsEditor() {
		console.log("Settings editor would have been opened!");
		push({
			type: 'SHALLOW_MERGE',
			data: {
				settings_editor: true,
				upload_set_wizard: false,
				set_editor: false
			}
		});
	},

	openSetEditor(set) {
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
	},

	openUploadSetWizard() {
		console.log("opening upload set wizard...");
		push({
			type: 'SHALLOW_MERGE',
			data: {
				set_editor: false,
				settings_editor: false,
				upload_set_wizard: true
			}
		});
	},

	render() {
		var appState = this.state.appState;
		return (
			<div className="main-container flex-column">
				<Header appState={appState} openSettingsEditor={this.openSettingsEditor} closeSettingsEditor={this.closeSettingsEditor} openUploadSetWizard={this.openUploadSetWizard} />
				<div className='flex-row view-container'>
					<NavBar />
					{
						React.cloneElement(this.props.children, {
							appState: appState,
							push: push
						})
					}
				</div>
				<Footer/>
			</div>
		);
	}

//TODO move into separate routes
	// showView(appState) {
	// 	var updateFunctions = {updateArtist: this.updateArtist, updateSetmine: this.updateSetmine, updateSocial: this.updateSocial, updateBeacons: this.updateBeacons, updateYoutube: this.updateYoutube, updateSoundcloud: this.updateSoundcloud, updateSets: this.updateSets};
	// 	if (appState.get('set_editor')) {
	// 		return (
	// 			<MobileSetEditor set={appState.get('working_set')} close={this.closeSetEditor} appState={appState} {...UtilityFunctions} />
	// 		);
	// 	} else if (appState.get('settings_editor')) {
	// 		return (
	// 			<SettingsEditor settings={appState.get('artist_data')} close={this.closeSettingsEditor} appState={appState} {...UtilityFunctions} />
	// 		);
	// 	} else if (appState.get('upload_set_wizard')) {
	// 		return (
	// 			<UploadWizardWrapper originalArtist={appState.get('artist_data').artist} eventLookup={appState.get('event_lookup')} events={appState.get('events')} mixes={appState.get('mixes')} genres={appState.get('genres')}
	// 				venues={appState.get('venues')} />
	// 		);
	// 	} else {
	// 		return (
	// 			<ViewContainer 
	// 				appState={appState} 
	// 				{...updateFunctions} 
	// 				{...UtilityFunctions} 
	// 				push={push} 
	// 				routeHandler={RouteHandler} 
	// 				openSetEditor={this.openSetEditor} 
	// 				openUploadSetWizard={this.openUploadSetWizard} 
	// 				loaded={appState.get('loaded')} />
	// 		);
	// 	}
	// }

});

var history = createBrowserHistory();

ReactDOM.render(
	<Router>
		<Route path='/' component={App} >
			<IndexRoute component={ContentView} />
			<Route path='metrics' component={MetricsView}>
				<Route path='setmine' component={SetmineReport} />
				<Route path='beacons' component={BeaconReport} />
				<Route path='social' component={SocialReport} />
				<Route path='soundcloud' component={SoundcloudReport} />
				<Route path='youtube' component={YoutubeReport} />
			</Route>

			<Route path='edit/:id' component={MobileSetEditor} />
			<Route path='account' component={SettingsEditor} />
			<Route path='upload' component={UploadWizardWrapper} />

		</Route>
	</Router>,
document.getElementById('body-mount-point'));
