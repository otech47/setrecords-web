var React = require('react');
import {Link} from 'react-router';

var LandingHome = React.createClass({
	scroll: function() {
		setTimeout(function(){
			$(window).scrollTo($('#landing-2'), 400, {
				offset: - $('header').height()
			});
		}, 200);
	},
	render: function() {
		return (
			<div className="flex-column overlay-container landing-view" id="landing-1">
				<div className="overlay"></div>
				<div className="buffer"></div>
				<div className="header center wow zoomIn">Setmine</div>
				<div className="center wow zoomIn">Relive your favorite events</div>
				<div className="buffer"></div>
				<div className="flex-row center">
				    <a href="http://bit.ly/SetmineiOS" title="view on App Store" className="fa fa-apple fa-fw fa-4x wow fadeInLeft click"></a>
				    <a href="http://bit.ly/SetmineAndroid" title="view on Google Play"className="fa fa-android fa-fw fa-4x wow fadeInRight click"></a>
				</div>
				<div className="buffer-5x"></div>
				<Link to='featured' className="header-small nav-button center click wow fadeInUp" id="listen-now">Listen Now</Link>
				<div className="buffer"></div>
				<i className="fa fa-chevron-down center click wow slideInUp" onClick={this.scroll}></i>
				<div className="buffer"></div>
          </div>
		);
	}

});

module.exports = LandingHome;