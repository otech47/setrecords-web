import React from 'react';

var Footer = React.createClass({
	
	render(){
	
		return(
			<footer className="flex-row">
				<div className="flex-row company-links flex-fixed">
					    <a className="click" id="contact">Contact Us</a>
					    <a className="click" id="about" href="https://setmine.com/about">About</a>
					    <a className="click" id="dmca">DMCA Notice</a>
					    <i className="fa fa-copyright">Setmusic LLC. 2015</i>
				</div>

				<div className="flex-row social-links flex-fixed">			 
		        	<a href="https://www.facebook.com/SetmineApp">
		        		<i className="fa fa-2x fa-facebook fa-fw"></i>
		        	</a>
		       		<a href="https://twitter.com/setmineapp">
		        		<i className="fa fa-2x fa-twitter fa-fw"></i>
		        	</a>
		        	<a href="https://instagram.com/setmine/">
		        		<i className="fa fa-2x fa-instagram fa-fw"></i>
		        	</a>	
			    </div>

			    <div className="flex-row sponsorship-links flex-fixed">
				    <a href="https://teamtreehouse.com">	
				    	<img src="public/images/treehouse-sponsorship-black-bg.jpg" />
				    </a>
				    <a href="https://mixpanel.com/f/partner">
				    	<img src="//cdn.mxpnl.com/site_media/images/partner/badge_light.png" alt="Mobile Analytics"/>
				    </a>
			    </div>
			</footer>
		);
    }
 });
module.exports = Footer;