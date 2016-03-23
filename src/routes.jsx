import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './components/App';
import auth from './lib/auth';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';

function loginGuard(nextState, replace, callback) {
    auth.login()
        .then((artistId) => {
            replace('/');
            callback();
        })
        .catch((err) => {
            callback();
        });
}

function routeGuard(nextState, replace, callback) {
    auth.login()
        .catch((err) => {
            replace('/login');
            callback();
        });
}

module.exports = (
    <Route path='/' component={App}>
        <Route path='login' component={LoginPage} onEnter={loginGuard} />

        <IndexRoute component={Dashboard} onEnter={routeGuard} />
    </Route>
);
