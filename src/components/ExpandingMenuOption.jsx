import React from 'react';

import Base from './Base';
import Icon from './Icon';

export default class ExpandingMenuOption extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='ExpandingMenuOption' className='click row align-center'>
                <Icon>{this.props.icon}</Icon>
                {this.props.expanded ?
                    <p>{this.props.text}</p>
                    :
                    null
                }
            </div>
        );
    }
}
