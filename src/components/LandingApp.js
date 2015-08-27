var React = require('react');

var LandingApp = React.createClass({
	componentDidMount: function() {
		var activeSlide = 'fa fa-fw fa-circle click';
		var inactiveSlide = 'fa fa-fw fa-circle-o click';
		var slides = $('.slide'),
			 dots = $('.slide-controls i'),
			 sLength = slides.length,
			 current,
			 changeTimeout;

		function moveTo(newIndex) {
			var i = newIndex;
			if(newIndex == 'prev') {
				i = (current > 0) ? (current - 1) : (sLength - 1);
			} 
			if(newIndex =='next') {
				i = (current < sLength - 1) ? (current + 1): 0;
			}
			dots.attr('class', inactiveSlide).eq(i).attr('class', activeSlide);
			fadeTransition(slides, slides.eq(i));
			current = i;
			clearTimeout(changeTimeout);
			changeTimeout = setTimeout(function() {
				moveTo('next');
			}, 7000);
		}

		//change slides by clicking on dots
		dots.click(function() {
			var i = dots.index(this);
			moveTo(i);
		});

		//initialize slider on load
		moveTo('next');
	},
	render: function() {
		return (
			<div className="flex-column landing-view overlay-container" id="landing-2">
				<div className="flex-row overlay-container slide slide-1 animated fadeIn">
					<div className="flex-column flex-fixed text-container">
						<div className="buffer"/>
						<div className="header-medium center wow bounceInLeft">
						  {'Say goodbye to missing a live performance'}
						</div>
						<div className="buffer"/>
						<div className="center wow bounceInLeft">
							{'Setmine lets you listen any live set or recorded mix completely free, allowing you to relive your favorite events, or catch up on the ones you missed.'}
						</div>
						<div className="buffer"/>
						<div className="center wow bounceInLeft">
							{'Search for your favorite tracks and hear the results in live set form. We\'ll fast-forward you right where the artist drops the track'}
						</div>
						<div className="buffer-5x"/>
					</div>
					<div className="flex-column flex-fixed image-container">
					   <img className="center wow slideInUp" src="public/images/slide-1.jpg" />
					</div>
				</div>
				<div className="flex-row overlay-container slide slide-2 hidden">
					<div className="flex-column flex-fixed text-container animated fadeIn">
					   <div className="buffer"/>
					   <div className="header-medium center animated bounceInLeft">
					   		{'Discover upcoming events near you'}
					   </div>
					   <div className="buffer"/>
					   <div className="center animated bounceInLeft">
							{'We streamlined event discovery so you can find local events, view lineups, and purchase tickets within the app.'}
					   </div>
					   <div className="buffer-5x"/>
					</div>
					<div className="flex-column flex-fixed image-container">
					   <img className="center animated fadeIn" src="public/images/slide-2.jpg" />
					</div>
				</div>
	          <div className="flex-row overlay-container slide slide-3 animated fadeIn hidden">
					<div className="flex-column flex-fixed text-container">
						<div className="buffer"/>
						<div className="animated bounceInLeft">
							{'Your stream lists new sets, upcoming events, and exclusive content from your favorite artists.'}
						</div>
						<div className="buffer"/>
						<div className="animated bounceInLeft">
							{'Save your favorite sets for quick and easy listening.'}
						</div>
						<div className="buffer"/>
						<div className="divider center"></div>
						<div className="buffer"/>
						<div className="animated bounceInLeft">
							{'You can enjoy these features with a quick one-time facebook login.'}
						</div>
						<div className="buffer"/>
					</div>
					<div className="flex-column flex-fixed image-container">
						<img className="center animated zoomIn" src="public/images/slide-3.jpg" />
					</div>
          	</div>
				<div className="flex-row slide-controls">
					<i className={'fa fa-fw fa-circle click'} id='slide-1'></i>
					<i className={'fa fa-fw fa-circle-o click'} id='slide-2'></i>
					<i className={'fa fa-fw fa-circle-o click'} id='slide-3'></i>
				</div>
			</div>
		);
	}
});

module.exports = LandingApp