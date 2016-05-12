import React from 'react';

import Base from './Base';

export default class Dashboard extends Base {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.context.push({
            headerText: 'Dashboard'
        });
    }

    render() {
        return (
            <div id='Dashboard'>
                Dashboard
            </div>
        );
    }
}

Dashboard.contextTypes = {
    push: React.PropTypes.func
};
