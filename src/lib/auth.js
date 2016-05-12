import api from './api';

var auth = module.exports = (function() {
    return {
        loggedIn: function() {
            return new Promise((resolve, reject) => {
                api.post('setrecordsuser/login')
                    .then((response) => {
                        resolve(response.payload.artist.id);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        },

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
                    console.log('==auth err===');
                    console.log(err);

                    reject(err);
                });
            });
        },

        logout: function() {
            return api.get('setrecordsuser/logout', null);
        }
    }
})();
