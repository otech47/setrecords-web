import Immutable from 'immutable';
import React from 'react';

import api from '../lib/api';
import auth from '../lib/auth';
import Base from './Base';
import GlobalEventHandler from '../lib/globalEventHandler';

var defaultValues = {
    artistId: 0,
    headerText: '',
    loaded: false,
    loggedIn: false,
    notification: null
};
var initialAppState = Immutable.Map(defaultValues);
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
            artistId: this.state.appState.get('artistId'),
            auth: auth,
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
        auth.logIn( (err, artistId) => {
            if (err) {
                console.log(err);
            }
            if (artistId) {
                console.log(artistId);
            }
        });
    }

    render() {
        return (
            <div id='App'>
                Hey it's the app!
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
    artistId: React.PropTypes.number,
    auth: React.PropTypes.object,
    push: React.PropTypes.func
};
