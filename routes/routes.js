var routes = (
    <Route path='/' component={App} >
        <IndexRoute component={Login} />
        <Route path='content' component={ContentView} />

        <Route path='metrics/setmine' component={SetmineReport} />
        <Route path='metrics/beacons' component={BeaconReport} />
        <Route path='metrics/social' component={SocialReport} />
        <Route path='metrics/soundcloud' component={SoundcloudReport} />
        <Route path='metrics/youtube' component={YoutubeReport} />

        <Route path='edit/:id' component={MobileSetEditor} />
        <Route path='account' component={SettingsEditor} />
        <Route path='contact' component={Contact} />
        <Route path='upload-set' component={UploadSetWizard} />
        <Route path='upload-track' component={UploadTrackWizard} />
    </Route>
);

module.exports = routes;
