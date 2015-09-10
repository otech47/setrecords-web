import React from 'react';

var MediaReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
		<div className="media-report flex-column">
			<div className="title flex-row">
				<img src="/public/images/media_icon.png" />
				media
			</div>
			<div className="metrics flex-row flex">
				<div className="flex-column flex-fixed">
					<img src="/public/images/soundcloud_icon.png" />
					<h1>6.6M</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>plays</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new followers</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
			</div>
			<div className="divider"></div>
			<div className="metrics flex-row flex">
				<div className="flex-column flex-fixed">
					<img src="/public/images/youtube_icon.png" />
					<h1>66.6M</h1>
				</div>
				<div className="flex-column flex-fixed">
					<p>plays</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
				<div className="flex-column flex-fixed">
					<p>new subscribers</p>
					<h1>320k</h1>
					<p>yesterday +50</p>
				</div>
			</div>
		</div>
		);
	}
});

module.exports = MediaReport;									