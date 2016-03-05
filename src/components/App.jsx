import Immutable from 'immutable';
import React from 'react';

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
var push = evtHandler.push;

export default class App extends Base {
    getChildContext() {
        return {
            push: push,
            artistId: this.state.appState.get('artistId')
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
    push: React.PropTypes.func,
    artistId: React.PropTypes.number
};
