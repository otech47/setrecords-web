import React from 'react';
import constants from '../constants/constants';
import BrowseView from './BrowseView';

var TITLE = 'Artists';
var Artists = React.createClass({

	componentWillMount: function() {
		 
	},
	render: function() {

		var data = this.props.appState.get('browseData');
		return (
			<BrowseView title={TITLE} data={data}/>
		);
	}

});

module.exports = Artists;