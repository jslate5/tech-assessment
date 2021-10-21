const express = require("express");
const app = express();
const PORT = process.env.NODE_ENV === 'test' ? 8081 : 8080;
const db = require("./database.js")

app.use(express.json());

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

//Get order by first and last name
app.get("/orders/:firstName/:lastName", (req, res, next) => {
    var firstName = req.params.firstName
    var lastName = req.params.lastName
    var sql = `SELECT * FROM orders WHERE firstName = "${firstName}" AND lastName = "${lastName}"`
    db.all(sql, [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.status(200).json({
            "message":"success",
            "data":rows
        })
      });
});

//Get all orders
app.get("/orders", (req, res, next) => {
    var sql = "select * from orders"
    db.all(sql, [], (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

//Create order
app.post('/order/create', (req, res, next) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const streetAddress = req.body.streetAddress;
    const city = req.body.city;
    const state = req.body.state;
    const postalCode = req.body.postalCode;
    const phoneNumber = req.body.phoneNumber;
    const itemDescription = req.body.itemDescription;
    const price = req.body.price;
    const hasShipped = req.body.hasShipped;
    const estDelivery = req.body.estDelivery;

    var insert = 'INSERT INTO orders (firstName, lastName, streetAddress, city, state, postalCode, phoneNumber, itemDescription, price, hasShipped, estDelivery) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
    
    const params = [firstName,lastName,streetAddress,city,state,postalCode,phoneNumber,itemDescription,price,hasShipped,estDelivery]
    db.run(insert, params, (err) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        } else res.status(201).send("Order successfully created.");

    })
})

//Update order
app.put('/order/update/:id', (req, res, ) => {
    const id = req.params.id;
    const body = req.body
    var update = "UPDATE orders SET ";

    for(const key in body){
        if(body.hasOwnProperty(key)){
            if(isNaN(body[key])){ //Value is a string
                update += `${key} = '${body[key]}', `
            } else update += `${key} = ${body[key]}, ` //Value is a number
        }
    }

    update = update.substring(0, update.length - 2); //Remove the last comma and space
    update += ` WHERE id = ${id}`
    db.run(update, [], (err) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        } else res.status(200).send("Order successfully updated.");
    })
})

//Cancel (delete) order
app.put('/order/cancel/:id', (req, res, next) => {
    const id = req.params.id;
    const body = req.body
    const del = `DELETE FROM orders WHERE id = ${id}`;
    db.run(del, [], (err) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        } else res.status(200).send("Order successfully deleted");
    })
})