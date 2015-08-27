var React = require('react')
var constants = require('../constants/constants')

var ViewTitleContainer = require('./ViewTitleContainer')
var FeaturedContainer = require('./FeaturedContainer')
var FeaturedResultsHeader = require('./FeaturedResultsHeader')
var EventBrowseContainer = require('./EventBrowseContainer')


//TODO: shit breaks when you render
var FeaturedView = React.createClass({
	getInitialState: function() {//TODO delete this shit
		return {
			landingEvents: [],
			currentEvents: [],
			hidden: true
		}
	},
	getLandingEvents: function() {//PUT IN EVENT STREAM FUCKTARD
		$.ajax({
			url: 'http://setmine.com'+constants.API_ROOT+'landing',
			type: 'GET',
		})
		.done(function(response) {
			console.log("success");
			var landing = []
			var splitLanding = []
			var landingModels = response.payload.landing
			for(var l in landingModels) {
				landing[l] = landingModels[l]
				if(landing.length == landingModels.length) {
					var splits = Math.ceil(landing.length / 4)
					for(var i = 0; i < splits; i++) {
						splitLanding[i] = []
						for(var j = (i*4); j < (i*4)+4; j++) {
							if(j < landing.length) {
								splitLanding[i].push(landing[j])
							} else break
						}
					}
				}
			}
			// console.log(splitLanding)
			this.setState({
				landingEvents: splitLanding
			});
			console.log('landing events loaded: '+this.state.landingEvents.length)
		}.bind(this))
		.fail(function() {
			console.log("error");
		}.bind(this))
	},
	getUpcomingEvents: function(date, location, orderBy) {
		$.ajax({
			url: 'http://setmine.com'+constants.API_ROOT+'upcoming',
			type: 'GET'
		})
		.done(function(response) {
			this.setState({
				currentEvents: response.payload.upcoming.soonestEvents
			});
			console.log('upcoming events loaded: '+this.state.currentEvents.length)
		}.bind(this))
		.fail(function() {
			console.log("error");
		}.bind(this))
	},
	componentWillMount: function() {
		this.getLandingEvents();
		// this.getUpcomingEvents()
	},
	componentDidMount: function() {
		this._attachStreams();
	},
	render: function() {
		return (
			<div id="featured" className="view flex-column">
				<ViewTitleContainer title='Featured'/>
				<FeaturedContainer landingEvents={this.state.landingEvents}/>
				<FeaturedResultsHeader
					pushFn={this.props.pushFn}
                	appState={this.props.appState}/>
				<EventBrowseContainer 
					pushFn={this.props.pushFn}
					appState={this.props.appState}/>
          </div>
		);
	},
	_attachStreams: function() {
		var _this = this;
	}
});

module.exports = FeaturedView