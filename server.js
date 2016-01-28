var express = require('express');
var path = require('path');
var port = process.env.PORT || 8080;
var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/soundcloudcallback', function (req, res) {
    console.log('Soundcloud callback requested.');
    res.sendFile(path.resolve(__dirname, 'soundcloudcallback.html'));
});

var renderToString = require('react-dom/server/renderToString');
var match = require('react-router/match');
var RouterContext = require('react-router/RouterContext');
var routes = require('./routes/routes');

serve( function (req, res) {
  // Note that req.url here should be the full URL path from
  // the original request, including the query string.
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      // You can also check renderProps.components or renderProps.routes for
      // your "not found" component or route respectively, and send a 404 as
      // below, if you're using a catch-all route.
      res.status(200).send(renderToString(<RouterContext {...renderProps} />))
    } else {
      res.status(404).send('Not found')
    }
  })
})

app.listen(port, function () {
    console.log('Server running on port ' + port);
});
