import api from './api';

var auth = {
    loggedIn: function (cb) {
        console.log('Checking logged in status...');
        api.post('setrecordsuser/login', {})
            .then( (res) => {
                console.log(res);
                cb('fake error', 'fake artistId');
            });
        // $.ajax({
        //     type: 'post',
        //     url: requestUrl,
        //     crossDomain: true,
        //     xhrFields: {
        //         withCredentials: true
        //     }
        // })
        // .done((res) => {
        //     cb(null, res.payload.artist_id);
        // })
        // .fail((err) => {
        //     cb(err);
        // });
    },

    logIn: function (user, pass, cb) {
        console.log('Logging in...');
        cb = arguments[arguments.length - 1];

        this.loggedIn((err, artistId) => {
            console.log('Result');
            console.log(err);
            console.log(artistId);
            if (artistId) {
                // this.onChange(artistId);
                if (cb) {
                    cb(null, artistId);
                }
                return;
            }

            this.submitCredentials(user, pass, (res) => {
                if (res.status == 'success') {
                    // this.onChange(res.payload.setrecordsuser_login.artist_id);
                    if (cb) {
                        cb(null, res.payload.setrecordsuser_login.artist_id);
                    }
                } else {
                    // this.onChange();
                    if (cb) {
                        cb(res.responseJSON.error);
                    }
                }
            });
        });
    },

    logOut: function (cb) {
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/logout';

        $.ajax({
            type: 'get',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            if (cb) {
                cb();
            }
            this.onChange(false);
        })
        .fail((err) => {
            console.log(err);
        });
    },

    onChange: function () {},

    submitCredentials: function (user, pass, cb) {
        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/login';
        $.ajax({
            type: 'POST',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                username: user,
                password: pass
            }
        })
        .done((res) => {
            cb(res);
        })
        .fail((err) => {
            cb(err);
        });
    },
};

module.exports = auth;
