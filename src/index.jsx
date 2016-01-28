import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute} from 'react-router';
import routes from '../routes/routes';

var bodyMount = document.getElementById('body-mount-point');

import history from './services/history';

ReactDOM.render(
    <Router history={history}>
        {routes}
    </Router>
, bodyMount);
