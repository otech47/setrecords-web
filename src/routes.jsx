import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import auth from './lib/auth';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import MainInterface from './components/MainInterface';

var loginGuard = (nextState, replace, callback) => {
    console.log('running login guard to make sure we don\'t already have a session');

    auth.loggedIn()
        .then((artistId) => {
            console.log('==artistId===');
            console.log(artistId);
            replace({
                pathname: '/dashboard',
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
            callback();
        })
        .catch((err) => {
            console.log('==loginguard err===');
            console.log(err);
            callback();
        });
}

var routeGuard = (nextState, replace, callback) => {
    console.log('running route guard to make sure we have a session');

    auth.loggedIn()
        .then((artistId) => {
            console.log('==artistId===');
            console.log(artistId);
            callback();
        })
        .catch((err) => {
            console.log('==routeguard err===');
            console.log(err);
            replace({
                pathname: '/login',
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
            callback();
        });
}

var routes = module.exports = (
    <Route path='/' component={App} >
        <Route path='/login' component={LoginPage} onEnter={loginGuard} />

        <Route component={MainInterface} onEnter={routeGuard} >
            <IndexRoute component={Dashboard} />
            <Route path='/dashboard' component={Dashboard} />
        </Route>
    </Route>
);
