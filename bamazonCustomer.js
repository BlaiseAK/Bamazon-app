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
});

function customerOptions() {
    inquirer.prompt(
        {
            name: "options",
            message: "What would you like to do today?",
            input: "list",
            choices: ["Buy an item", "Sell an item"]
        }
    )
}