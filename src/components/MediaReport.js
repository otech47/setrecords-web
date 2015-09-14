import React from 'react';

var MediaReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		var suffixNum = this.props.numberWithSuffix;
		var metrics = this.props.metrics;
		
		var soundcloudMetrics = metrics.soundcloud;
		var soundcloud_total = soundcloudMetrics.followers.overtime[0].followers;
		var soundcloud_current_followers = soundcloudMetrics.followers.current;
		var soundcloud_last_followers = soundcloudMetrics.followers.last;
		var soundcloud_current_plays = soundcloudMetrics.plays.current;
		var soundcloud_last_plays = soundcloudMetrics.plays.last;

		var youtubeMetrics = metrics.youtube;
		var youtube_total = youtubeMetrics.followers.overtime[0].followers;
		var youtube_current_followers = youtubeMetrics.followers.current;
		var youtube_last_followers = youtubeMetrics.followers.last;
		var youtube_current_plays = youtubeMetrics.plays.current;
		var youtube_last_plays = youtubeMetrics.plays.last;

		return (
		<div className="media-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/media_icon.png" />
				media
			</div>
			<div className="metrics flex-row flex">
				<div className="flex-column flex-fixed">
					<img src="/public/images/soundcloud_icon.png" />
					<h1>{suffixNum(soundcloud_total)}</h1>
					<p>followers</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new plays</p>
					<h1>{suffixNum(soundcloud_current_plays)}</h1>
					<p>yesterday {suffixNum(soundcloud_last_plays)}</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>{suffixNum(soundcloud_current_followers)}</h1>
					<p>yesterday {suffixNum(soundcloud_last_followers)}</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row flex">
				<div className="flex-column flex-fixed">
					<img src="/public/images/youtube_icon.png" />
					<h1>{suffixNum(youtube_total)}</h1>
					<p>subscribers</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new plays</p>
					<h1>{suffixNum(youtube_current_plays)}</h1>
					<p>yesterday {suffixNum(youtube_last_plays)}</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new subscribers</p>
					<h1>{suffixNum(youtube_current_followers)}</h1>
					<p>yesterday {suffixNum(youtube_last_followers)}</p>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = MediaReport;									