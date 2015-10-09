import React from 'react';
import Immutable from 'immutable';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Navigation } from 'react-router';

import GlobalEventHandler from './services/globalEventHandler';
import ReactDatalist from './components/ReactDatalist';
import MobileSetEditor from './components/MobileSetEditor';
import SettingsEditor from './components/SettingsEditor';
import DMCA from './components/DMCA';
import SetTile from './components/SetTile';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import FooterSetrecords from './components/FooterSetrecords';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import _ from 'underscore';
import async from 'async';
import UploadWizardWrapper from './components/UploadWizardWrapper';

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
		console.log('PO APP STATE', this.props.value);
		return React.createElement('code', {
			style: { fontSize: 10 },
			onClick: lol
		}, s);
	}
});

var App = React.createClass({
	displayName: 'App container',
	mixins: [UpdateFunctions, UtilityFunctions],
	getInitialState: function() {
		return {
			appState: initialAppState
		};
	},
	componentDidMount: function() {
		this._attachStreams(); //global event handler
		async.parallel([this.updateArtist, this.updateSets, this.updateSetmine, this.updateSoundcloud, this.updateYoutube, this.updateBeacons, this.updateSocial, this.updateMisc], function(err, results) {
			if (err) {
				console.log('There was an error loading artist and set data.');
			} else {
				var eventLookup = {};
				var events = results[7].events;
				for (var i = 0; i < events.length; i++) {
					eventLookup[events[i].event] = events[i];
				}

				push({
					type: 'SHALLOW_MERGE',
					data: {
						artist_data: results[0],
						sets: results[1],
						setmine_metrics: results[2],
						soundcloud_metrics: results[3],
						youtube_metrics: results[4],
						beacon_metrics: results[5],
						social_metrics: results[6],
						mixes: results[7].mixes,
						genres: results[7].genres,
						events: events,
						event_lookup: eventLookup,
						venues: results[7].venues,
						loaded: true
					}
				});
			}
		});
	},
	_attachStreams: function() {
		var _this = this;
		evtHandler.floodGate.subscribe(newState => {
			console.log('UPDATE', newState);
			_this.setState({ appState: newState });
		});
	},
	render: function() {
		var appState = this.state.appState;
		return (
			<div className="main-container flex-column">
				<Header appState={appState} openSettingsEditor={this.openSettingsEditor} closeSettingsEditor={this.closeSettingsEditor} openUploadSetWizard={this.openUploadSetWizard} />
				{this.showView(appState)}
				<FooterSetrecords />
			</div>
		);
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
					console.log('An error occurred.', err);
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
					console.log('An error occurred.', err);
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
	showView: function(appState) {
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
			return (
				<UploadWizardWrapper originalArtist={appState.get('artist_data').artist} eventLookup={appState.get('event_lookup')} events={appState.get('events')} mixes={appState.get('mixes')} genres={appState.get('genres')}
					venues={appState.get('venues')} />
			);
		} else {
			return (
				<ViewContainer appState={appState} {...updateFunctions} {...UtilityFunctions} push={push} routeHandler={RouteHandler} openSetEditor={this.openSetEditor} openUploadSetWizard={this.openUploadSetWizard} loaded={appState.get('loaded')} />
			);
		}
	},
	openUploadSetWizard: function() {
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
	closeUploadSetWizard: function(isChanged) {
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
					console.log('An error occurred.', err);
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
/*NEVER CHANGE THHE ROUTE OR ELSE IT WILL GO KAPPOOOA AND SHIT THE BED*/
var routes = (
	<Route path='/' handler={App}>
		<DefaultRoute name='content' handler={ContentView} />
		<Route path='content' handler={ContentView} />
		<Route path='metrics' handler={MetricsView} />
	</Route>
);

var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});

// <ReactDatalist key='event-datalist' options={appState.get('events')} objKey='event' listId='event-list' isArray={false} />
// <ReactDatalist key='mix-datalist' options={appState.get('mixes')} objKey='mix' listId='mix-list' isArray={false} />
// <ReactDatalist key='genre-datalist' options={appState.get('genres')} isArray={true} listId='genre-list' />
