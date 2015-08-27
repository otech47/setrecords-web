var React = require('react');
var constants = require('../constants/constants');

var DetailImageContainer = require('./DetailImageContainer');
var LinkButtonContainer = require('./LinkButtonContainer');
var DetailContentContainer = require('./DetailContentContainer');
var SetContainer = require('./SetContainer')

var DetailView = React.createClass({
	render: function() {
		var links = [
			{
				type: 'facebook',
				url: this.props.data.fb_link
			},
			{
				type: 'twitter',
				url: this.props.data.twitter_link
			},
			{
				type: 'instagram',
				url: this.props.data.instagram_link
			},
			{
				type: 'soundcloud',
				url: this.props.data.soundcloud_link
			},
			{
				type: 'youtube',
				url: this.props.data.youtube_link
			}
		];
		return (
			<div id="detail" className="view detail-page">
				<DetailImageContainer 
					title={this.props.title}
					buttonText={this.props.buttonText}
					imageURL={this.props.data.imageURL}
					info={this.props.info} />
				<LinkButtonContainer links={links} />
				<div className="divider"/>
				<DetailContentContainer data={this.props.data} navTitles={this.props.navTitles}/>
			</div>
		);
	}
});

module.exports = DetailView;