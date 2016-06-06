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
    function colorizeRows() {
        $("tr").each(function() {
            var id = $(this).attr("id");
            var $needed = $(this).find("td.needed");
            var $quantity = $(this).find("td.quantity");
            var needNumber = Number.parseInt($needed.text());
            var quantityNumber = Number.parseInt($quantity.text());

            if (needNumber > quantityNumber){
                $(this).removeClass("enough");
                $(this).removeClass("running-low");
                $(this).addClass("low");
            } else if (needNumber === quantityNumber) {
                $(this).removeClass("low");
                $(this).removeClass("enough");
                $(this).addClass("running-low");
            } else if (needNumber < quantityNumber) {
                $(this).removeClass("running-low");
                $(this).removeClass("low");
                $(this).addClass("enough");
            } else {
                // this is the head row
                $(this).removeClass("running-low");
                $(this).removeClass("low");
                $(this).removeClass("enough");
            }
        }); // end tr.each
    } // end colorizeRows

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
            colorizeRows();

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

    /**
     * Subtracts one from the quantity, updating the UI, and updating the
     * db via AJAX.
     */
    function removeFromQuantity() {
        $("button.sub").on("click", function() {
            var $quantity = $(this).parent().parent().find("td.quantity");
            console.log($quantity.html());
            var oldQuantity = Number.parseInt($quantity.text());

            if (oldQuantity > 0) {
                var newQuantity = oldQuantity - 1;
                $quantity.text(newQuantity);
                colorizeRows();

                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    url: '/remove',
                    data: JSON.stringify({
                        id: $(this).attr("value"),
                        quantity: newQuantity
                    }),
                    error: function(jqXHR, err) {
                        console.log(err);
                    }
                }); // end ajax
            } else {
                var rowUpc = $quantity.parent().find("td.upc").text();
                var warningHtml = "<p>Item " + rowUpc + 
                    " is already out of stock :(</p>";
                var $warning = $("div#warning");

                $warning.addClass("alert");
                $warning.addClass("alert-danger");
                $warning.attr('role', 'alert');
                $warning.html(warningHtml);

            }
        }); // end button.sub
    } // end removeFromQuantity

    $(document).ready(function(){
        addToQuantity();
        removeFromQuantity();
        colorizeRows();
    });// end document.ready
})();
