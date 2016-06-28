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
    client: "mysql",
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DB
    }
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
        let error500 = errors.setupError(`
            Error retrieving the user's list from the database
        `, 500);
        next(error500);
    });
}); // end app.get('/')

/**
 * REST api for getting the user's own list
 */
app.get('/list', function( req, res, next ) {
    knex.select().from('Item').then(function( data ) {
        var listArray = JSON.stringify(data);
        res.json(listArray);
    }).catch(function(error) {
        let error500 = errors.setupError(`
            Error retrieving the user's list from the database
        `, 500);
        next(error500);
    });
}) // end app.get('/list')

/**
 * Add to the quantity of an object
 */
app.post("/add", function ( req, res, next ){
    let item = req.body;
    item.onHand += 1;

    knex("Item").where('id', '=', item.id.toString()).update({
        onHand: item.onHand
    }).then(function () {
        return knex.select().from("Item")
    }).then(function ( rows ) {
        let rowJSON = JSON.stringify(rows);
        res.json(rowJSON);
    }).catch(function ( err ) {
        let error500 = errors.setupError(`
            Error adding to the quantity of an item in the user's
            list
        `, 500);
        next(error500);
    });
});

/**
 * Remove one from the quantity of an item
 */
app.post("/sub", function( req, res, next ){
    let item = req.body;
    item.onHand -= 1;

    knex("Item").where('id', '=', item.id.toString()).update({
        onHand: item.onHand
    }).then(function () {
        return knex.select().from("Item")
    }).then(function ( rows ) {
        let rowJSON = JSON.stringify(rows);
        res.json(rowJSON);
    }).catch(function ( err ) {
        let error500 = errors.setupError(`
            Error subtracting to the quantity of an item in the
            user's list
        `, 500);
        next(error500);
    })

});

// error handling middleware
app.use(errors.error404);
app.use(errors.errorHandler);


app.listen(PORT, function() {
    console.log("Server process started at locahost:" + PORT);
});
