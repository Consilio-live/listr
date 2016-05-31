var gulp = require('gulp');

// gulp plugins
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');
var open = require('gulp-open');
var browserSync = require('browser-sync').create();

// linting 
gulp.task('lint', function() {
    return gulp.src(__dirname).pipe(jshint())
            .pipe(jshint.reporter('default'));
});


// restart the app when files change
gulp.task('watch', function() {
 // load in the environment variables for the DB and PORT
    env({
        file: __dirname + '/data/env.json' 
    });

    nodemon({
        script: 'index.js',
        ext: 'js'
    });

});


// initiate browserSync and add it to the tasks array
gulp.task("serve", ['watch'], function() {
    browserSync.init(null, {
        proxy:"localhost:3000",
        files: ["public/**/*.*", "views/*.ejs"],
        browser: "google-chrome",
        port: 7000
    });
});

gulp.task('default', ['serve']);
