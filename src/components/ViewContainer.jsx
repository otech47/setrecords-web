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


export default class ViewContainer extends Base {
    constructor(props) {
        super(props);
        this.autoBind('renderChildren');
    }

    render() {
        var appState = this.props.appState;
        var push = this.props.push;

        return (
            <div id='ViewContainer'>
                <Header artistImage={appState.get('artist_data').icon_image.imageURL} artistName={appState.get('artist_data').artist} headerText={appState.get('header')} logOut={this.logOut} loggedIn={appState.get('loggedIn')} />
                <div className='flex-row view-container'>
                    {this.props.location.pathname == '/' ? '' : <div className='nav-bar-wrapper'><NavBar push={push} /></div> }
                    <div className='view flex-column flex'>
                        {this.renderChildren()}
                    </div>
                </div>

                <Footer />
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
