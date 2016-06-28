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

// main closure
(function() {
    'use strict';

    var app = angular.module("listr", [  ]);

    app.controller('item', ['$scope', '$http', '$log',
                            function ($scope, $http, $log) {
        /**
         * Load the list from the api using AJAX
         */
        angular.element(document).ready(function () {
            $http.get('/list').then(function(response) {
                // The data should be an JSON array
                var listArray = JSON.parse(response.data);
                $scope.list = listArray;
            }).catch(function(err) {
                $log.error(err.statusText);
                $log.error(err.data);
            });
        }); // end angular.element

        /**
         * Send that an item's quantity has been incremented to
         * the database.
         * @param {Object} item - the item to be sent back to the database
         */
        $scope.sendAdd = function ( item ) {
            $http.post('/add', item).then(function ( response ) {
                $scope.list = JSON.parse(response.data);
            }).catch(function ( err ) {
                $log.error(err.statusText);
                $log.error(err.data);
            });
        }; // end sendAdd

        /**
         * Sends to the backend api that an item's onHand has just
         * been decremented
         * @param {Object} item - the item to be sent back to the database
         */
        $scope.sendSub = function( item ) {
            $http.post('/sub', item).then(function ( response ) {
                $scope.list = JSON.parse(response.data);
            }).catch(function ( err ) {
                $log.error(err.statusText);
                $log.error(err.data);
            });
        }; // end sendSub

    }]); // end controller

})(); // end main IIFE
