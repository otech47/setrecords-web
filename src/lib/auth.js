import api from './api';

module.exports = {
    loggedIn: function (cb) {
        api.post('setrecordsuser/login', {}, (err, res) => {
            if (err) {
                cb(err);
            } else {
                cb(null, res.artist_id);
            }
        });
    }

    logIn: function (user, pass, cb) {
        cb = arguments[arguments.length - 1];

        this.loggedIn((err, artistId) => {
            if (err) {
                cb(err);
            } else {
                cb(null, res.payload.setrecordsuser_login.artist_id);
                return;
            }
        }

        this.submitCredentials(user, pass, (err, artistId) => {
            if (err) {
                cb(err);
            } else {
                cb(null, artistId);
            }
        });
    }

    logOut: function (cb) {
        api.get('setrecordsuser/logout', (err) => {
            cb(err);
        });
    }

    submitCredentials: function (user, pass, cb) {
        api.post('setrecordsuser/login', {username: user, password: pass}, (err, res) => {
            if (err) {
                cb(err);
            } else {
                cb(null, res.setrecordsuser_login.artist_id);
            }
        });
    }
};
