import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory, Router} from 'react-router';
import routes from './routes';

var bodyMountPoint = document.getElementById('body-mount-point');

ReactDOM.render(
    <Router history={browserHistory}>
        {routes}
    </Router>
, bodyMountPoint);
