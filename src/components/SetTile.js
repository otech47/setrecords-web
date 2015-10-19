var React = require('react');
var constants = require('../constants/constants');

var SetTile = React.createClass({

	tileClick() {
		this.props.openSetEditor(this.props.data);
	},

	render() {
		var image = {
			backgroundImage: "url('"+constants.S3_ROOT_FOR_IMAGES+this.props.imageURL+"')"
		};
		
		return (
			<div className="set-tile" style={image} onClick={this.tileClick} >
				<div className="flex-column tile-controls">
					<div className="flex-column flex-2x set-info">
						<div>{this.props.setName}</div>
						<div>{this.props.artist}</div>
					</div>
					<div className="divider"/>
					<div className="flex-row flex set-stats">
						<div className="flex-fixed play-count set-flex">
							<i className="fa fa-play"> {` ${this.props.popularity}`}</i>
						</div>
						<div className="flex-fixed set-length set-flex">
							<i className="fa fa-clock-o">{` ${this.props.set_length}`}</i>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SetTile;