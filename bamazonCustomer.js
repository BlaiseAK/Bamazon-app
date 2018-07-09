var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "root",

    database: "bamazon"
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("Welcome to Bamazon!");
    console.log("============================");
    // fire off inquirer function
    customerOptions();

});

function customerOptions() {
    inquirer.prompt(
        {
            name: "options",
            message: "What would you like to do today?",
            type: "list",
            choices: ["Buy an item", "Sell an item", "Manager Options", "Log out"]
        }
    ).then(function(res){
        var choice = res.options;
        if (choice === 'Buy an item') {
            // Show products to be sold
            console.log("============================");
            showItemsToBuy();
        }
        if (choice === 'Sell an item') {
            // Show ask for password and username
            console.log("============================");
            sellerLogin();
        }
        if (choice === 'Manager Options') {
            console.log("============================");
            managerOptions();
        }
        if (choice === 'Log out') {
            console.log("============================");
            console.log("Thank you for visiting Bamazon! Please come back again soon!");
            console.log("============================");
            connection.end();
        }
    }).catch(function(err) {
        console.log(err);
    })
}

// Shows list of all items in products database
function showItemsToBuy() {
    connection.query("SELECT id, product_name, price FROM products WHERE stock_quantity > 0", function(err,res) {
        if (err) throw err;

        console.log(res);
        console.log("============================");
        selectItemIdToBuy();
        // connection.end();
    })
}

// Asking user what the item id is and forcing them to only use a number from 1-100 and how many units the user would like from 1-100.
function selectItemIdToBuy() {
    inquirer.prompt([
        {
            name: "idToBuy",
            message: "What is the item's id that you wish to buy?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "qtyToBuy",
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                return false;
            }
        }]
    ).then(function(res){
        var item = res.idToBuy;
        var qtyToBuy = res.qtyToBuy;
        console.log("============================");
        itemsSold(item, qtyToBuy)
    }).catch(function(err) {
        console.log(err)
    })
}

// Finding the sold items to store in variables to pass to another function
function itemsSold(item, qtyToBuy) {
    connection.query("SELECT * FROM products WHERE ID = ?", item, function(err, res) {
        if(err) throw err;
        var qtyOnHand = res[0].stock_quantity;
        var item = res[0].id
        var productName = res[0].product_name;
        var orderQty = qtyToBuy;
        var newQtyOnHand = qtyOnHand - qtyToBuy;
        var orderSales = res[0].price*orderQty;
        updateItemQtyOnHand(item, productName, orderQty, newQtyOnHand, orderSales)
    })
    
}

// Updates the product table to the new on-hand qty after the user makes their selection
function updateItemQtyOnHand(item, productName, orderQty, newQtyOnHand, orderSales) {
    if(newQtyOnHand > 0) {
        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQtyOnHand}, {id: item}], function(err, res) {
        console.log("Your order has been processed for "+orderQty+" unit(s) of "+item+"-"+productName+"!\n"+"The total for this order is: $"+orderSales);
        // connection.end();
        console.log("============================");
        buyAnotherProduct();
        })  
    } else {
        console.log("============================");
        console.log("Sorry but the item: "+item+"-"+productName+" for "+orderQty+" units has insufficient quantity in stock. Please select either a new quantity or comeback when we have more in stock.");
        selectItemIdToBuy();
    }
}

// Asks user if they would like to buy another product and sends them back to the showItemsToBuy function or they are directed to the customerOptions function to either choose a new option or end the program
function buyAnotherProduct() {
    console.log("============================");
    inquirer.prompt(
        {
            name: "option",
            message: "Would you like to make another selection with Bamazon today?",
            type: "confirm",
            default: true
        }
    ).then(function(res){
        var buyAnother = res.option;
        // if statments to either disconnect or run through program again if they choose yes
        if (buyAnother === true) {
            showItemsToBuy();
        } else {
            console.log("Thank you for your selection, please come back again soon!")
            console.log("============================");
            customerOptions();
        }

    }).catch(function(err) {
        console.log(err);
    })

}

// Asks seller to provide the login to use the refiller function (on a side note I would love to have it where there is a sql query looking for that match of multiple manager logins on a seperate table. It's simple but I don't want to overload it until challenge #3 is completed)
function sellerLogin() {
    inquirer.prompt([
        {
            name: "userName",
            message: "Please supply the manager login username:",
            type: "input"
        },
        {
            name: "password",
            message: "Please supply the manager login password:",
            type: "input"
        }]
    ).then(function(res){
        var userName = res.userName;
        var password = res.password;

        if (userName === "Manager" && password === "password"){
            console.log("Welcome back Bamazon Manager");
            console.log("============================");
            sellerOptions();    
        } else{
            console.log("============================");
            customerOptions();
        }
    }).catch(function(err) {
        console.log(err)
    })
}

function sellerOptions() {
    inquirer.prompt({
        name: "managerChoice",
        message: "Which function would you like to perform today?",
        type: "list",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Back to Main Menu"]
    }).then(function(res) {
        switch (res.managerChoice){
            case "View Products for Sale":
                return showItemsAvailable();
            case "View Low Inventory":
                return lowInventoryItems();
            case "Add to Inventory":
                return addToInventory();
            case "Add New Product":
                return addNewProduct();
            case "Back to Main Menu":
                return customerOptions();
        }
    }).catch(function(err) {
        console.log(err)
    })
}

// Shows all current items on Bamazon that are available for sale
function showItemsAvailable() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err,res) {
        if (err) throw err;

        console.log(res);
        console.log("============================");
        sellerOptions();
    })
}

// Shows all current items with a quantity less than or equal to 5
function lowInventoryItems() {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity <= 5", function(err,res) {
        if (err) throw err;
        if (res.id === null) {
            console.log(res);
            console.log("============================");
            sellerOptions();
        }
        console.log(res);
        console.log("============================");
        sellerOptions();
    })
}

function addToInventory() {
    inquirer.prompt([
        {
            name: "item",
            message: "What is the item id you wish to update?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "qty",
            message: "How many units would you like to place into stock?",
            validate: function(value) {
                if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 100) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(res) {
        var item = res.item;
        var qty = res.qty;
        console.log("============================");
        updateStockQty(item, qty);
    }).catch(function(err) {
        console.log(err);
    })
}

function updateStockQty(item, qty) {
    connection.query("SELECT * FROM products WHERE ID = ?", item, function(err, res) {
        if(err) throw err;
        var qtyOnHand = res[0].stock_quantity;
        var item = res[0].id
        var productName = res[0].product_name;
        var restock = qty;
        var newQtyOnHand = qtyOnHand + qty;
        stockUpdateComplete(item, productName, restock, newQtyOnHand)
    })
}

function stockUpdateComplete(item, productName, restock, newQtyOnHand) {
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQtyOnHand}, {id: item}], function(err, res) {
        console.log("Your restock has been processed for "+restock+" unit(s) of "+item+"-"+productName+"!\n");
        // connection.end();
        console.log("============================");
        sellerOptions();
    })  
}