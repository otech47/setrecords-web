import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from '../components/App';
import LoginPage from '../components/LoginPage';

module.exports = (
    <Route path='/' component={App}>
        <IndexRoute component={LoginPage} />
    </Route>
);
