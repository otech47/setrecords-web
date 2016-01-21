var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/soundcloudcallback', function (req, res) {
    console.log('Soundcloud callback requested.');
    res.sendFile(path.resolve(__dirname, 'soundcloudcallback.html'));
});

app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
    console.log('Server running on port ' + port);
});
