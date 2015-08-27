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

//subscribe in componentDidMount()
//unsubscribe in componentWillUnmount()
//call setState which pushes to event stream when receiving an event

var initialAppState = Immutable.Map({
  setSMObject: null,
	currentSet: {
    selectedSet: {
      id: 1903,
      artist_id: [
        574
      ],
      artist: 'Kygo',
      event: 'Tomorrowland 2014 W2',
      event_id: 116,
      episode: '',
      genre: 'Progressive House',
      episode_imageURL: null,
      eventimageURL: 'dbd5bd7900531575c9bbfaba0ae434c4.jpg',
      main_eventimageURL: '12141ddad8636c5804c86dc685550ee1.jpg',
      artistimageURL: 'a7f7aaec8ecd0cdec444b8abb06dbc66.jpg',
      songURL: '8bf16c6bb2609bcbb7a00940d65038a9e992c98b.mp3',
      datetime: '2014-07-28T19:53:38.000Z',
      popularity: 1017,
      is_radiomix: 0,
      set_length: '10:32',
      tracklistURL: null,
      imageURL: 'dbd5bd7900531575c9bbfaba0ae434c4.jpg',
      artist_preview: [
        {
          id: 574,
          artist: 'Kygo',
          imageURL: 'a7f7aaec8ecd0cdec444b8abb06dbc66.jpg',
          set_count: 6,
          event_count: 0
        }
      ],
      model_type: 'set'
    },
    isPlaying: false,
    timePosition: 0
	},

	// TODO FIX
	browseData: [
		{
			'artist': '12th Planet',
			'imageURL': '313e875b84fe6e0844b02509a8635cebb9f7d128.jpg'
		}
	],
	setData: [],
	eventData: [],
	landingData: [],
	mySets: [],
	userData: {
		isUserLoggedIn: false,
		favorites: [],
		new: [],
		profilePic: undefined
	},
	detaildata: {
		"id": 574,
		"artist": "Kygo",
		"bio": "No Biography Available",
		"fb_link": "https://www.facebook.com/kygoofficial",
		"twitter_link": "https://twitter.com/kygomusic",
		"web_link": "https://www.google.com/",
		"instagram_link": null,
		"soundcloud_link": null,
		"youtube_link": null,
		"imageURL": "a7f7aaec8ecd0cdec444b8abb06dbc66.jpg",
		"musicbrainz_id": null,
		"set_count": 6,
		"event_count": 0,
		"sets": [
			{
				"id": 2314,
				"artist_id": [
					574
				],
				"artist": "Kygo",
				"event": "Diplo & Friends",
				"event_id": 44,
				"episode": "",
				"genre": "Deep House",
				"episode_imageURL": null,
				"eventimageURL": "6e85b515644e0ec38e115142656004e8.jpg",
				"main_eventimageURL": "ca6a250fc84f30e571a62286fc8c2c16c7ce64b4.png",
				"artistimageURL": "a7f7aaec8ecd0cdec444b8abb06dbc66.jpg",
				"songURL": "9980d7213c9eb692b44c2c0572282753ad1a196c.mp3",
				"datetime": "2014-09-20T04:03:04.000Z",
				"popularity": 5229,
				"is_radiomix": 1,
				"set_length": "59:58",
				"tracklistURL": "http://www.1001tracklists.com/tracklist/46356_diplo-kygo-zebra-katz-diplo-friends-2014-03-23.html",
				"imageURL": "6e85b515644e0ec38e115142656004e8.jpg",
				"artist_preview": [
					{
						"id": 574,
						"artist": "Kygo",
						"imageURL": "a7f7aaec8ecd0cdec444b8abb06dbc66.jpg",
						"set_count": 6,
						"event_count": 0
					}
				],
				"model_type": "set"
			}
		]
	},
	location: {
		city: 'Dania Beach',
		state: 'FL'
	},
	searchResults: {
		sets: [
			{
				"id": 2314,
				"artist_id": [
					574
				],
				"artist": "Kygo",
				"event": "Diplo & Friends",
				"event_id": 44,
				"episode": "",
				"genre": "Deep House",
				"episode_imageURL": null,
				"eventimageURL": "6e85b515644e0ec38e115142656004e8.jpg",
				"main_eventimageURL": "ca6a250fc84f30e571a62286fc8c2c16c7ce64b4.png",
				"artistimageURL": "a7f7aaec8ecd0cdec444b8abb06dbc66.jpg",
				"songURL": "9980d7213c9eb692b44c2c0572282753ad1a196c.mp3",
				"datetime": "2014-09-20T04:03:04.000Z",
				"popularity": 5229,
				"is_radiomix": 1,
				"set_length": "59:58",
				"tracklistURL": "http://www.1001tracklists.com/tracklist/46356_diplo-kygo-zebra-katz-diplo-friends-2014-03-23.html",
				"imageURL": "6e85b515644e0ec38e115142656004e8.jpg",
				"artist_preview": [
					{
						"id": 574,
						"artist": "Kygo",
						"imageURL": "a7f7aaec8ecd0cdec444b8abb06dbc66.jpg",
						"set_count": 6,
						"event_count": 0
					}
				],
				"model_type": "set"
			}
		],
		events: [
			{
				"id": 952,
				"event": "#LetEmKnow @ Revolution Live",
				"bio": "No Description Available",
				"fb_link": "https://www.facebook.com/SetMineApp",
				"twitter_link": "https://www.twitter.com/setmineapp",
				"web_link": "https://www.google.com/",
				"ticket_link": "http://www.ticketmaster.com/event/0D004ED7EE0AA4C6",
				"imageURL": "430b96dcf7caa476156ab1591bbe5b36.jpg",
				"main_imageURL": "dc1f3b331388ce7233371259ebdf832f.jpg",
				"start_date": "2015-08-27T12:00:00.000Z",
				"end_date": "2015-08-27T12:00:00.000Z",
				"paid": 1,
				"days": 1,
				"venue": "Revolution Live",
				"latitude": 26.1213365,
				"longitude": -80.14642449999997,
				"address": "100 Southwest 3rd Avenue, Fort Lauderdale, FL 33312, USA",
				"source_id": null,
				"price": "$ - ",
				"formattedDate": "Aug 27th, 2015",
				"type": "upcoming"
			}
		],
		tracks: [

		],
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
			// Let's assume that other ephemeral state
			// MAY have to exist here.
			appState: initialAppState
		};
	},

	componentDidMount: function() {
		this._attachStreams();
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
				<Header appState={appState} pushFn={push}/>
				<PlayerWrapper appState={appState}
					push={push}
					routeHandler={RouteHandler}/>
				<Footer />
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
		<DefaultRoute name='landing' handler={LandingView}/>
		<Route name='user' path='user' handler={HomeView}>
			<Route name='favorites' path='favorites' handler={Favorites}/>
			<Route name='new' path='new' handler={New}/>
		</Route>
		<Route name='featured' path='featured' handler={FeaturedView}/>
		<Route name='artists' path='artists' handler={Artists}/>
		<Route name='festivals' path='festivals' handler={Festivals}/>
		<Route name='mixes' path='mixes' handler={Mixes}/>
		<Route name='activities' handler={Activities}/>
		<Route name='search' path='search' handler={SearchResultsView}/>
		<Route name='artist'>
		</Route>
		<Route name='event'>
		</Route>
	</Route>
);

// <Route name='artist' path='artist/:id' handler={ArtistDetail}>
// 			<Route name='artistSets' path='sets'/>
// 			<Route name='artistEvents' path='events'/>
// 		</Route>
// 		<Route name='event' path='event/:id' handler={EventDetail}>
// 		</Route>

//var headMount = document.getElementById('head-mount-point');
var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});
