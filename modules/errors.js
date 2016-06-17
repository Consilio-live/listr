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

/*
 * Object used when rendering a 500 error in error.ejs
 */
let error500 = {
    status: 500,
    err: "Internal server error",
    resolution: `
        There was an internal error on our web server. Unfortunately 
        this means there isn't much you can do on your end to fix 
        this.             
    `
};

/*
 * Object used when rendering a 404 error in error.ejs
 */
let error404 = {
    status: 404,
    err: "File not found",
    resolution: `
        Unfortunately the webpage you were looking for does not exist.
    `
};

/**
 * Error handler: A generic error handler for development purposes. It logs
 * the stack trace to the console, and renders error.ejs with the error 
 * message as the body.
 *
 * @param {Object} err - error thrown by express.
 * @param {Object} req - Client's request.
 * @param {Object} res - Server's response.
 * @param {Function} next - the next middleware function in the 
 * request-response cycle. 
 */
function errorHandler( err, req, res, next ) {
    console.error(err.stack);
    if (err.status === 500) {
        res.status(err.status).render('error', error500);
    } else {
        next(err);
    }
}

/** 
 * An error handling middleware for a 404 error. The lack of the err parameter
 * is because no other middleware function will be calling this one.
 *
 * @param {Object} req - Client's request.
 * @param {Object} res - Server's response.
 * @param {Function} next - the next middleware function
 */
function error404Handler( req, res, next ) {
    res.status(404).render('error', error404);
}

module.exports = {
    errorHandler: errorHandler,
    error404: error404Handler
};

