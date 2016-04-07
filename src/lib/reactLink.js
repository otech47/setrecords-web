var reactLink = module.exports = function(ctx) {
    var context = ctx;

    return function(name) {
        var fieldName = name;
        return {
            value: context.state[fieldName],
            requestChange: function(newValue) {
                var newState = {};
                newState[fieldName] = newValue;
                context.setState(newState);
            }
        };
    }
}
