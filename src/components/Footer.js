import React from 'react';

var Footer = React.createClass({

	render() {
		var contact = 'artists@setmine.com';

		return (
			<footer>
				<div className='flex-column links'>
					<a className='click' href='https://www.setmine.com/about'>
						About
					</a>
					<a href='http://bit.ly/SetmineiOS' title='view on App Store' className='click'>
						iOS
					</a>
					<a href='http://bit.ly/SetmineAndroid' title='view on Google Play'className='click'>
						Android
					</a>
					<div className='copyright'>
		             	<i className='fa fa-copyright'/>
		             	{' Setmusic LLC. 2015'}
	             	</div>
	          </div>
				<div className='flex-column social'>
					<h4 className='flex-row'>
						<i className='fa fa-share-alt hidden'/>
						<span>CONNECT WITH US</span>
					</h4>
					<nav className='flex-row'>
						<a className='fa fa-fw fa-envelope-o' href={`mailto:${contact}`} />
						<a href='https://www.facebook.com/SetmineApp' className='fa fa-fw fa-facebook-square'/>
						<a href='https://twitter.com/setmineapp' className='fa fa-fw fa-twitter-square'/>
						<a href='https://instagram.com/setmine/' className='fa fa-fw fa-instagram'/>
						<a href='http://setmine.tumblr.com/' className='fa fa-fw fa-tumblr-square'/>
					</nav>
					{/*<ul className='hidden'>
						<li onClick={this.redirect}>
							<i className='fa fa-fw fa-envelope-o'/>
							<span>{contact}</span>
						</li>
						<li>
							<a href='https://www.facebook.com/SetmineApp' className='fa fa-fw fa-facebook-square'/>
							<span>Facebook</span>
						</li>
						<li>
							<a href='https://twitter.com/setmineapp' className='fa fa-fw fa-twitter-square'/>
							<span>Twitter</span>
						</li>
						<li>
							<a href='https://instagram.com/setmine/' className='fa fa-fw fa-instagram'/>
							<span>Instagram</span>
						</li>
						<li>
							<a href='http://setmine.tumblr.com/' className='fa fa-fw fa-tumblr-square'/>
							<span>Tumblr</span>
						</li>
					</ul>*/}
				</div>
				<div className='flex-column sponsors'>
					<a className='center' href='https://teamtreehouse.com'><img src='/images/treehouse.png' /></a>
					<a className='center' href='https://mixpanel.com/f/partner'><img src='//cdn.mxpnl.com/site_media/images/partner/badge_light.png' alt='Mobile Analytics' /></a>
				</div>
			</footer>
		);
	}

 });

module.exports = Footer;