const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require("cookie-parser");
const mysql = require('mysql');
const hostname = 'localhost';
const path = require("path");

const app = express();
const port = 3000;

const { userdata } = require("os");
const { constrainMemory } = require("process");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());


const db= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projectgamedb'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

let tablename ="userdata";

const queryDB = (sql) => {
    return new Promise ((resolve,reject) => {
        db.query(sql, (err,result, fields) =>{
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post("/register", async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userdata(id INT AUTO_INCREMENT PRIMARY KEY,reg_date TIMESTAMP, username VARCHAR(50), firstname VARCHAR(50), email VARCHAR(50), password VARCHAR(50), confirmpassword VARCHAR(50))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userdata (username, firstname, email, password, confirmpassword) VALUES("${req.body.username}", "${req.body.firstname}","${req.body.email}","${req.body.password}","${req.body.confirmpassword}") `;
    result = await queryDB(sql);
    console.log("New Record successful");
    return res.redirect("index.html");
})


app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check the database for the provided username and password
    const sql = `SELECT * FROM ${tablename} WHERE username="${username}" AND password="${password}"`;
    const result = await queryDB(sql);

    if (result.length > 0) {
        // Login successful
        res.cookie("username", username);
        return res.redirect("gamepage.html");
    } else {
        // Login failed
        res.status(401).send("Invalid username or password");
    }
});

app.get("/gamepage", (req, res) => {
    const username = req.cookies.username;

    if (!username) {
        // Redirect to login page if the username cookie is not set
        return res.redirect("/login.html");
    }

    // Proceed with rendering the game page
    res.sendFile(path.join(__dirname, "public", "gamepage.html"));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});