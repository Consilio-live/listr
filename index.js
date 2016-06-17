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
let errors = require('./modules/errors.js');

// misc imports
let ejs = require('ejs');
let path = require('path');
let knex = require('knex')({
    client: process.env.DBCLIENT,
    connection: {
        filename: process.env.DB
    }, 
    useNullAsDefault: false
});

// setup express
let express = require('express');
let bodyParser = require("body-parser");
let morgan = require('morgan');
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
app.get("/", function( req, res, next ) {
    knex.select().from('Item')
    .then(function(data) {
        res.render('home', {
            user: true,
            list: data
        });
    })
    .catch(function(error) {
        let error500 = new Error('Our server has ran into some trouble');
        error500.status = 500;
        console.error(error500.stack);
        next(error500);
    });
}); // end app.get('/')

/**
 * Add to the quantity of an object
 */
app.post("/add", function( req, res ){
    let id = req.body.id;

    knex("Item").select().where('id', id)
    .then(function(row) {
        let onHand = row[0].onHand + 1;
        console.log(row);
        knex('Item').update('onHand', onHand).where('id', id);
    })
    .catch(function(error) {
        console.error(error);
    });
});

/**
 * Remove one from the quantity of an item
 */
app.post("/remove", function( req, res ){
    console.log(JSON.stringify(req.body));
});

// error handling middleware
app.use(errors.error404);
app.use(errors.errorHandler);


app.listen(PORT, function() {
    console.log("Server process started at locahost:" + PORT);
});
