var React = require('react/addons');
import _ from 'underscore';
var constants = require('../constants/constants');
var Dropzone = require('react-dropzone');
import MockSetTileImproved from './MockSetTileImproved';
import UtilityFunctions from '../mixins/UtilityFunctions';
import ReactDatalist from './ReactDatalist';

var WizardStep4 = React.createClass({
	render: function() {
		var linkState = this.props.linkState;
		var mockImage = null;
		if (this.props.image) {
			mockImage = this.props.image.preview;
		}
		var artists = this.props.originalArtist;
		var showUploadButton = true;
		var fieldComponents;
		var featuredArtistComponent = '';
		if (this.props.type == 'Album') {
			fieldComponents = (
				<input type='text' valueLink={linkState('name')} placeholder='Album Name' />
			);
		} else {
			var featuredArtistFields = _.map(this.props.featuredArtists, (function(artist, index) {
				return (
					<tr key={index}>
					<td>
						<input type='text' value={artist} onChange={this.props.changeFeaturedArtist.bind(null, index)} />
					</td>
					<td>
						<button onClick={this.props.removeFeaturedArtist.bind(null, index)}><i className='fa fa-times warning'></i></button>
					</td>
					</tr>);
			}).bind(this));
			if (this.props.featuredArtists.length > 0) {
				featuredArtistComponent = (
				<table>
					<tbody>
						{featuredArtistFields}
					</tbody>
				</table>
				);
			}
			if (this.props.type == 'Live') {
				var eventMatch = this.props.eventLookup[linkState('name').value];
				if (eventMatch) {
					mockImage = constants.S3_ROOT_FOR_IMAGES + eventMatch.image_url;
					showUploadButton = false;
				}
				var placeholder = 'Event Name';
				var listId = 'event-list';
			} else {
				var placeholder = 'Mix Name';
				var listId = 'mix-list';
				var episodeField = (
					<input type='text' placeholder='Episode Name' valueLink={linkState('episode')} />
				);
			}

			fieldComponents = (
				<div>
					<input type='text' valueLink={linkState('name')} placeholder={placeholder} list={listId} />
					{episodeField ? episodeField : ''}
				</div>
			);
			if (this.props.featuredArtists.length > 0) {
				artists += ' feat. ' + this.props.featuredArtists.join(', ');
			}
		}

		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Enter your set information.</p>
				<div className='flex-row'>
					<div className='flex-column flex-fixed'>
						Featured Artists <button onClick={this.props.addFeaturedArtist} className='step-button'>Add</button>
						{featuredArtistComponent}
						{fieldComponents}
						<input type='text' valueLink={linkState('genre')} placeholder='Genre' list='genre-list' />
					</div>
					<div className='flex-column flex-fixed'>
						<MockSetTileImproved image={mockImage} artist={artists} name={linkState('name').value} episode={this.props.type == 'Mix' ? linkState('episode').value : ''} setLength={this.props.setLength} popularity={0} />
						<Dropzone ref='dropzone'
								onDrop={this.props.addImage}
								className='hidden'
								multiple={false} />
						<button className={'step-button' + (showUploadButton ? '':' invisible')} onClick={this.browse}>
							Upload an image...
						</button>
						<button className='step-button' onClick={this.submitStep}>
							Continue
						</button>
						<ReactDatalist key='event-datalist' options={this.props.events} objKey='event' listId='event-list' isArray={false} />
						<ReactDatalist key='mix-datalist' options={this.props.mixes} objKey='mix' listId='mix-list' isArray={false} />
						<ReactDatalist key='genre-datalist' options={this.props.genres} isArray={true} listId='genre-list' />
					</div>
				</div>
			</div>
		);
	},

	browse: function(event) {
		this.refs.dropzone.open();
	},

	submitStep: function(event) {
		var artistEmptyErr = false;
		var linkState = this.props.linkState;
		var nameEmptyErr = false;
		var genreErr = false;
		var errors = [];

		if (linkState('artist').value == '') {
			artistEmptyErr = true;
			errors.push('Artist field cannot be empty.');
		}
		if (linkState('name').value == 0) {
			nameEmptyErr = true;
			errors.push('Name cannot be empty.');
		}
		if (this.props.genres.indexOf(linkState('genre').value) == -1) {
			genreErr = true;
			errors.push('Genre must be selected from dropdown.');
		}
		if (errors.length == 0) {
			var submission = {};
			submission['match_url'] = null;
			if (this.props.type == 'Live') {
				var match = this.props.eventLookup[linkState('name').value];
				if (match) {
					submission['match_url'] = constants.S3_ROOT_FOR_IMAGES + match.image_url;
				}
			}
			this.props.stepForward(submission);
		} else {
			alert('Please correct the following errors, then click Continue:\n' + errors.join('\n'));
		}
	}
});

module.exports = WizardStep4;
