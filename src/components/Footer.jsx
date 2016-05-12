import FontIcon from 'material-ui/FontIcon';
import React from 'react';

import Base from './Base';

export default class Footer extends Base {
    render() {
        var contact = 'artists@setmine.com';

        return (
            <footer id='Footer' className='row justify-space-between'>
                <div className='column justify-space-around'>
                    <a className='click' target='_blank' href='https://www.setmine.com/about'>
                        About
                    </a>
                    <a href='http://bit.ly/SetmineiOS' target='_blank' className='click'>
                        iOS App
                    </a>
                    <a href='http://bit.ly/SetmineAndroid' target='_blank' className='click'>
                        Android App
                    </a>
                </div>

                <div className='column justify-center align-center social'>
                    <h4>CONNECT WITH US</h4>
                    <nav className='row justify-space-between align-center'>
                        <a target='_blank' href='https://www.facebook.com/SetmineApp' >
                            <i className='fa fa-facebook-official fa-2x' style={{color: '#3B5998'}}></i>
                        </a>
                        <a target='_blank' href='https://twitter.com/setmineapp' >
                            <i className='fa fa-twitter-square fa-2x' style={{color: '#55ACEE'}} ></i>
                        </a>
                        <a target='_blank' href='https://instagram.com/setmine/' >
                            <i className='fa fa-instagram fa-2x' style={{color: '#3F729B'}} ></i>
                        </a>
                        <a target='_blank' href={`mailto:${contact}`} >
                            <i className='fa fa-envelope fa-2x' style={{color: 'white'}} ></i>
                        </a>
                    </nav>
                </div>

                <div className='column justify-space-around'>
                    <a className='center' href='https://mixpanel.com/f/partner'><img src='//cdn.mxpnl.com/site_media/images/partner/badge_light.png' alt='Mobile Analytics' /></a>
                </div>
            </footer>
        );
    }
};
