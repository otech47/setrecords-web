import {API_GRAPH, API_ROOT} from '../constants/constants';

export default {
    get(route, query) {
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

    graph(params) {
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

    post(route, data) {
        return (
            fetch(API_ROOT + route, {
                method: 'post',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(handleErrors)
        );
    }
};

function handleErrors(response) {
    if (!response.ok) {
        return Promise.reject(response.statusText);
    } else {
        return response.json();
    }
}
