import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute} from 'react-router';
import App from './components/App';
import ContentView from './components/ContentView';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
import SetEditor from './components/SetEditor';
import SettingsEditor from './components/SettingsEditor';
import Contact from './components/Contact';
import UploadSetWizard from './components/UploadSetWizard';
import UploadTrackWizard from './components/UploadTrackWizard';
import MainInterface from './components/MainInterface';


var bodyMount = document.getElementById('body-mount-point');

import history from './services/history';

var routes = (
    <Route path='/' component={App} >
        <IndexRoute component={LoginPage} />

        <Route component={MainInterface} >
            <Route path='dashboard' component={Dashboard} />
            <Route path='content' component={ContentView} />
            <Route path='edit/:id' component={SetEditor} />
            <Route path='account' component={SettingsEditor} />
            <Route path='contact' component={Contact} />
            <Route path='upload-set' component={UploadSetWizard} />
            <Route path='upload-track' component={UploadTrackWizard} />
        </Route>
    </Route>
);

ReactDOM.render(
    <Router history={history}>
        {routes}
    </Router>
, bodyMount);
