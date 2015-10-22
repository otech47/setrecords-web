import React from 'react';

var Icon = React.createClass({

	render() {
		return (
			<i className='fa-fw material-icons'>
				{this.props.children}
			</i>
		);
	}

});

module.exports = Icon;