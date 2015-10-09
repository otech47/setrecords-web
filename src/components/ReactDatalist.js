var React = require('react');
import _ from 'underscore';

var ReactDatalist = React.createClass({
    shouldComponentUpdate: function() {
        return false;
    },
    render: function() {
        if (this.props.isArray) {
            var options = _.map(this.props.options, function(option, index) {
                return (<option value={option} key={option + '_' + index} />);
            });
        } else {
            var objKey = this.props.objKey;
            var options = _.map(this.props.options, function(option, index) {
                return (<option value={option[objKey]} key={option[objKey] + '_' + index} />);
            });
        }
        return (
            <datalist id={this.props.listId}>
                {options}
            </datalist>
        );
    }
});

module.exports = ReactDatalist;
