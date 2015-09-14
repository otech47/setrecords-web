import React from 'react';
import Immutable from 'immutable';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Navigation } from 'react-router';


import GlobalEventHandler from './services/globalEventHandler';

import PlayerWrapper from './components/Player';
import DetailView from './components/DetailView';
import LandingView from './components/LandingView';
import FeaturedView from './components/FeaturedView';
import HomeView from './components/HomeView';
import SearchResultsView from './components/SearchResultsView';

// import ArtistDetail from './components/ArtistDetail';
// import EventDetail from './components/EventDetail';
// import FestivalDetail from './components/FestivalDetail';

import Favorites from './components/Favorites';
import New from './components/New';
import  MoibleSetEditor from './components/MoibleSetEditor';
import Artists from './components/Artists';
import Festivals from './components/Festivals';
import Mixes from './components/Mixes';
import Activities from './components/Activities';
import DMCA from './components/DMCA';
import SetTile from './components/SetTile';
import EventTile from './components/EventTile';
import TrackTile from './components/TrackTile';

import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import FooterSetrecords from './components/FooterSetrecords';

import ContentView from './components/ContentView';

import LoginPage from './components/LoginPage';
import Home from './components/Home';
import MetricsView from './components/MetricsView';
import SuperfansView from './components/SuperfansView';
import iBeaconsView from './components/iBeaconsView';
import UploadWizardWrapper from './components/UploadWizardWrapper';
import auth from './components/auth';
import AccountView from './components/AccountView';

//subscribe in componentDidMount()
//unsubscribe in componentWillUnmount()
//call setState which pushes to event stream when receiving an event

var initialAppState = Immutable.Map({
	'wizardData': {
		'step': 0,
		'pendingData': {
		}
	},
	'artistData': {
		"id": 40,
		"artist": "Calvin Harris",
		"bio": "No Biography Available",
		"fb_link": "https://www.facebook.com/calvinharris",
		"twitter_link": "https://twitter.com/CalvinHarris",
		"web_link": "https://www.google.com/",
		"instagram_link": "http://instagram.com/calvinharris",
		"soundcloud_link": "http://soundcloud.com/calvinharris",
		"youtube_link": "https://www.youtube.com/CalvinHarrisVEVO",
		"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
		"musicbrainz_id": "8dd98bdc-80ec-4e93-8509-2f46bafc09a7",
		"set_count": 14,
		"event_count": 5,
		"sets": [
			{
			"id": 2163,
			"artist_id": [40],
			"artist": "Calvin Harris",
			"event": "Lollapalooza Chicago 2014",
			"event_id": 125,
			"episode": "",
			"genre": "Progressive House",
			"episode_imageURL": null,
			"eventimageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
			"main_eventimageURL": "8035464a1f8870cce06b320fbab09a73d4994b54.jpg",
			"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"songURL": "850123b85fd2246c014fc6f9ce427708b72a97da.mp3",
			"datetime": "2014-08-06T03:31:35.000Z",
			"popularity": 7686,
			"is_radiomix": 0,
			"set_length": "48:49",
			"tracklistURL": null,
			"imageURL": "31005125a020c86fe8f16f00925338ea9604a0b5.jpg",
			"artist_preview": [
				{
				"id": 40,
				"artist": "Calvin Harris",
				"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
				"set_count": 14,
				"event_count": 5
				}
			],
			"model_type": "set"
			},
			{
			"id": 63,
			"artist_id": [
			40
			],
			"artist": "Calvin Harris",
			"event": "TomorrowWorld 2013",
			"event_id": 15,
			"episode": null,
			"genre": "House",
			"episode_imageURL": null,
			"eventimageURL": "48a4b7f8ed44ba29545745d97fd19dd67231e38c.jpg",
			"main_eventimageURL": "d7bcd131ba8921bb11265295435cfd10.jpg",
			"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"songURL": "67d3dfc805b72ccee10da2a9eb53ff1827607800.mp3",
			"datetime": "2014-02-18T22:28:18.000Z",
			"popularity": 3235,
			"is_radiomix": 0,
			"set_length": "90:29",
			"tracklistURL": null,
			"imageURL": "48a4b7f8ed44ba29545745d97fd19dd67231e38c.jpg",
			"artist_preview": [
			{
			"id": 40,
			"artist": "Calvin Harris",
			"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"set_count": 14,
			"event_count": 5
			}
			],
			"model_type": "set"
			},
			{
			"id": 1521,
			"artist_id": [
			40
			],
			"artist": "Calvin Harris",
			"event": "EDC Las Vegas 2014",
			"event_id": 100,
			"episode": "",
			"genre": "House",
			"episode_imageURL": null,
			"eventimageURL": "5bb343575c942af132a18245aa014bc21af829d6.jpg",
			"main_eventimageURL": "64c42c9c6fdc0f111f527da70eee677eafc118fd.jpg",
			"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"songURL": "156b16292df7b3d37efc4f7ef947ef09af0a7abe.mp3",
			"datetime": "2014-07-18T18:46:26.000Z",
			"popularity": 3185,
			"is_radiomix": 0,
			"set_length": "74:30",
			"tracklistURL": null,
			"imageURL": "5bb343575c942af132a18245aa014bc21af829d6.jpg",
			"artist_preview": [
			{
			"id": 40,
			"artist": "Calvin Harris",
			"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"set_count": 14,
			"event_count": 5
			}
			],
			"model_type": "set"
			},
			{
			"id": 800,
			"artist_id": [
			40
			],
			"artist": "Calvin Harris",
			"event": "Coachella 2014",
			"event_id": 67,
			"episode": null,
			"genre": "Progressive House",
			"episode_imageURL": null,
			"eventimageURL": "b0cfe7541f56f971c8b7082689c8da4b3c581e92.jpg",
			"main_eventimageURL": "0b7fb3c9bacfb5b38e49fc7fa217ff2e0ae76604.jpg",
			"artistimageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"songURL": "92ad60f3cfe364fb216f0d87487586d71f0119df.mp3",
			"datetime": "2014-04-23T16:36:40.000Z",
			"popularity": 2731,
			"is_radiomix": 0,
			"set_length": "55:13",
			"tracklistURL": null,
			"imageURL": "b0cfe7541f56f971c8b7082689c8da4b3c581e92.jpg",
			"artist_preview": [
			{
			"id": 40,
			"artist": "Calvin Harris",
			"imageURL": "b7debba3662c51696aa361f98c923893.jpg",
			"set_count": 14,
			"event_count": 5
			}
			],
			"model_type": "set"
			}],
		"upcomingEvents": [],
		"links": {
			"facebook": "https://www.facebook.com/calvinharris",
			"twitter": "https://twitter.com/CalvinHarris",
			"instagram": "http://instagram.com/calvinharris",
			"soundcloud": "http://soundcloud.com/calvinharris",
			"youtube": "https://www.youtube.com/CalvinHarrisVEVO"
		}
	},
	'metrics': {
		"setmine": {
			'plays': {
				current: 1,
				last: 2,
				overtime: [1,2,3]
			},
			'views': {
				current: 1,
				last: 2,
				overtime: [1,2,3]
			},
			'favorites': {
				current: 1,
				last: 2,
				overtime: [1,2,3]
			}
		},
		"social": {
			'twitter': {
				current: 1.1,
				last: 2.2,
				overtime: [1,2,3]
			},
			'facebook': {
				current: 1.1,
				last: 2.2,
				overtime: [1,2,3]
			},
			'instagram': {
				current: 1.1,
				last: 2.2,
				overtime: [1,2,3]
			}
		},
		"media": {
			'soundcloud': {
				followers: {
					current: 1,
					last: 2,
					overtime: [1,2,3]
				},
				plays: {
					current: 1,
					last: 2,
					overtime: [1,2,3]	
				}
			},
			'youtube': {
				followers: {
					current: 1,
					last: 2,
					overtime: [1,2,3]
				},
				plays: {
					current: 1,
					last: 2,
					overtime: [1,2,3]	
				}
			}
		},
		"beacons": {
			'revenue': {
				current: 0,
				last: 0
			},
			'unlocks': {
				current: 0,
				last: 0
			},
			'overtime': [1,2,3]
		}
	}
});

var evtHandler = GlobalEventHandler(initialAppState);
var evtTypes = evtHandler.types;

var push = evtHandler.push;

function lol() {
	push({
		type: evtTypes.SHALLOW_MERGE,
		data: { lastClick: new Date() }
	});
}

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
	getInitialState: function() {
		return {
			appState: initialAppState
		};
	},
	componentDidMount: function() {
		this._attachStreams(); //global event handler
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
		//pass in appState and push to every component you want to access event dispatcher
		return (
			<div className="main-container flex-column">
				<Header appState={appState} push={push} />
				<ViewContainer appState={appState} push={push}
					routeHandler={RouteHandler} />
				<FooterSetrecords />
			</div>
		);
	}
});

// var wrapComponent = function(Component, props) {
// 	return React.createClass({
// 		render: function() {
// 			return (
// 				React.createElement(Component, props);
// 			);
// 		}
// 	});
// };

var routes = (
	<Route path='/' handler={App}>
		<DefaultRoute name='content' handler={MoibleSetEditor} />
		<Route path='content' handler={ContentView} />
		<Route name='metrics' path='metrics' handler={MetricsView} />
		<Route name='account' path='account' handler={AccountView} />
	</Route>
);

var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});