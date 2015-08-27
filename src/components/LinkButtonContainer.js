import React from 'react';

var LinkButtonContainer = React.createClass({
	render: function() {
		var linkItems = [];
		this.props.links.map(function(link, index) {
			var classString = "fa fa-fw fa-2x click fa-" + link.type;
			linkItems.push(<a className='flex' href={link.url} ><i className={classString}/></a>);
		});
		return (
			<div className="flex-row links-container">{linkItems}</div>
		);
	}

});

module.exports = LinkButtonContainer;