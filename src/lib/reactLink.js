var reactLink = module.exports = function(ctx) {
    var context = ctx;

    return function(fieldName) {
        return function(e) {
            e.preventDefault()
            context.setState({
                [fieldName]: e.target.value
            });
        };
    };
}
