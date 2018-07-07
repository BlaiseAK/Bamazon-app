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
    // fire off inquirer function
    customerOptions();

});

function customerOptions() {
    inquirer.prompt(
        {
            name: "options",
            message: "What would you like to do today?",
            type: "list",
            choices: ["Buy an item", "Sell an item", "Manager Options"]
        }
    ).then(function(res){
        var choice = res.options;
        if (choice === 'Buy an item') {
            // Show products to be sold
            showItemsToBuy();
        }
    }).catch(function(err) {
        console.log(err);
    })
}

function showItemsToBuy() {
    connection.query("SELECT id, product_name, price FROM products", function(err,res) {
        if (err) throw err;

        console.log(res);
        selectItemIdToBuy();
        // connection.end();
    })
}

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
        itemsSold(item, qtyToBuy)
    }).catch(function(err) {
        console.log(err)
    })
}

function itemsSold(item, qtyToBuy) {
    connection.query("SELECT * FROM products WHERE ID = ?", item, function(err, res) {
        if(err) throw err;
        var qtyOnHand = res[0].stock_quantity;
        var item = res[0].id
        var newQtyOnHand = qtyOnHand - qtyToBuy;
        updateItemQtyOnHand(item, newQtyOnHand)
    })
    
}

function updateItemQtyOnHand(item, newQtyOnHand) {
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newQtyOnHand}, {id: item}], function(err, res) {
    console.log("Your order has been processed for "+item+"!");
    connection.end();
})}