var React = require('react');
import _ from 'underscore';

var ReactDatalist = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return (nextProps.options.length != this.props.options.length);
    },

    render: function() {
        var options = _.map(this.props.options, (option, index) => {
            return (<option value={option.optionName} key={option.optionName + '_' + index} />);
        });

        return (
            <datalist id={this.props.listId}>
                {options}
            </datalist>
        );
    }
});

module.exports = ReactDatalist;
