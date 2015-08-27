var React = require('react')

var PlayerControl = React.createClass({
	render: function() {
		return (
			<div className="player-image-container overlay-container click" onClick={this.togglePlay}>
		        <div className="overlay set-flex">
		            <i className={this.props.playing ? "fa fa-pause center" : "fa fa-play center"} id="play-button"></i>
		        </div>
		        <img />
		    </div>
		);
	}
});

module.exports = PlayerControl