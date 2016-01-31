import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute} from 'react-router';
import App from './components/App';
import LoginPage from './components/LoginPage';
import ContentView from './components/ContentView';
import SetmineReport from './components/SetmineReport';
import BeaconReport from './components/BeaconReport';
import SocialReport from './components/SocialReport';
import SoundcloudReport from './components/SoundcloudReport';
import YoutubeReport from './components/YoutubeReport';
import SetEditor from './components/SetEditor';
import SettingsEditor from './components/SettingsEditor';
import Contact from './components/Contact';
import UploadSetWizard from './components/UploadSetWizard';
import UploadTrackWizard from './components/UploadTrackWizard';


var bodyMount = document.getElementById('body-mount-point');

import history from './services/history';

var routes = (
    <Route path='/' component={App} >
        <IndexRoute component={LoginPage} />
        <Route path='content' component={ContentView} />

        <Route path='metrics/setmine' component={SetmineReport} />
        <Route path='metrics/beacons' component={BeaconReport} />
        <Route path='metrics/social' component={SocialReport} />
        <Route path='metrics/soundcloud' component={SoundcloudReport} />
        <Route path='metrics/youtube' component={YoutubeReport} />

        <Route path='edit/:id' component={SetEditor} />
        <Route path='account' component={SettingsEditor} />
        <Route path='contact' component={Contact} />
        <Route path='upload-set' component={UploadSetWizard} />
        <Route path='upload-track' component={UploadTrackWizard} />
    </Route>
);

ReactDOM.render(
    <Router history={history}>
        {routes}
    </Router>
, bodyMount);
