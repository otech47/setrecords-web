import React from 'react';
import {History} from 'react-router';
import Icon from './Icon';

var Notification = React.createClass({

	getDefaultProps() {
		return {
			style: {}
		};
	},

	render() {
		return (
			<div id='Notification' style={this.props.style}>
				<div className='modal flex-column'>
					<p className='center'>{this.props.children}</p>
					<div className='flex-row'>
						<Icon onClick={this.props.dismiss}>done</Icon>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = Notification;