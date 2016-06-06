(function() {
    'use strict';

    var app = angular.module("listr", [  ]);

})();
// main closure
$(document).ready(function(){

    $("button.add").on("click", function (){
        var itemId = $(this).attr("value");
        var quantitySelector = "tr#" + itemId + " td.quantity";
        var oldQuantity = Number.parseInt($(quantitySelector).text(), 10);
        var newQuantity = oldQuantity + 1;

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
        });
    });

});
