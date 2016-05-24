import React from 'react';

import Base from './Base';

export default class TitleCard extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        var {title, iconPath} = this.props;

        return (
          <div id='TitleCard' className='row align-center'>
            <img src={iconPath} />
            <h2>{title}</h2>
          </div>
        )
    }
}
