var React = require('react')

var Footer = React.createClass({
	// scrollToTop: function() {
	// 	$(window).scrollTo(0, 400);
	// },
	render: function() {
		return (
			<footer className="flex-row flex-zero">
	            <div className="buffer"></div>
	            <div className="flex-column flex-zero">
	                <a className="click" id="contact">Contact Us</a>
	                <a className="click" href="http://setmine.com/about">About</a>
	                <a className="click" id="dmca">DMCA Notice</a>
	                <br />
	                <a className="click">Back To Top</a>
	            </div>
	            <div className="buffer-lg"></div>
	            <div className="flex-column flex">
	                <div className="flex-row center">
	                    <a href="https://www.facebook.com/SetmineApp"><i className="fa fa-2x fa-facebook fa-fw"></i></a>
	                    <a href="https://twitter.com/setmineapp"><i className="fa fa-2x fa-twitter fa-fw"></i></a>
	                    <a href="https://instagram.com/setmine/"><i className="fa fa-2x fa-instagram fa-fw"></i></a>
	                </div>
	                <div className="divider"></div>
	                <div className="center"><i className="fa fa-copyright"></i> Setmine. 2015</div>
	            </div>
	            <div className="buffer-lg"></div>
	            <div className="flex-column flex-zero">
	                <a className="center" href="https://teamtreehouse.com"><img src="public/images/treehouse.png" /></a>
	                <a className="center" href="https://mixpanel.com/f/partner"><img src="//cdn.mxpnl.com/site_media/images/partner/badge_light.png" alt="Mobile Analytics" /></a>
	            </div>
	            <div className="buffer"></div>
	        </footer>
		);
	}
});

module.exports = Footer