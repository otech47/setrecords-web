import React from 'react';
import Immutable from 'immutable';

import api from '../lib/api';
import auth from '../lib/auth';
import Base from './Base';
import GlobalEventHandler from '../lib/globalEventHandler';
import NotificationLayer from './NotificationLayer';

// set up the global app state and event handler
var defaultValues = {
    notification: {
        status: 'loading',
        title: '',
        message: 'Checking Login Status...'
    }
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
    constructor(props) {
        super(props);
        this.autoBind('attachStreams');

        this.state = {
            appState: initialAppState
        };
    }

    componentWillMount() {
        this.attachStreams();
    }

    getChildContext() {
        return {
            api: api,
            push: push,
            userId: 0
        };
    }

    render() {
        return (
            <div id='App' className='column'>
                <NotificationLayer notification={this.state.appState.get('notification')} />
                {
                    React.Children.map(this.props.children, (child) => {
                        return React.cloneElement(child, {
                            appState: this.state.appState
                        });
                    })
                }
            </div>
        )
    }

    attachStreams() {
        evtHandler.floodGate.subscribe(newState => {
            this.setState({ appState: newState });
        });
    }
}

App.childContextTypes = {
    api: React.PropTypes.object,
    push: React.PropTypes.func,
    userId: React.PropTypes.number
}
