var gulp = require('gulp')
  , serve = require('gulp-serve')
  , concat = require('gulp-concat')
  , ts = require('gulp-typescript')
  , gulpWebpack = require('gulp-webpack')
  , webpack = require('webpack')
  , del = require('del')
  ;

// build the alm typescript files
gulp.task('alm', function() {
    return gulp.src('./src/alm/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            module: 'amd'
        }))
        .pipe(gulp.dest('./tmp/alm'));
});

// build the actual application files
gulp.task('make-app', function() {
    return gulp.src('./src/*.ts')
        .pipe(ts({
            noImplicitAny: false,
            module: 'amd'
        }))
        .pipe(gulp.dest('./tmp'));
});

// building on the previous two tasks create a javascript bundle
gulp.task('make', ['alm', 'make-app'], function() {


    return gulp.src('./tmp/app.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'bundle.js'
            }
        }))
        .pipe(gulp.dest('./static/js'));
});

// minify the bundle and copy all assets to dist
gulp.task('dist', ['make'], function() {

    // third party libraries
    gulp.src('./static/vendor/*.js')
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/'));

    gulp.src('./static/js/bundle.js')
        .pipe(gulpWebpack({
            output: {
                filename: 'bundle.js'
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin()
            ]
        }))
        .pipe(gulp.dest('./dist/js'));

    gulp.src('./static/css/*')
        .pipe(gulp.dest('./dist/css'));

});

// delete all but the necessary source files
gulp.task('clean', function() {
    del([
        './tmp/*.js',
        './tmp/alm/*.js',
        './static/js/*',
        './dist/*'
        ]);
});

gulp.task('serve', serve({
    root: ['./'],
    middleware: function(req, res, next) {
        if (req.url.startsWith('/dist')) {
            console.log('rerouting', req.url);
            var endpoint = req.url.slice(5);
            res.statusCode = 302;
            res.setHeader('Location', '/static' + endpoint);
            res.end();
        }
        next();
    }
}));
