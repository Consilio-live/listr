/**
 * This file is part of listr.
 *
 * listr is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * listr is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with listr.  If not, see <http://www.gnu.org/licenses/>.
 */
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
        ext: 'js',
        ignore: ['node_modules/', 'public/']
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
