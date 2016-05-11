import api from './api';

var auth = module.exports = (function() {
    return {
        login: function(user, pass) {
            return new Promise((resolve, reject) => {
                api.post('setrecordsuser/login', {
                    username: user,
                    password: pass
                })
                .then((response) => {
                    console.log('==response===');
                    console.log(response);

                    resolve(response.payload.setrecordsuser_login.artist.id);
                })
                .catch((err) => {
                    reject(err);
                });
            });
        },

        logout: function() {
            return api.get('setrecordsuser/logout')
                .then((response) => {
                    console.log(response);
                });
        }
    }
})();
