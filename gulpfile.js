var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');

var path = {
  JS: './public/js/src/index.jsx',
  OUT: 'index.js',
  DEST_BUILD: 'public/js/build/',
  DEST_SRC: 'public/js/src/*.jsx'
};

gulp.task('watch', function() {
  browserify(path.JS, {
    debug: true
  })
  .transform(reactify)
  .bundle()
  .pipe(source(path.OUT))
  .pipe(gulp.dest(path.DEST_BUILD));

})

// gulp.task('watch', function() {
//     var bundler = browserify({
//       entries: [path.JS], // Only need initial file, browserify finds the deps
//       transform: [reactify], // We want to convert JSX to normal javascript
//       debug: true, // Gives us sourcemapping
//       cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
//     });

//     var watcher  = watchify(bundler);

//     return watcher.on('update', function () { // When any files update
//         var updateStart = Date.now();
//         console.log('Updating!');
//         watcher.bundle() // Create new bundle that uses the cache for high performance
//         .pipe(source(path.OUT))
//     // This is where you add uglifying etc.
//         .pipe(gulp.dest(path.DEST_BUILD));
//         console.log('Updated!', (Date.now() - updateStart) + 'ms');
//     })
//     .bundle() // Create the initial bundle when starting the task
//     .pipe(source(path.OUT))
//     .pipe(gulp.dest(path.DEST_BUILD));
// })

gulp.task('default', ['watch']);