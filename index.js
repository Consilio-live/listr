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
/*jslint node:true*/
/*jslint esversion:6*/
'use strict';
// my own modules

// misc imports
let ejs = require('ejs');


// setup express
let express = require('express');
let app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

// front-end third party libraries will be attached here
app.use('/assets/', express.static(__dirname + "/bower_components/"));
// front-end scripts, stylesheets, and images
app.use('/resources/', express.static(__dirname + "/public/"));

/**
 * Render the launch page of the application
 */
app.get("/", function( req, res ) {
    res.render('home');
});

app.listen(PORT, function() {
    console.log("Server process started at locahost:" + PORT);
});
