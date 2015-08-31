import React from 'react';
import Immutable from 'immutable';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Navigation } from 'react-router';


import GlobalEventHandler from './services/globalEventHandler';

import Footer from './components/Footer';
import Header from './components/Header';
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

import Artists from './components/Artists';
import Festivals from './components/Festivals';
import Mixes from './components/Mixes';
import Activities from './components/Activities';

import SetTile from './components/SetTile';
import EventTile from './components/EventTile';
import TrackTile from './components/TrackTile';

import LoginPage from './components/LoginPage';
import ContentView from './components/ContentView';
import NavBar from './components/NavBar';
import Home from './components/Home';
import MetricsView from './components/MetricsView';
import SuperfansView from './components/SuperfansView';
import iBeaconsView from './components/iBeaconsView';

//subscribe in componentDidMount()
//unsubscribe in componentWillUnmount()
//call setState which pushes to event stream when receiving an event

var initialAppState = Immutable.Map({
	artistData: {
		"id": 1,
		"artist": "12th Planet",
		"bio": "No Biography Available",
		"fb_link": "https://www.facebook.com/12thplanet2012",
		"twitter_link": "https://twitter.com/12thplanet",
		"web_link": null,
		"instagram_link": null,
		"soundcloud_link": null,
		"youtube_link": null,
		"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
		"musicbrainz_id": "d113f6b4-f01f-4632-9cd3-743cc299574e",
		"set_count": 7,
		"event_count": 8,
		"sets": [
			{
			"id": 1463,
			"artist_id": [
			1
			],
			"artist": "12th Planet",
			"event": "EDC Las Vegas 2014",
			"event_id": 100,
			"episode": null,
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "5bb343575c942af132a18245aa014bc21af829d6.jpg",
			"main_eventimageURL": "64c42c9c6fdc0f111f527da70eee677eafc118fd.jpg",
			"artistimageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"songURL": "f2bce0b2ceef5e5d89aa2031ac234943a2b22399.mp3",
			"datetime": "2014-06-23T22:08:57.000Z",
			"popularity": 1020,
			"is_radiomix": 0,
			"set_length": "62:30",
			"tracklistURL": null,
			"imageURL": "5bb343575c942af132a18245aa014bc21af829d6.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			},
			{
			"id": 172,
			"artist_id": [
			1
			],
			"artist": "12th Planet",
			"event": "EDC Orlando 2013",
			"event_id": 7,
			"episode": null,
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "6acd4df4d7dec31ea17616d5d4310ba30a8bea3a.jpg",
			"main_eventimageURL": "bc165d8e102246760f260c8b3347a0342d6d5619.jpg",
			"artistimageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"songURL": "17adade3ec9798f8fd5c7368a96e11f1b75e4d83.mp3",
			"datetime": "2014-02-20T05:05:39.000Z",
			"popularity": 448,
			"is_radiomix": 0,
			"set_length": "58:35",
			"tracklistURL": null,
			"imageURL": "6acd4df4d7dec31ea17616d5d4310ba30a8bea3a.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			},
			{
			"id": 3461,
			"artist_id": [
			1
			],
			"artist": "12th Planet",
			"event": "EDC Las Vegas 2015",
			"event_id": 798,
			"episode": null,
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "9999345a668eaeb9abf5495ed4e4e9c0.jpg",
			"main_eventimageURL": "f7ede6e687b72399617e1aa0373b10b0.jpg",
			"artistimageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"songURL": "bd39affb2092da7f7fee32c9386de995eed6f814.mp3",
			"datetime": "2015-06-20T18:47:18.000Z",
			"popularity": 397,
			"is_radiomix": 0,
			"set_length": "24:15",
			"tracklistURL": "http://www.1001tracklists.com/tracklist/79214_12th-planet-at-basspod-edc-las-vegas-united-states-2015-06-19.html",
			"imageURL": "9999345a668eaeb9abf5495ed4e4e9c0.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			},
			{
			"id": 2505,
			"artist_id": [
			1,
			237
			],
			"artist": "12th Planet & Skrillex",
			"event": "Ultra Music Festival 2012",
			"event_id": 220,
			"episode": "",
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "789fcb52d34b9d0f84233a5523a1d900.jpg",
			"main_eventimageURL": "24ad1b44952351efecf45a7178a4676b.jpg",
			"artistimageURL": "635e0a85690c124af87648db7815be33.jpg",
			"songURL": "f0c524049b9f78c5decc92dd63469ba7e46baf07.mp3",
			"datetime": "2014-10-28T03:36:35.000Z",
			"popularity": 215,
			"is_radiomix": 0,
			"set_length": "84:54",
			"tracklistURL": null,
			"imageURL": "789fcb52d34b9d0f84233a5523a1d900.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			},
			{
			"id": 237,
			"artist": "Skrillex",
			"imageURL": "635e0a85690c124af87648db7815be33.jpg",
			"set_count": 23,
			"event_count": 1
			}
			],
			"model_type": "set"
			},
			{
			"id": 2535,
			"artist_id": [
			1
			],
			"artist": "12th Planet",
			"event": "Escape All Hallow's Eve 2014",
			"event_id": 145,
			"episode": "",
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "cde0bebc9d261ec77c44bc0c834264c3.jpg",
			"main_eventimageURL": "e66b7bd8ca804e127d84b8ba206d739f.jpg",
			"artistimageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"songURL": "e2302d88f0dde774c67b14aff97b39849683e5f0.mp3",
			"datetime": "2014-11-02T17:43:22.000Z",
			"popularity": 92,
			"is_radiomix": 0,
			"set_length": "60:07",
			"tracklistURL": null,
			"imageURL": "cde0bebc9d261ec77c44bc0c834264c3.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			},
			{
			"id": 746,
			"artist_id": [
			100,
			1
			],
			"artist": "Fedde Le Grand & 12th Planet",
			"event": "Ministry of Sound",
			"event_id": 63,
			"episode": null,
			"genre": "House",
			"episode_imageURL": null,
			"eventimageURL": "d5623ae4592581664ba2788fa01018a42e551b08.jpg",
			"main_eventimageURL": "ca6a250fc84f30e571a62286fc8c2c16c7ce64b4.png",
			"artistimageURL": "7f33b7437aa314e8fc8ed2acc2019005.jpg",
			"songURL": "67249d2bbc037222a9d7589f6213831ce5f534c5.mp3",
			"datetime": "2014-04-04T19:09:51.000Z",
			"popularity": 38,
			"is_radiomix": 0,
			"set_length": "60:13",
			"tracklistURL": null,
			"imageURL": "d5623ae4592581664ba2788fa01018a42e551b08.jpg",
			"artist_preview": [
			{
			"id": 100,
			"artist": "Fedde Le Grand",
			"imageURL": "7f33b7437aa314e8fc8ed2acc2019005.jpg",
			"set_count": 51,
			"event_count": 1
			},
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			},
			{
			"id": 3463,
			"artist_id": [
			1
			],
			"artist": "12th Planet",
			"event": "Ultra Music Festival 2015",
			"event_id": 452,
			"episode": null,
			"genre": "Dubstep",
			"episode_imageURL": null,
			"eventimageURL": "1b4657404c6ec5aeb02ff98b07d9e0d7.jpg",
			"main_eventimageURL": "e724ff1860cfcbd557bd688d041d2935.jpg",
			"artistimageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"songURL": "b0a424f22e8a1811eed2447ccd288428258b0e1b.mp3",
			"datetime": "2015-06-20T18:51:23.000Z",
			"popularity": 15,
			"is_radiomix": 0,
			"set_length": "10:45",
			"tracklistURL": "http://1001tracklists.com/tracklist/72896_12th-planet-at-worldwide-stage-ultra-music-festival-miami-united-states-2015-03-27.html",
			"imageURL": "1b4657404c6ec5aeb02ff98b07d9e0d7.jpg",
			"artist_preview": [
			{
			"id": 1,
			"artist": "12th Planet",
			"imageURL": "a452aceb0830763a39f19c2a7af8a1cb.jpg",
			"set_count": 7,
			"event_count": 8
			}
			],
			"model_type": "set"
			}
		],
		"upcomingEvents": [],
		"links": {
			"facebook": "https://www.facebook.com/12thplanet2012",
			"twitter": "https://twitter.com/12thplanet",
			"instagram": null,
			"soundcloud": null,
			"youtube": null
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
				<Header appState={appState} />
				<NavBar appState={appState} pushFn={push} />
				<RouteHandler appState={appState} pushFn={push}/>
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
		<DefaultRoute name='content' handler={ContentView} />
		<Route name='metrics' path='metrics' handler={MetricsView} />
		<Route name='superfans' path='superfans' handler={SuperfansView} />
		<Route name='ibeacons' path='ibeacons' handler={iBeaconsView} />
		<Route name='login' path='login' handler={LoginPage} />
	</Route>
);

var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});