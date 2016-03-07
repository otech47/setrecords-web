import {API_GRAPH, API_ROOT} from '../constants/constants';

module.exports = {
    get(route, callback) {
        return (
            $.ajax({
                type: 'get',
                url: API_ROOT + route,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(res => {
                return callback(null, res);
            })
            .fail(err => {
                return callback(err);
            });
        )
    }

    graph(query, callback) {
        return (
            $.ajax({
                type: 'get',
                url: API_GRAPH,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    query: query
                }
            })
            .done(res => {
                return callback(null, res);
            })
            .fail(err => {
                return callback(err);
            });
        )
    }

    post(route, data, callback) {
        return (
            $.ajax({
                type: 'post',
                url: API_ROOT + route,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                data: data
            })
            .done(res => {
                return callback(null, res);
            })
            .fail(err => {
                return callback(err);
            })
        )
    }
};
