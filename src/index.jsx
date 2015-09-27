import React from 'react';
import Immutable from 'immutable';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, Navigation } from 'react-router';


import GlobalEventHandler from './services/globalEventHandler';

import MobileSetEditor from './components/MobileSetEditor';
import SettingPage from './components/SettingPage';
import DMCA from './components/DMCA';
import SetTile from './components/SetTile';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ViewContainer from './components/ViewContainer';
import FooterSetrecords from './components/FooterSetrecords';
import ContentView from './components/ContentView';
import MetricsView from './components/MetricsView';
import AccountView from './components/AccountView';

var initialAppState = Immutable.Map({
	'wizardData': {
		'step': 0,
		'pendingData': {
		}
	},
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
		}
	],
	'artistData': {
		"id": 4026,
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
	},
	'setmine_metrics': {
		'plays': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
			},
		'views': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		},
		'favorites': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		}
	},
	'soundcloud_metrics': {
		'plays': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
			},
		'followers': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		},
	},
	'youtube_metrics': {
		'plays': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
			},
		'followers': {
			current: 1,
			last: 2,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		},
	},
	"beacon_metrics": {
		'revenue': {
			current: 0,
			last: 0,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		},
		'unlocks': {
			current: 0,
			last: 0,
			overtime: [
			{
				date: "4/5/1990",
				count: 1
			},
			{
				date: "4/6/1990",
				count: 1
			},
			{
				date: "4/7/1990",
				count: 1
			},
			{
				date: "4/8/1990",
				count: 1
			},
			{
				date: "4/9/1990",
				count: 1
			},
			{
				date: "4/10/1990",
				count: 1
			},
			{
				date: "4/11/1990",
				count: 1
			},
			]
		}
	},
	"social_metrics": {
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
		this.getArtistData();
	},
	getArtistData: function() {
		var artistId = this.state.appState.get("artistData").id;
		var requestUrl = "http://localhost:3000/api/v/7/artist/" + artistId;
		var self = this;
		$.ajax({
			type: "GET",
			url: requestUrl,
			success: function(res) {
				push({
					type: "SHALLOW_MERGE",
					data: {
						artistData:	res.payload.artist
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

var routes = (
	<Route path='/' handler={App}>
		<DefaultRoute name='metrics' handler={MetricsView} />
		<Route path='content' handler={ContentView} />
		<Route path='metrics' handler={MetricsView} />
	</Route>
);

var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});