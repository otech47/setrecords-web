import FontIcon from 'material-ui/FontIcon';
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
                <FontIcon className='material-icons' style={styles.icon}>{this.props.icon}</FontIcon>
                {this.props.expanded ?
                    <p>{this.props.text}</p>
                    :
                    null
                }
            </div>
        );
    }
}

const styles = {
    icon: {
        color: 'white'
    }
};
