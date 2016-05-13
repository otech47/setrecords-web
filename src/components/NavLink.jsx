import React from 'react';
import {Link} from 'react-router';

import Base from './Base';
import ExpandingMenuOption from './ExpandingMenuOption';

export default class NavLink extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='NavLink'>
                <Link className='row click justify-center' to={this.props.to} activeClassName='active' onlyActiveOnIndex={true}>
                    <ExpandingMenuOption icon={this.props.icon} text={this.props.text} expanded={this.props.expanded} />
                </Link>
            </div>
        );
    }
}
