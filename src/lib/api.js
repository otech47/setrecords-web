import {API_GRAPH, API_ROOT} from '../constants/migrationConstants';

var api = module.exports = (function() {
    var handleErrors = function(response) {
        if (response && response.status == 'failure') {
            return Promise.reject(response.error);
        } else {
            return Promise.resolve(response.payload);
        }
    }

    return {
        get: function(route, query) {
            return (
                fetch(API_ROOT + route, {
                    method: 'get',
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(query)
                })
                .then(handleErrors)
            );
        },

        graph: function(params) {
            var requestData = (params.operation == 'query' ?
                {query: JSON.stringify(params.query)}
                :
                {mutation: JSON.stringify(params.query)});

            return (
                fetch(API_GRAPH, {
                    type: 'get',
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    data: requestData
                })
                .then(handleErrors)
            );
        },

        post: function(route, data) {
            return (
                fetch(API_ROOT + route, {
                    method: 'POST',
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: true
                    },
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                })
                .then( function(response) {
                    return response.json();
                })
                .then(handleErrors)
            );
        }
    };
})();
