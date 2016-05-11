import React from 'react';

import Base from './Base';

export default class MainInterface extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        var appState = this.props.appState;

        return (
            <div id='MainInterface'>
                {this.props.children}
            </div>
        );
    }
}
