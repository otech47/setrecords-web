import React from 'react';
import constants from '../constants/constants';
import {History} from 'react-router';

var SetTile = React.createClass({

	mixins: [History],

	openSetEditor() {
		console.log(this.props);
		this.history.pushState(null, `/edit/${this.props.id}`);
	},

	render() {

		var image = {
			backgroundImage: "url('"+constants.S3_ROOT_FOR_IMAGES+this.props.imageURL+"')"
		};
		
		return (
			<div className="set-tile" style={image} onClick={this.openSetEditor} >
				<div className="flex-column tile-controls">
					<div className="flex-column flex-2x set-info">
						<div>{this.props.setName}</div>
						<div>{this.props.artist}</div>
					</div>
					<div className="divider"/>
					<div className="flex-row flex set-stats">
						<div className="flex-fixed play-count flex-container">
							<i className="fa fa-play"> {` ${this.props.popularity}`}</i>
						</div>
						<div className="flex-fixed set-length flex-container">
							<i className="fa fa-clock-o">{` ${this.props.set_length}`}</i>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = SetTile;