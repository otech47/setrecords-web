import React from 'react';

import Base from './Base';
import ContentView from './ContentView';
import Footer from './Footer';
import Header from './Header';
import NavBar from './NavBar';
import SetEditor from './SetEditor';
import SettingsEditor from './SettingsEditor';
import UploadSetWizard from './UploadSetWizard';
import UploadTrackWizard from './UploadTrackWizard';


export default class MainInterface extends Base {
    constructor(props) {
        super(props);
        this.autoBind('renderChildren');
    }

    render() {
        var appState = this.props.appState;
        var push = this.props.push;

        return (
            <div id='MainInterface' className='row'>
                <NavBar push={push} />

                <div className='column flex main-view align-stretch'>
                    <Header artistImage={appState.get('artist_data').icon_image.imageURL} artistName={appState.get('artist_data').artist} headerText={appState.get('header')} logOut={this.logOut} loggedIn={appState.get('loggedIn')} />
                    {this.renderChildren()}
                    <Footer />
                </div>
            </div>
        );
    }

    renderChildren() {
        var appState = this.props.appState;
        var push = this.props.push;
        return React.Children.map(this.props.children, function (child) {
            var props = {};

            switch (child.type) {
                case ContentView:
                props = {push: push, loaded: appState.get('loaded'), sets: appState.get('sets'), artistId: appState.get('artistId')};
                break;

                case SetEditor:
                props = {push: push, loaded: appState.get('loaded'), originalArtist: appState.get('artist_data')};
                break;

                case SettingsEditor:
                props = {push: push, artistId: appState.get('artistId'), loaded: appState.get('loaded'), artistData: appState.get('artist_data')};
                break;

                case UploadSetWizard:
                case UploadTrackWizard:
                props = {push: push, originalArtist: appState.get('artist_data'), loaded: appState.get('loaded')};
                break;

                default:
                props = {push: push, appState: appState};
                break;
            }

            return React.cloneElement(child, props);
        });
    }
}