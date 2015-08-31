var React = require('react');
import ContentView from './ContentView';

var Home = React.createClass({
	render: function() {
		return (
			<div>
				<ContentView appState={this.props.appState}/>
			</div>
		);
	}
});

module.exports = Home;