import React from 'react';

import Base from './Base';

export default class ViewContainer extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='ViewContainer'>
                {
                    React.Children.map(this.props.children, (child) => {
                        return React.cloneElement(child, this.props);
                    })
                }
            </div>
        );
    }
}
