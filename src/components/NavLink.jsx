import React from 'react';0

import Base from './Base';
import ExpandingMenuOption from './ExpandingMenuOption';
import Icon from './Icon';
import {IndexLink, Link, History} from 'react-router';

export default class NavLink extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='NavLink' >
                <Link className='row click justify-center' to={this.props.to} activeClassName='active' onlyActiveOnIndex={true}>
                    <ExpandingMenuOption icon={this.props.icon} text={this.props.text} expanded={this.props.expanded} />
                </Link>
            </div>
        );
    }
}
