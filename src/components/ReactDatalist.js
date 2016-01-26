var React = require('react');
import _ from 'underscore';

var ReactDatalist = React.createClass({
    shouldComponentUpdate: function(nextProps, nextState) {
        return (nextProps.options.length != this.props.options.length);
    },

    render: function() {
        var optionObjects = this.props.options;

        if (this.props.sort) {
            optionObjects = _.sortBy(optionObjects, 'optionName');

            if (this.props.sort == 'DESC') {
                optionObjects.reverse();
            }
        }

        var options = _.map(optionObjects, (option, index) => {
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
