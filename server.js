var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/soundcloudcallback', function (req, res) {
    console.log('Soundcloud callback requested.');
    res.sendFile(path.resolve(__dirname, 'soundcloudcallback.html'));
});

app.use(function( req, res, next ) {
    for(var prop in req.query) {
        res.redirect('https://www.setmine.com/' + prop);
        return;
    }
    next();
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
    console.log('Server running on port ' + port);
});
