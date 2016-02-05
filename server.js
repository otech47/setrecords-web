var express = require('express');
var path = require('path');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var Router = require('react-router');
var hist = require('history');

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/soundcloudcallback', function (req, res) {
    res.sendFile(path.resolve(__dirname, 'soundcloudcallback.html'));
});

app.get('*', function (req, res) {

    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Server running on port ' + port);
});
