import React from 'react';

var Icon = React.createClass({

	getDefaultProps() {
		return {
			onClick: null,
			className: ''
		};
	},

	render() {
		return (
			<i className={`fa-fw material-icons ${this.props.className}`} onClick={this.props.onClick}>
				{this.props.children}
			</i>
		);
	}

});

module.exports = Icon;