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

    /** 
     * Goes through each row of the list and checks if the quantity of the item 
     * is lower than what is needed of it. If it is less than mark the row as
     * red, otherwise mark it as green. If they are the same than mark it as 
     * yellow.
     */
    function checkQuantity() {
        $("tr").each(function() {
            var $needed = $(this).find("td.needed");
            var $quantity = $(this).find("td.quantity");
            var needNumber = Number.parseInt($needed.text());
            var quantityNumber = Number.parseInt($quantity.text());

            if (needNumber > quantityNumber) {
                $(this).addClass("low");
            } else if (needNumber === quantityNumber) {
                $(this).addClass("running-low");
            } else {
                $(this).addClass("enough");
            }
        });
    }

    /**
     * When the user clicks on the add button in an item's row then the new 
     * quantity is updated in the UI and POSTed via AJAX to the server as JSON.
     */
    function addToQuantity() {
        $("button.add").on("click", function() {
            var itemId = $(this).attr("value");
            var quantitySelector = "tr#" + itemId + " td.quantity";
            var oldQuantity = Number.parseInt($(quantitySelector).text(), 10);
            var newQuantity = oldQuantity + 1;
            $(quantitySelector).text(newQuantity);
            checkQuantity();

            $.ajax({
                type: "POST",
                contentType: "application/json",
                dataType: "json",
                url: "/add",
                data: JSON.stringify({
                    id: itemId,
                    quantity: newQuantity
                }),
                success: function(data) {
                    console.log(JSON.stringify(data));
                },
                error: function(jqXHR, err) {
                    console.log(err);
                }
            }); // end ajax
        }); // end button.add 
    } // end addToQuantity

    $(document).ready(function(){
        addToQuantity();
        checkQuantity();
    });// end document.ready
})();
