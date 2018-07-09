USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shoes", "Clothing", 60.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Socks", "Clothing", 15.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jeans", "Clothing", 80.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Tshirts", "Clothing", 8.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Technology", 209.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Headphones", "Accessories", 10.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPhone Lightning Cable", "Accessories", 20.00, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Windex", "Cleaning", 6.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ironing Board", "Home", 15.99, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Boxes (L)", "Home", 0.75, 100);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Clothing", 2000, 0);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Accessories", 1500, 0);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Home", 1000, 0);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Technology", 2000, 0);

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUES ("Cleaning", 300, 0);