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

module.exports = function ( knex ) {
    let sqlFunctions = {  };
    
    /**
     * respond with the resulting rows of the sql query 
     * respresented with a JSON array 
     * 
     * @param {object} res  - the express response object
     * @param {Array}  rows - an array of objects representing the 
     *                      result of the sql query 
     */
    sqlFunctions.sendRows = function ( res, rows ) {
        let rowJSON = JSON.stringify(rows);
        res.json(rowJSON);
    };
    
    /**
     * Get the list of user with the id 'userId'
     *
     * @param   {number} userId - id of user 
     * @returns {object} promise based knex query object. 
     */
    sqlFunctions.getList = function ( userId ) {
        return knex.select().from("Item");
    }
    
    return sqlFunctions;
};