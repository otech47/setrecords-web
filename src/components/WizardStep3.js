var React = require('react/addons');
import _ from 'underscore';
import async from 'async';
import ReactDatalist from 'react-datalist';
var constants = require('../constants/constants');
var Dropzone = require('react-dropzone');
import Tracklist from './Tracklist';

var WizardStep3 = React.createClass({
	render: function() {
		var {genres, linkState, tracklist, changeTrack, addTrack, loadTracksFromURL, deleteTrack, changeTracklistURL, tracklistUrl, ...other} = this.props;
		var genreOptions = _.map(genres, function(genre, index) {
			return (<option value={genre} key={index}/>);
		});
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Enter your set's information.</p>
				<div className='flex-row'>
					<div className='flex-column flex-fixed'>
						{this.showFields()}
						<input type='text' valueLink={linkState('genre')} placeholder='genre' list='genres'/>
						<datalist id='genres'>
							{genreOptions}
						</datalist>
						<Tracklist tracks={tracklist} listURL={tracklistUrl} changeTrack={changeTrack} addTrack={addTrack} loadTracksFromURL={loadTracksFromURL} deleteTrack={deleteTrack} changeTracklistURL={changeTracklistURL} />
					</div>
					<div className='flex-column flex-fixed'>
						{this.showEditImage()}
						<button className={'step-button'} onClick={this.submitStep}>
							Continue
						</button>
					</div>
				</div>
			</div>
		);
	},

	showEditImage: function() {
		var {events, mixes, type, linkState, addImage, ...other} = this.props;
		if (type == 'festival') {
			// check if the current event_name exists in database
			var currentEvent = _.findWhere(events, {event: linkState('event_name').value});
			var showButton = true;
			if (currentEvent) {
				var imageSource = constants.S3_ROOT_FOR_IMAGES + currentEvent.image_url;
				var showButton = false;
			} else if (linkState('image').value) {
				var imageSource = linkState('image').value;
			} else {
				var imageSource = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
			}
			return (
				<div>
					<image className='image-preview' src={imageSource} />
					<Dropzone ref='dropzone' className="hidden" onDrop={addImage} multiple={false} />
					<button className={"step-button " + (showButton ? '':'invisible')} onClick={this.newImage}>
						Upload an image...
					</button>
				</div>
			);

		} else if (type == 'mix') {
			if (linkState('episode_name').value) {
				if (linkState('image').value) {
					var imageSource = linkState('image').value;
				} else {
					var imageSource = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
				}
			} else {
				var currentMix = _.findWhere(mixes, {mix: linkState('mix_name').value});
				if (currentMix) {
					var imageSource = constants.S3_ROOT_FOR_IMAGES + currentMix.image_url;
				} else {
					if (linkState('image').value) {
						var imageSource = linkState('image').value;
					} else {
						var imageSource = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
					}
				}
			}

			return (
				<div>
					<image className='image-preview' src={imageSource} />
					<Dropzone ref='dropzone' className="hidden" onDrop={addImage} multiple={false} />
					<button className="step-button" onClick={this.newImage}>
						Upload an image...
					</button>
				</div>
			);
		} else {
			if (linkState('image').value) {
				var imageSource = linkState('image').value;
			} else {
				var imageSource = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
			}
			return (
				<div>
					<image className='image-preview' src={imageSource} />
					<Dropzone ref='dropzone' className="hidden" onDrop={addImage} multiple={false} />
					<button className="step-button" onClick={this.newImage}>
						Upload an image...
					</button>
				</div>
			);
		}
	},

	submitStep: function(event) {
		var submission = {};
		this.props.stepForward(submission);
	},

	newImage: function(event) {
		this.refs.dropzone.open();
	},

	showFields: function() {
		var {events, type, mixes, ...other} = this.props;
		if (type == 'festival') {
			var eventOptions = _.map(events, function(event, index) {
				return (<option value={event.event} key={index} />);
			});
			return (
				<div>
					<input type='text' valueLink={this.props.linkState('event_name')} placeholder='event name' list='events' />
					<datalist id='events'>
						{eventOptions}
					</datalist>
				</div>
			);
		} else if (this.props.type == 'mix') {
			var mixOptions = _.map(mixes, function(mix, index) {
				return (<option value={mix.mix} key={index} />);
			});
			return (
			<div>
				<input type='text' valueLink={this.props.linkState('mix_name')} placeholder='mix name' list='mixes' />
				<datalist id='mixes'>
					{mixOptions}
				</datalist>
				<br />
				<input type='text' valueLink={this.props.linkState('episode_name')} placeholder='episode (optional)'/>
			</div>
			);
		} else {
			return (
				<div>
					<input type='text' valueLink={this.props.linkState('album_name')} placeholder='album name'/>
				</div>
			);
		}
	}
});

module.exports = WizardStep3;
