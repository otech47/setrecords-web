var React = require('react/addons');
import _ from 'underscore';
var constants = require('../constants/constants');
var Dropzone = require('react-dropzone');
import MockSetTileImproved from './MockSetTileImproved';
import UtilityFunctions from '../mixins/UtilityFunctions';

var WizardStep4 = React.createClass({
	mixins: [UtilityFunctions],
	render: function() {
		var {linkState, type, addImage, image, events, mixes, genres, setLength, ...other} = this.props;

		var setData = {};
		if (image.length > 0) {
			setData.image = image[0].preview;
		} else {
			setData.image = constants.S3_ROOT_FOR_IMAGES + constants.DEFAULT_IMAGE;
		}
		setData.artist = linkState('artist').value;
		setData.name = linkState('name').value;
		setData.set_length = this.secondsToMinutes(setLength);

		var fieldComponents;
		var options;
		var placeholderText;
		var showButton = true;

		if (type == 'album') {
			fieldComponents = (
				<input type='text' valueLink={linkState('name')} placeholder='album name' />
			);
		} else {
			if (type == 'festival') {
				options = _.map(events, function(event, index) {
					return (<option value={event.event} key={index} />);
				});
				placeholderText = 'event name';
				var match = _.findWhere(events, {event: linkState('name').value});
				if (match) {
					setData.image = constants.S3_ROOT_FOR_IMAGES + match.image_url;
					showButton = false;
				}
			} else {
				options = _.map(mixes, function(mix, index) {
					return (<option value={mix.mix} key={index} />);
				});
				placeholderText = 'mix name';
				var episodeField = (
					<input type='text' valueLink={linkState('episode')} placeholder='episode name (optional)' />
				);
				setData.episode = linkState('episode').value;
			}

			fieldComponents = (
				<div>
					<input type='text' valueLink={linkState('name')} list='fieldList' placeholder={placeholderText} />
					<datalist id='fieldList'>
						{options}
					</datalist>
					{episodeField ? episodeField : ''}
				</div>
			);
		}

		var genreOptions = _.map(genres, function(genre, index) {
			return (<option value={genre} key={index}/>);
		});

		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Enter your set information.</p>
				<div className='flex-row'>
					<div className='flex-column flex-fixed'>
						<input type='text' valueLink={linkState('artist')} placeholder='artists' />
						{fieldComponents}
						<input type='text' valueLink={linkState('genre')} placeholder='genre' list='genres'/>
						<datalist id='genres'>
							{genreOptions}
						</datalist>
					</div>
					<div className='flex-column flex-fixed'>
						<MockSetTileImproved setData={setData} />
						<Dropzone onDrop={addImage} ref='dropzone' className='hidden' multiple={false} />
						<button className={'step-button' + (showButton ? '':' invisible')} onClick={this.browse}>
							Upload an image...
						</button>
						<button className='step-button' onClick={this.submitStep}>
							Continue
						</button>
					</div>
				</div>
			</div>
		);
	},

	browse: function(event) {
		this.refs.dropzone.open();
	},

	submitStep: function(event) {
		var submission = {};
		this.props.stepForward(submission);
	}
});

module.exports = WizardStep4;
