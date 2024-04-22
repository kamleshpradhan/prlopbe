const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql2");
const { v4: uuidv4 } = require('uuid');


const connection = mysql.createConnection({
    host: 'db',
    port: 3306,
    user: 'root',
    password: '12345',
    database: 'test_db'
}, function (err) {
    console.log(err);
})

function createTables() {
    connection.query('SHOW TABLES', function (error, results, fields) {
        if (error) {
            console.log("error", error);
        }
        console.log(results);
        if (results && results.length == 0) {
            connection.query('CREATE TABLE broker(broker_id VARCHAR(255) PRIMARY KEY,name VARCHAR(255) NOT NULL,type VARCHAR(20) NOT NULL,image VARCHAR(255) NOT NULL,ratings INT NOT NULL,properties INT NOT NULL)', function (error, results, fields) {
                if (error) {
                    throw error;
                }
                console.log(results);
            })
            connection.query('CREATE TABLE house(property_id VARCHAR(255) PRIMARY KEY, broker_id VARCHAR(255) NOT NULL,location VARCHAR(255) NOT NULL,price INT NOT NULL,image VARCHAR(255) NOT NULL,availableStatus VARCHAR(255) NOT NULL)', function (error, results, fields) {
                if (error) {
                    throw error;
                }
                console.log(results);
            })
        }
    });
}
createTables()

// To Show all the tables
app.get("/", (req, res) => {
    try {
        connection.query('SHOW TABLES', function (error, results, fields) {
            if (error) {
                console.log("error", error);
            }
            console.log(results);
        });
        res.send("Hello World")
    } catch (err) {
        res.send("Some error occured");
    }
})

// To delete tables
app.delete("/tables", (req, res) => {
    try {
        connection.query('DROP TABLE house', function (err, results) {
            if (err) {
                console.log(err);
            }
        })
        connection.query('DROP TABLE broker', function (err, results) {
            if (err) {
                console.log(err);
            }
        })
        res.send("Done")
    } catch (err) {
        res.send("Some error occured");
    }
})

// To post houses data
app.post("/houseData", async (req, res) => {
    try {
        for (let j of req.body) {
            const brokerId = uuidv4();
            const propertyId = uuidv4();
            connection.query(`INSERT INTO house(property_id, broker_id, location, price, image, availableStatus) VALUES (?, ?, ?, ?, ?, ?)`,
                [propertyId, brokerId, j.location, j.price, j.img, j.available], function (error, results, field) {
                    if (error) {
                        console.log(error);
                        res.status(400).send("Some error occured please try again later")
                    }
                })
        }
        res.status(201).send('Data added successfully');
    } catch (err) {
        res.send("Some error occured");
    }
})

// To get all house data
app.get("/houseData", (req, res) => {
    try {
        connection.query(`SELECT * FROM house`, function (error, results, field) {
            if (error) {
                res.status(400).send("Some error occured please try again later")
            }
            res.status(200).send(results);
            return;
        })
    } catch (err) {
        res.send("Some error occured")
    }
})

// To add broker data
app.post("/brokerData", async (req, res) => {
    try {
        for (let j of req.body) {
            connection.query(`INSERT INTO broker(broker_id, name, type, image, ratings, properties) VALUES (?, ?, ?, ?, ?, ?)`,
                [j.id, j.name, j.type, j.image, j.ratings, j.properties], function (error, results, field) {
                    if (error) {
                        console.log(error);
                        res.status(400).send("Some error occured please try again later")
                    }
                })
        }
        res.status(201).send('Data added successfully');
        return
    } catch (err) {
        res.send("Some error occured");
    }
})


// To get all broker data
app.get("/brokerData", (req, res) => {
    try {
        connection.query(`SELECT * FROM broker`, function (error, results, field) {
            if (error) {
                res.status(400).send("Some error occured please try again later")
            }
            res.status(200).send(results);
            return;
        })
    } catch (err) {
        res.send("Some error occured")
    }
})

// To get specific broker data
app.get("/brokerData/:id", (req, res) => {
    try {
        connection.query(`SELECT * FROM broker WHERE broker_id = ?`, [req.params.id], function (error, results, field) {
            if (error) {
                console.log(error);
                res.status(400).send("Some error occured please try again later")
            }
            res.status(200).send(results);
            return;
        })
    } catch (err) {
        res.send("Some error occured")
    }
})

app.listen(8000, (req, res) => {
    console.log("server started on port 8000")
});