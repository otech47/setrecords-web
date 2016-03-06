import {API_GRAPH, API_ROOT} from '../constants/constants';

module.exports = {
    graph(query) {
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
                return res;
            })
            .fail(err => {
                return err;
            })
        )
    },

    post(route, data) {
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
                return res;
            })
            .fail(err => {
                return err;
            })
        )
    }
};
