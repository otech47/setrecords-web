import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import auth from './lib/auth';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import MainInterface from './components/MainInterface';

var loginGuard = (nextState, replace, callback) => {
    auth.loggedIn()
        .then((artistId) => {
            replace({
                pathname: '/dashboard',
                state: {
                    nextPathname: nextState.location.pathname
                }
            });
            callback();
        })
        .catch((err) => {
            callback();
        });
}

var routeGuard = (nextState, replace, callback) => {
    auth.loggedIn()
        .then((artistId) => {
            callback();
        })
        .catch((err) => {
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
