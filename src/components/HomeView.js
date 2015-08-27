var React = require('react');
var HomeSidebar = require('./HomeSidebar');
var HomeContainer = require('./HomeContainer');

var HomeView = React.createClass({

	render: function() {
		var data = this.props.appState.get('userData');
		return (
			<div id="home" className="view flex-row overlay-container">
				<HomeSidebar data={data}/>
				<HomeContainer data={data}/>
			</div>
		);
	}

});

module.exports = HomeView;