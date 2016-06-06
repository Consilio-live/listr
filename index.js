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
let morgan = require('morgan');
let path = require('path');

// setup express
let express = require('express');
let bodyParser = require("body-parser");
let app = express();
const PORT = process.env.PORT || 3000;
app.set('view engine', 'ejs');

/* 
 * Middleware:
 *      assets/ - front-end third party libraries
 *      rousources/ - front-end stylesheets, scripts, and images.
 *      / - we will have morgan attached to log http requests and body-parser
 *          to handle dealing with JSON data on post
 */
app.use('/assets/', express.static(path.join(__dirname, "bower_components")));
app.use('/resources/', express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use(bodyParser.json());

/**
 * Render the launch page of the application
 */
app.get("/", function( req, res ) {
    res.render('home', {
        user: true,
        list: [
            {
                id: 1,
                upc: 1024566,
                product: "pancakes",
                quantity: 12,
                needed: 13
            },
            {
                id: 2,
                upc: 1024567,
                product: "bananas",
                quantity: 4,
                needed: 3
            },
            {
                id: 3,
                upc: 1024568,
                product: "waffles",
                quantity: 17,
                needed: 10
            }
        ]

    });
});

/**
 * Add to the quantity of an object
 */
app.post("/add", function( req, res ){
    console.log(JSON.stringify(req.body));
});


app.listen(PORT, function() {
    console.log("Server process started at locahost:" + PORT);
});
