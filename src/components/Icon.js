import React from 'react';

var Icon = React.createClass({

	getDefaultProps() {
		return {
			onClick: null,
			className: '',
			style: {}
		};
	},

	render() {
		return (
			<i className={`fa material-icons ${this.props.className}`} onClick={this.props.onClick} style={this.props.style}>
				{this.props.children}
			</i>
		);
	}

});

module.exports = Icon;
