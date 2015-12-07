var auth = {
    isLoggedIn(callback) {
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/v/10/setrecordsuser/login',
        })
        .done((res) => {
            console.log('SUCCESS');
            console.log(res);
            callback(true);
        })
        .error((err) => {
            console.log("FAILURE");
            console.log(err);
            callback(false);
        });
    }
}

module.exports = auth;
