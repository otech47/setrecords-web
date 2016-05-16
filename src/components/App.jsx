import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Immutable from 'immutable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

import ArtistSignupModal from './ArtistSignupModal';
import auth from '../lib/auth';
import Base from './Base';
import constants from '../constants/constants';
import ForgotPasswordModal from './ForgotPasswordModal';
import GlobalEventHandler from '../lib/globalEventHandler';
import InfoModal from './InfoModal';
import LoadingModal from './LoadingModal';

var defaultValues = {
    artistId: 0,
    artistSignupModal: false,
    forgotPasswordModal: false,
    headerText: '',
    infoModal: {
        open: false,
        title: '',
        message: ''
    },
    loadingModal: {
        open: false,
        title: '',
        message: ''
    }
};

var initialAppState = Immutable.Map(defaultValues);

var evtHandler = GlobalEventHandler(initialAppState);
var evtTypes = evtHandler.types;
var pushFn = evtHandler.push;
var push = (data) => {
    pushFn({
        type: 'SHALLOW_MERGE',
        data: data
    });
}

export default class App extends Base {
    constructor(props) {
        super(props);
        this.autoBind('_attachStreams');

        this.state = {
            appState: initialAppState
        };
    }

    getChildContext() {
        return {
            push: push,
            artistId: this.state.appState.get('artistId')
        };
    }

    componentWillMount() {
        this._attachStreams(); //global event handler
    }

    componentDidMount() {
        auth.loggedIn()
            .then((artistId) => {
                push({
                    artistId: artistId
                });
            })
            .catch((err) => {
                // console.log('==err==');
                // console.log(err);
            });
    }

    render() {
        var appState = this.state.appState;

        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
                <div id='App'>
                    {
                        React.Children.map(this.props.children, (child) => {
                            return React.cloneElement(child, {
                                appState: appState
                            });
                        })
                    }

                    <ArtistSignupModal modal={appState.get('artistSignupModal')} />
                    <InfoModal modal={appState.get('infoModal')} />
                    <LoadingModal modal={appState.get('loadingModal')} />
                    <ForgotPasswordModal modal={appState.get('forgotPasswordModal')} />
                </div>
            </MuiThemeProvider>
        );
    }

    _attachStreams() {
        evtHandler.floodGate.subscribe(newState => {
            // console.log('UPDATE', newState);
            this.setState({
                appState: newState
            });
        });
    }
};

App.childContextTypes = {
    push: React.PropTypes.func,
    artistId: React.PropTypes.number
};
