var React = require('react');

var MockSetTileImproved = React.createClass({
	render: function() {
		var setData = this.props.setData;
		return (
		<button className="set-tile" >
			<img className="event-image" src={setData.image} />
		    <div className="flex-column tile-controls">
	            <div className="flex-column flex-2x set-info">
	                <div>{setData.artist}</div>
	                <div>{setData.name}{(setData.episode && setData.episode.length > 0) ? " - " + setData.episode : ""}</div>
	            </div>
	            <div className="divider"></div>
		        <div className="flex-row flex set-stats">
		            <div className="flex-fixed play-count set-flex">
		                <i className="fa fa-play"> 0</i>
		            </div>
		            <div className="flex-fixed set-length set-flex">
		                <i className="fa fa-clock-o"> {setData.set_length}</i>
		            </div>
		        </div>
		    </div>
		</button>
		);
	}
});

module.exports = MockSetTileImproved;
