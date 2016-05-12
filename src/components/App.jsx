import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Immutable from 'immutable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';

import auth from '../lib/auth';
import Base from './Base';
import constants from '../constants/constants';
import GlobalEventHandler from '../lib/globalEventHandler';

var defaultValues = {
    artistId: 0,
    headerText: '',
    notification: false
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
                console.log('==err===');
                console.log(err);
            })
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
