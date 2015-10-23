import React from 'react';
import Icon from './Icon';

var ConfirmChanges = React.createClass({

	render() {
		var statusIcons = ['done_all', 'error_outline'];

		return (
			<div id='ConfirmChanges' style={this.props.style}>
				<div className='modal flex-column'>
					<p className='center'>{this.props.children}</p>
					<div className='flex-row'>
						<Icon onClick={this.props.applyChanges}>done</Icon>
						<Icon>close</Icon>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = ConfirmChanges;