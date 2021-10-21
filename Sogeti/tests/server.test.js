const app = require('../server');
const sqlite3 = require('sqlite3').verbose();
const request = require('supertest');
const db = new sqlite3.Database('db-test');

beforeAll(() => {
    process.env.NODE_ENV = 'test';
})

db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL, 
    lastName TEXT NOT NULL, 
    streetAddress TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postalCode INTEGER NOT NULL,
    phoneNumber INTEGER NOT NULL,
    itemDescription TEXT NOT NULL,
    price INTEGER NOT NULL,
    hasShipped INTEGER NOT NULL,
    estDelivery TEXT NOT NULL
    )`,
(err) => {
    if (err) {
        console.log(err)
    }
});
db.run('DELETE FROM orders');
const insert = 'INSERT INTO orders (firstName, lastName, streetAddress, city, state, postalCode, phoneNumber, itemDescription, price, hasShipped, estDelivery) VALUES (?,?,?,?,?,?,?,?,?,?,?)'

const person1 = ['Brian', 'Todd', '12345 Court Ave', 'Des Moines', 'IA', 12345, 5435675467, 'Shirt', 10, 0, 10/17/2021];
const person2 = ['Brian', 'Todd', '12345 Court Ave', 'Des Moines', 'IA', 12345, 5435675467, 'Pants', 15, 0, 10/19/2021];
const person3 = ['Bob', 'Johnson', '451 Apple Rd', 'Davenport', 'IA', 52756, 5235743476, 'Shoes', 20, 0, 11/15/2021];
db.run(insert, person1);
db.run(insert, person2);
db.run(insert, person3);

//I was unable to get the tests to work while trying to stay within the time constraint
test('get order by first and last name', () => {
    db.serialize(async () => {
        seedDb(db);
        const res = await request(app).get('/orders/Brian/Todd');
        const response = [
            {
                "firstName": "Brian",
                "lastName": "Todd",
                "streetAddress": "12345 Court Ave",
                "city": "Des Moines",
                "state": "IA",
                "postalCode": 12345,
                "phoneNumber": 5435675467,
                "itemDescription": "Shirt",
                "price": 10,
                "hasShipped": 0,
                "estDelivery": "10/17/2020"
            },
            {
                "firstName": "Brian",
                "lastName": "Todd",
                "streetAddress": "12345 Court Ave",
                "city": "Des Moines",
                "state": "IA",
                "postalCode": 12345,
                "phoneNumber": 5435675467,
                "itemDescription": "Pants",
                "price": 15,
                "hasShipped": 0,
                "estDelivery": "10/19/2020"
            }
        ]
        expect(res.status).toBe(200);
        expect(res.body).toEqual(response);
    })
});
