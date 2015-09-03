var auth = {
  login: function(user, pass, cb) {
    cb = arguments[arguments.length - 1];
    if (localStorage.token) {
      if (cb) 
        cb(true);
      this.onChange(true);
      return;
    }

    this.passportRequest(user, pass, (res) => {
      if (res.user.authenticated) {
        localStorage.token = JSON.stringify(res.user);
        if (cb) 
          cb(true);
        this.onChange(true);
      } else {
          if (cb) 
            cb(false);
          this.onChange(false);
      }
    });
  },

  getToken: function () {
    return localStorage.token;
  },

  logout: function (cb) {
    delete localStorage.token;
    if (cb) 
      cb();
    this.onChange(false);
  },

  loggedIn: function () {
    return !!localStorage.token;
  },

  onChange: function() {
  },
  
  passportRequest: function (user, pass, cb) {
    $.ajax({
      type: "POST",
      url: 'http://localhost:3000/setrecords/login/v2',
      data: {
        username: user,
        password: pass
      },
      success: function(res) {
        cb(res);
      },
      error: function(err) {
        cb(err);
      }
    });
  }
}

module.exports = auth;