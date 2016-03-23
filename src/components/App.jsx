import Immutable from 'immutable';
import React from 'react';

import api from '../lib/api';
import auth from '../lib/auth';
import Base from './Base';
import GlobalEventHandler from '../lib/globalEventHandler';
import NotificationLayer from './NotificationLayer';

// setting up the immutable app state
var defaultAppState = {
    artistId: 0,
    headerText: '',
    loaded: false,
    loggedIn: false,
    notification: {
        status: 'loading',
        title: '',
        message: 'Checking login status...'
    }
};
var initialAppState = Immutable.Map(defaultAppState);
var evtHandler = GlobalEventHandler(initialAppState);
var evtTypes = evtHandler.types;
var pushFn = evtHandler.push;
var push = (update) => pushFn({
    type: 'SHALLOW_MERGE',
    data: update
});

export default class App extends Base {
    getChildContext() {
        return {
            api: api,
            push: push
        };
    }

    constructor (props) {
        super(props);
        this.autoBind('_attachStreams');

        this.state = {
            appState: initialAppState
        };
    }

    componentWillMount() {
        this._attachStreams();

        // attempt to log the user in
        auth.login('nodex', 'nodex')
            .then((artistId) => {
                push({
                    artistId: artistId,
                    notification: {
                        status: null,
                        title: '',
                        message: ''
                    }
                });
            })
            .catch((err) => {
                push({
                    notification: {
                        status: null,
                        title: '',
                        message: ''
                    }
                });
            });
    }

    render() {
        return (
            <div id='App'>
                <h1>{'App'}</h1>

                {
                    React.Children.map(this.props.children, (child) => {
                        return React.cloneElement(child, {appState: this.state.appState});
                    })
                }
            </div>
        );
    }

    _attachStreams() {
        evtHandler.floodGate.subscribe(newState => {
            console.log('UPDATE', newState);
            this.setState({
                appState: newState
            });
        });
    }
};

App.childContextTypes = {
    api: React.PropTypes.object,
    push: React.PropTypes.func
};
