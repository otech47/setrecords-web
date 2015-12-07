import React from 'react';
import {History} from 'react-router';
import Icon from './Icon';

var ConfirmChanges = React.createClass({

	mixins: [History],

	render() {
		return (
			<div id='ConfirmChanges' style={this.props.style}>
				<div className='modal flex-column'>
					<p className='center'>{this.props.children}</p>
					<div className='flex-row'>
						<Icon onClick={() => this.history.push(null, '/')}>done</Icon>
						<Icon onClick={this.props.cancel}>close</Icon>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = ConfirmChanges;
