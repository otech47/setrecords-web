import React from 'react';

import Base from './Base';

export default class MetricsToggle extends Base {
    constructor(props) {
        super(props);
        this.autoBind('handleToggle');

        this.state = {
            active: true
        };
    }

    render() {
        var {metric, title} = this.props;

        return (
            <div id='MetricsToggle' onClick={this.handleToggle} className={'column ' + (this.state.active ? 'activated':'deactivated')} >
                <h2>{metric || 0}</h2>
                <p>{title || 'none'}</p>
            </div>
        )
    }

    handleToggle(e) {
        this.props.onToggle(this.props.title);
        this.setState({
            active: !this.state.active
        });
    }
}
