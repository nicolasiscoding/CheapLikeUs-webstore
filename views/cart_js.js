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

var shoppingCart = (function () {
    // Private methods and properties
    var cart = [];

    function Item(pid, name, price, count, stock) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.pid = pid;
        this.stock = stock;
    }

    function saveCart() {
        sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
        if (cart === null) {
            cart = []
        }
    }

    loadCart();



    // Public methods and properties
    var obj = {};

    obj.addItemToCart = function (name, price, count, stock, pid) {
        for (var i in cart) {
            if (cart[i].name === name) {
                if (cart[i].count == cart[i].stock) {
                  count = 0;
                }
                  cart[i].count += count;
                saveCart();
                return;
            }
        }

        console.log("addItemToCart:", name, price, count);

        var item = new Item(pid, name, price, count, stock);
        cart.push(item);
        saveCart();
    };

    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name && count <= cart[i].stock) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    };


    obj.removeItemFromCart = function (name) { // Removes one item
        for (var i in cart) {
            if (cart[i].name === name) { // "3" === 3 false
                cart[i].count--; // cart[i].count --
                if (cart[i].count === 0) {
                    cart.splice(i, 1);
                }
                break;
            }
        }
        saveCart();
    };


    obj.removeItemFromCartAll = function (name) { // removes all item name
        for (var i in cart) {
            if (cart[i].name === name) {
                cart.splice(i, 1);
                break;
            }
        }
        saveCart();
    };


    obj.clearCart = function () {
        cart = [];
        saveCart();
    }


    obj.countCart = function () { // -> return total count
        var totalCount = 0;
        for (var i in cart) {
            totalCount += cart[i].count;
        }

        return totalCount;
    };

    obj.totalCart = function () { // -> return total cost
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].count;
        }
        return totalCost.toFixed(2);
    };

    obj.listCart = function () { // -> array of Items
        var cartCopy = [];
        console.log("Listing cart");
        console.log(cart);
        for (var i in cart) {
            console.log(i);
            var item = cart[i];
            var itemCopy = {};
            for (var p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = (item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    };

    // ----------------------------
    return obj;
})();

/*******************************************************************************
*                                                                              *
*                                                           Smith, Phillip     *
*                                                  smith.phillip.m@ufl.edu     *
*                                                                              *
*                                                             Fry, Nicolas     *
*                                                            email@ufl.edu     *
*                                                                              *
*******************************************************************************/
