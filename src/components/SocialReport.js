import React from 'react';

var SocialReport = React.createClass({
	componentDidMount: function() {
		this._attachStream();
	},
	_attachStream: function() {
		var _this = this;
	},
	render: function() {
		return (
		<div className="social-report flex">
			<div className="flex-row title">
				<img src="/public/images/social_icon.png" />
				<p>social</p>
			</div>
		</div>
		);
	}
});

module.exports = SocialReport;									