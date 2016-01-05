var auth = {
    loggedIn: function (cb) {
        console.log('Checking log in status...');

        var requestUrl = 'https://api.setmine.com/v/10/setrecordsuser/login';

        $.ajax({
            type: 'post',
            url: requestUrl,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((res) => {
            console.log('==LOGGED IN==');
            console.log(res);
            cb(res.payload.artist_id);
        })
        .fail((err) => {
            console.log(err);
            cb();
        });
    },

    logIn: function (user, pass, cb) {
        console.log('Logging in...');
        cb = arguments[arguments.length - 1];

        this.loggedIn((artistId) => {
            if (artistId) {
                if (cb) {
                    cb(true);
                }
                this.onChange(artistId);
                return;
            }

            console.log('No session exists, attempting to submit credentials.');
            this.submitCredentials(user, pass, (res) => {
                if (res.status == 'success') {
                    this.onChange(res.payload.setrecordsuser_login.artist_id);
                    if (cb) {
                        cb(true);
                    }
                } else {
                    if (cb) {
                        cb(false);
                    }
                    this.onChange();
                }
            });
        });
    },

    logOut: function (cb) {
        console.log('Logging out...');

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
        console.log('==SUBMIT CREDENTIALS==');
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
            console.log(res);
            cb(res);
        })
        .fail((err) => {
            console.log(err);
            cb(err);
        });
    },
};

module.exports = auth;
