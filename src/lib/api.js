var api = {
    get: function(url, data) {
        return {
            type: "GET",
            url: url,
            dataType: "jsonp",
            crossDomain: true,
            data: data
        };
    },

    post: function(url, data) {
        return {
            type: "POST",
            url: url,
            dataType: "jsonp",
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: data
        };
    }
};

module.exports = api;

