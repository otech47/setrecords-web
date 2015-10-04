var React = require('react/addons');
import _ from 'underscore';
import async from 'async';
import ReactDatalist from 'react-datalist';

var WizardStep3 = React.createClass({
	render: function() {
		var {genres, linkState, stepForward, ...other} = this.props;
		return (
			<div className="flex-column wizard-step">
				<p className='step-info set-flex'>Enter your set's information.</p>
				{this.showFields()}
				<input type='text' valueLink={linkState('genre')} placeholder='genre' list='genres'/>
				<datalist id='genres'>
					{genres}
				</datalist>
				<button className={'step-button'} onClick={stepForward}>
					Continue
				</button>
			</div>
		);
	},

	showFields: function() {
		if (this.props.type == 'festival') {
			return (
				<div>
					<input type='text' valueLink={this.props.linkState('event_name')} placeholder='event name' list='events' />
					<datalist id='events'>
						{this.props.events}
					</datalist>
				</div>
			);
		} else if (this.props.type == 'mix') {
			return (
			<div>
				<input type='text' valueLink={this.props.linkState('mix_name')} placeholder='mix name' list='mixes' />
				<datalist id='mixes'>
					{this.props.mixes}
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
