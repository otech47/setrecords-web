var React = require('react');

var PlayerTrackInfo = React.createClass({
  displayName: 'PlayerTrackInfo',

	render: function() {

    //var track = this.props.appState.get('currentTrack').setSMObject.trackname;

		return (
			<div className="player-track-info flex-row flex-fixed">
                <div className="current-track center flex">kushdank</div>
                <i className="fa fa-fw fa-bars click flex-zero"></i>
                <i className="fa fa-fw fa-share click flex-zero"></i>
            </div>
		);
	}
});

module.exports = PlayerTrackInfo;
