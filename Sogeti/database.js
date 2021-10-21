var sqlite3 = require('sqlite3').verbose()

var DBSOURCE;
if(process.env.NODE_ENV === 'test'){
    DBSOURCE = "db.sqlite"
} else DBSOURCE = "db-test.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to database.')
        //db.run("DROP TABLE orders",
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
    }
});


module.exports = db