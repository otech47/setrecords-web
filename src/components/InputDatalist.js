var React = require('react/addons');
import _ from 'underscore';

var InputDatalist = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		if (nextState == this.state && nextProps.options == this.props.options) {
			return false;
		} else {
			return true;
		}
	},
	getInitialState: function() {
		if (this.props.isArray) {
			var options = _.map(this.props.options, function(option, index) {
				return (<option
						value={option}
						key={option + '_' + index} />);
			});
		} else {
			var objKey = this.props.objKey;
			var options = _.map(this.props.options, function(option, index) {
				return (<option
						value={option[objKey]}
						key={option[objKey] + '_' + index} />);
			});
		}
		var datalist = (
			<datalist id={this.props.listKey}>
				{options}
			</datalist>
		);
		return {
			datalist: datalist
		};
	},
	render: function() {
		var linkState = this.props.linkState;
		return (
			<div>
				<input type='text' required placeholder={this.props.placeholder} ref='field' list={this.props.listKey} valueLink={linkState(this.props.link)} />
				{this.state.datalist}
			</div>
		);
	},
	getField: function() {
		return React.findDOMNode(this.refs.field).value;
	}
});
module.exports = InputDatalist;
