import React from 'react';

import Base from './Base';
import Footer from './Footer';
import Header from './Header';
import NavBar from './NavBar';

export default class MainInterface extends Base {
    constructor(props) {
        super(props);
    }

    render() {
        var appState = this.props.appState;

        return (
            <div id='MainInterface' className='row align-stretch'>
                <NavBar />

                <div className='flex column'>
                    <Header headerText={appState.get('headerText')} />

                    <div className='current-view'>
                        {
                            React.Children.map(this.props.children, (child) => {
                                return React.cloneElement(child, {
                                    appState: appState
                                });
                            })
                        }
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
};
