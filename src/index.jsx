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

import LoginPage from '/components/LoginPage';

//subscribe in componentDidMount()
//unsubscribe in componentWillUnmount()
//call setState which pushes to event stream when receiving an event

var initialAppState = Immutable.Map({
	loggedIn: false,
	artistData: {

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
				<Header appState={appState} pushFn={push} />
				<RouteHandler />
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
		<DefaultRoute name='login' handler={LoginPage} />
		<Route name='home' path='home' handler={HomeView}>
		</Route>
		<Route name='artist'>
		</Route>
		<Route name='event'>
		</Route>
	</Route>
);

var bodyMount = document.getElementById('body-mount-point');

Router.run(routes, Router.HashLocation, function(Root) {
	React.render(<Root/>, bodyMount);
});