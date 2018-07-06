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
        var qty = res.qtyToBuy;
        itemsSold(item, qty)
    })
}

function itemsSold(item, qty) {
    connection.query("UPDATE ? WHERE ?")
}