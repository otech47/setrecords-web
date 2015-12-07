import React from 'react';
var Loader = require("react-loader");

var MediaReport = React.createClass({
    render() {
        return (
            <div>
                media report
            </div>
        )
    }
});

var MediaReport2 = React.createClass({
	getInitialState: function() {
		return ({
			loaded: false
		});
	},
	componentDidMount: function() {
		this._attachStream();
	},
	componentWillMount: function() {
		var self = this;
		this.props.getMediaMetrics(0, function() {
			self.setState({
				loaded: true
			});
		});
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;

		var soundcloudMetrics = metrics.soundcloud;
		var soundcloudTotal = soundcloudMetrics.followers.overtime[0].followers;
		var soundcloudNewFollowers = soundcloudMetrics.followers.current;
		var soundcloudNewPlays = soundcloudMetrics.plays.current;

		var youtubeMetrics = metrics.youtube;
		var youtubeTotal = youtubeMetrics.followers.overtime[0].followers;
		var youtubeNewFollowers = youtubeMetrics.followers.current;
		var youtubeNewPlays = youtubeMetrics.plays.current;

		return (
		<div className="media-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/media_icon.png" />
				media
			</div>
			<Loader loaded={this.state.loaded}>
				<div className="metrics flex-row flex">
					<div className="flex-column flex-fixed">
						<img src="/public/images/soundcloud_icon.png" />
						<h1>{suffixNum(soundcloudTotal)}</h1>
						<p>followers</p>
					</div>
					<div className="flex-column flex-fixed">
						<p>new plays</p>
						<h1>{suffixNum(soundcloudNewPlays)}</h1>
					</div>
					<div className="flex-column flex-fixed">
						<p>new followers</p>
						<h1>{suffixNum(soundcloudNewFollowers)}</h1>
					</div>
				</div>
				<div className="divider"></div>
				<div className="metrics flex-row flex">
					<div className="flex-column flex-fixed">
						<img src="/public/images/youtube_icon.png" />
						<h1>{suffixNum(youtubeTotal)}</h1>
						<p>subscribers</p>
					</div>
					<div className="flex-column flex-fixed">
						<p>new plays</p>
						<h1>{suffixNum(youtubeNewPlays)}</h1>
					</div>
					<div className="flex-column flex-fixed">
						<p>new subscribers</p>
						<h1>{suffixNum(youtubeNewFollowers)}</h1>
					</div>
				</div>
			</Loader>
		</div>
		);
	}
});

module.exports = MediaReport;
