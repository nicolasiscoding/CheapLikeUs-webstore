/*******************************************************************************
*                                                                              *
*                                                           Smith, Phillip     *
*                                                  smith.phillip.m@ufl.edu     *
*                                                                              *
*                                                             Fry, Nicolas     *
*                                                            email@ufl.edu     *
*                                                                              *
*******************************************************************************/

/*******************************************************************************

  Source code for front end shopping card functionality borrowed from this 
  repository:

      https://github.com/soggybag/Shopping-Cart-js

  Full credit for these scripts belongs solely to Mitchell Hudson.

*******************************************************************************/

$(".add-to-cart").click(function(event){
    event.preventDefault();
    var name = $(this).attr("data-name");
    var price = Number($(this).attr("data-price"));
    var stock = Number($(this).attr("data-stock"));
    var pid = Number($(this).attr("data-pid"));
    shoppingCart.addItemToCart(name, price, 1, stock, pid);
    displayCart();
});
$("#clear-cart").click(function(event){
    shoppingCart.clearCart();
    displayCart();
});
function displayCart() {
    var cartArray = shoppingCart.listCart();
    console.log(cartArray);
    var output = "";
    for (var i in cartArray) {
        output += "<li class = 'list-group-item' id = 'results-list'><div class = 'row'><div class = 'col-xs-5 col-md-3'>"
            +cartArray[i].name
            +" </div><div class = 'col-xs-6 col-md-6'><input class='item-count' type='number' data-name='"
            +cartArray[i].name
            +"' value='"+cartArray[i].count+"' >"
            +" x "+cartArray[i].price
            +" = "+cartArray[i].total
            +" </div><div class = 'col-xs-7 col-md-3'><button type = 'button' class='btn btn-default plus-item' data-name='"
            +cartArray[i].name+"'><span class='glyphicon glyphicon-plus' aria-hidden='true'></span></button>"
            +" <button type = 'button' class='btn btn-default subtract-item' data-name='"
            +cartArray[i].name+"'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button>"
            +" <button type = 'button' class='btn btn-default delete-item' data-name='"
            +cartArray[i].name+"'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></div>"
            +"</div></li>";
    }
    $("#show-cart").html(output);
    $("#count-cart").html( shoppingCart.countCart() );
    $("#total-cart").html( shoppingCart.totalCart() );
}
$("#show-cart").on("click", ".delete-item", function(event){
    var name = $(this).attr("data-name");
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
});
$("#show-cart").on("click", ".subtract-item", function(event){
    var name = $(this).attr("data-name");
    shoppingCart.removeItemFromCart(name);
    displayCart();
});
$("#show-cart").on("click", ".plus-item", function(event){
    var name = $(this).attr("data-name");
    var stock = Number($(this).attr("data-stock"));
    var pid = Number($(this).attr("data-pid"));
    shoppingCart.addItemToCart(name, 0, 1, stock, pid);
    displayCart();
});
$("#show-cart").on("change", ".item-count", function(event){
    var name = $(this).attr("data-name");
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
});


$("#end-cart").on("click", ".submit-cart", function(event)
{
    var email = $("#checkoutEmail").val();
    var pass  = $("#checkoutPassword").val();
    var items = shoppingCart.listCart();

    console.log(email);
    console.log(pass);

    $.post("/user/checkout", { email: email, password: pass, cart: items }).done(function(data)
        {
            alert("Data Loaded: " + data);
        });

    // displayCart();
});

displayCart();

/*******************************************************************************
*                                                                              *
*                                                           Smith, Phillip     *
*                                                  smith.phillip.m@ufl.edu     *
*                                                                              *
*                                                             Fry, Nicolas     *
*                                                            email@ufl.edu     *
*                                                                              *
*******************************************************************************/
