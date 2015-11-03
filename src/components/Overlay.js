import React from 'react';
import {Link} from 'react-router';

const Overlay = React.createClass({

	getDefaultProps() {
		return {
			hidden: false,
			icon: ''
		};
	},

	render() {
		var hidden = this.props.hidden ? 'hidden' : '';
		//TODO scroll to edit links on transition

		return (
			<Link className={`overlay flex-column ${hidden}`} to='/account'>
				<i className={`fa fa-fw fa-${this.props.icon}`} style={{margin: '3rem auto 1rem'}}/>
				<h2>{this.props.children}</h2>
			</Link>
		);
	}

});

export default Overlay;