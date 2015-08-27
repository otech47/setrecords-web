var React = require('react');
var Router = require('react-router')
var Route = Router.Route;
var constants = require('../constants/constants');

var SetTile = React.createClass({
	componentDidMount: function() {
		//from path /play/:id
		// var id = this.props.params.id;
		// fetchMessage(id, function(err, message) {
		// 	this.setState({
		// 		message: message 
		// 	});
		// })
	},
	render: function() {
		return (
			<div className="flex-column overlay-container set-tile">
				<img className="event-image" src={constants.S3_ROOT_FOR_IMAGES + this.props.data.main_eventimageURL} />
			    <div className="overlay"></div>
			    <div className="buffer-4x"></div>
			    <div className="flex-column flex tile-controls">
			        <div className="flex-row flex">
			            <div className="flex-column flex overlay-container">
			                <img className="artist-image" src={constants.S3_ROOT_FOR_IMAGES+this.props.data.artistimageURL} />
			            </div>
			            <div className="flex-column flex set-info">
			                <div className="center click flex">{this.props.data.event}</div>
			                <div className="center click flex">{this.props.data.artist}</div>
			                <div className="flex-row flex-2x">
			                    <i className="fa fa-fw fa-star-o center click flex"></i>
			                    <i className="fa fa-fw fa-share center click flex"></i>
			                </div>
			            </div>
			        </div>
			        <div className="divider"></div>
			        <div className="flex-row flex-2x">
			            <div className="flex-fixed set-flex play-count click tile-button" onClick={this.hanldePlay}>
			                <i className="fa fa-play center"> {this.props.data.popularity}</i>
			            </div>
			            <div className="divider"></div>
			            <div className="flex-fixed set-flex set-length">
			                <i className="fa fa-clock-o center">{this.props.data.set_length}</i>
			            </div>
			        </div>
			    </div>
			</div>
		)
	}
})

module.exports = SetTile