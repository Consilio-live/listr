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

let sql = require('./modules/sql.js')(knex);

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
 * api for getting the list of the user with id 'userId'
 */
app.get('/list/:userId', function( req, res, next ) {
    knex.select().from('Item').then(function( data ) {
        sql.sendRows(res, data); 
    }).catch(function(error) {
        let error500 = errors.setupError(`
            Error retrieving the user's list from the database
        `, 500);
        next(error500);
    });
}); // end app.get('/list')

// TODO: test this stuff.
///**
// * API for adding a new Item onto the list.
// */
//app.post('/list/:userId', function( req, res, next ) {
//    let item = req.body;
//    
//    console.log(item);
//    
//    knex('Item').insert({
//        upc: item.upc,
//        product: item.product,
//        onHand: item.onHand,
//        needed: item.needed
//    }).then(sql.getList).then(function ( rows ) {
//        sendRows(res, rows);
//    }).catch(function ( err ) {
//        let error500 = errors.setupError(`
//            Error adding new item to the user's list
//        `, 500);
//        next(error500);
//    });
//}); // end app.post(list)

/**
 * API for getting the metadata of an item with the id of 'id'
 */
app.get("/item/:id", function ( req, res, next ) {
    let itemId = req.params.id;
    
    knex.select().from('Item').where('id', itemId).then(function ( row ) {
        sql.sendRows(res, row);
    }).catch(function ( err ) {
        let error500 = errors.setupError(`
            Error adding retrieving item with the id ${ itemId }
        `, 500);
        next(error500);
    })
});

/**
 * API for updating the quantity of an item with the id of 'id'.
 * The body of the request should have the type of change which
 * could be either add or subtract.
 */
app.post("/item/:id", function (req, res, next) {
    let itemId = req.params.id;
    let itemOnHand = req.body.onHand;
    let change = req.body.change;
    
    if (change === "add") {
        itemOnHand += 1;
    } else {
        itemOnHand -= 1;
    }
    
    knex("Item").where('id', itemId).update({
        onHand: itemOnHand 
    }).then(sql.getList).then(function ( rows ) {
        sql.sendRows(res, rows); 
    }).catch(function ( err ) {
        let error500 = errors.setupError(`
            Error editing item with the id ${ itemId }
        `, 500);
        next(error500);
    });
    
});

/**
 * delete the item with the id of 'id' from the database 
 */
app.delete("/item/:id", function ( req, res, next ){
    let itemId = req.params.id;
    
    knex('Item').where('id', itemId).del().then(
        sql.getList
    ).then(function ( rows ) {
        sql.sendRows(res, rows); 
    }).catch(function ( err ) {
        let error500 = errors.setupError(`
            Error editing item with the id ${ itemId }
        `, 500);
        next(error500);
    });
});

///**
// * Add to the quantity of an object
// */
//app.post("/add", function ( req, res, next ){
//    let item = req.body;
//    item.onHand += 1;
//
//    knex("Item").where('id', '=', item.id.toString()).update({
//        onHand: item.onHand
//    }).then(function () {
//        return knex.select().from("Item")
//    }).then(function ( rows ) {
//        let rowJSON = JSON.stringify(rows);
//        res.json(rowJSON);
//    }).catch(function ( err ) {
//        let error500 = errors.setupError(`
//            Error adding to the quantity of an item in the user's
//            list
//        `, 500);
//        next(error500);
//    });
//});
//
///**
// * Remove one from the quantity of an item
// */
//app.post("/sub", function( req, res, next ){
//    let item = req.body;
//    item.onHand -= 1;
//
//    knex("Item").where('id', '=', item.id.toString()).update({
//        onHand: item.onHand
//    }).then(function () {
//        return knex.select().from("Item")
//    }).then(function ( rows ) {
//        let rowJSON = JSON.stringify(rows);
//        res.json(rowJSON);
//    }).catch(function ( err ) {
//        let error500 = errors.setupError(`
//            Error subtracting to the quantity of an item in the
//            user's list
//        `, 500);
//        next(error500);
//    })
//
//});

// error handling middleware
app.use(errors.error404);
app.use(errors.errorHandler);


app.listen(PORT, function() {
    console.log("Server process started at locahost:" + PORT);
});
