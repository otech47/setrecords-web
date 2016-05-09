import React from 'react';

import Base from './Base';
import ExpandingMenuOption from './ExpandingMenuOption';
import NavLink from './NavLink';

export default class NavBar extends Base {
    constructor(props) {
        super(props);
        this.autoBind('toggleExpand');

        this.state = {
            expanded: false
        }
    }

    render() {
        return (
            <div id='NavBar' className={'column align-stretch ' + (this.state.expanded ? 'expanded' : 'collapsed')} >
                <div className='logo row align-center'>
                    <img src='/images/setrecords-logo-white.png' />
                    {this.state.expanded ? <p>setrecords</p> : null}
                </div>

                <div className='column flex'>
                    <NavLink expanded={this.state.expanded} icon={'trending_up'} text={'Dashboard'} to={'/dashboard'} />
                    <NavLink expanded={this.state.expanded} icon={'library_music'} text={'Uploads'} to={'/content'} />
                    <NavLink expanded={this.state.expanded} icon={'queue_music'} text={'New Set'} to={'/upload-set'} />
                    <NavLink expanded={this.state.expanded} icon={'music_note'} text={'New Track'} to={'/upload-track'} />
                    <NavLink expanded={this.state.expanded} icon={'settings'} text={'Settings'} to={'/account'} />
                    <NavLink expanded={this.state.expanded} icon={'phone'} text={'Contact'} to={'/contact'} />
                    <div onClick={this.toggleExpand}>
                        <ExpandingMenuOption text='Collapse' icon='list' expanded={this.state.expanded} />
                    </div>
                </div>
            </div>
        );
    }

    toggleExpand() {
        this.setState({
            expanded: !this.state.expanded
        });
    }
}
