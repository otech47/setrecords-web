import api from './api';

var auth = module.exports = (function() {
    return {
        login: function(email, password) {
            return new Promise( function(resolve, reject) {
                api.graph({
                    operation: 'mutation',
                    query: `
                        mutation
                    `
                })
            })
        }
    }
})();

export default {
    login(user, pass) {
        return new Promise((resolve, reject) => {
            api.post('setrecordsuser/login', {
                username: user,
                password: pass
            })
            .then((res) => {
                resolve(res.payload.setrecordsuser_login.artist_id);
            })
            .catch((err) => {
                reject(err);
            });
        });
    },

    logout() {
        return api.get('setrecordsuser/logout');
    }
}
