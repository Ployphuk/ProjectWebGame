const fs = require("fs");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
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
            if (err) {
                console.error('Database query error',err);
                reject(err);
            }else
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

app.get('/logout', (req, res) => {
    // Clear the username cookie or perform any other logout actions

    res.clearCookie('username');
    res.redirect('/index.html'); // Redirect to the login page after logout
});


const authenticateUser = (req, res, next) => {
    const username = req.cookies.username;

    if (!username) {
        // Redirect to login page if the username cookie is not set
        return res.redirect("index.html");
    }

    // Attach the username to the request for future use in the route handler
    req.username = username;

    // Continue to the next middleware or route handler
    next();
};

app.get("/gamepage", authenticateUser, (req, res) => {
    // Access the authenticated username through req.username
    res.sendFile(path.join(__dirname, "public", "Index.html"));
});




//save score data

app.post('/submitScore', async (req, res) => {
    try {
        const { score, username } = req.body;

        // Update the user's score in the database
        const updateScoreQuery = `UPDATE userdata SET dinogamescore = ${score} WHERE username = '${username}'`;
        await queryDB(updateScoreQuery);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error submitting score:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/fallgamescore', authenticateUser, async (req, res) => {
    try {
        const { fallscore } = req.body;
        const username = req.username;

        // Update the user's fall game score in the database
        const updateScoreQuery = `UPDATE ${tablename} SET fallgamescore = ${fallscore} WHERE username = '${username}'`;
        await queryDB(updateScoreQuery);

        res.json({ message: 'Fall score submitted successfully' });
    } catch (error) {
        console.error('Error submitting fall score:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//leaderboard
// Add this route to your server.js file
// Regular leaderboard route
app.get('/leaderboard', async (req, res) => {
    try {
        const getLeaderboardQuery = 'SELECT username, dinogamescore FROM userdata ORDER BY dinogamescore DESC LIMIT 3';
        const leaderboardData = await queryDB(getLeaderboardQuery);
        res.json(leaderboardData);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Fallgame leaderboard route
app.get('/fallleaderboard', async (req, res) => {
    try {
        const getFallLeaderboardQuery = 'SELECT username, fallgamescore FROM userdata ORDER BY fallgamescore DESC LIMIT 3';
        const fallLeaderboardData = await queryDB(getFallLeaderboardQuery);
        res.json(fallLeaderboardData);
    } catch (error) {
        console.error('Error fetching fallgame leaderboard data:', error);
        res.status(500).send('Internal Server Error');
    }
});


//commentpart
app.get('/getComments', async (req, res) => {
    try {
        
        // Retrieve comments from the database, ordered by timestamp in descending order
        //test
        const getCommentsQuery = 'SELECT * FROM comment ORDER BY timestamp DESC LIMIT 10';
        const commentsData = await queryDB(getCommentsQuery);


        res.json(commentsData);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add this route to your server.js file
app.post('/submitComment', authenticateUser, async (req, res) => {
    try {
        const { commentText } = req.body;
        const username = req.username;

        // Check if the user already has a comment
        const existingCommentQuery = `SELECT * FROM comment WHERE username = '${username}'`;
        const existingComment = await queryDB(existingCommentQuery);

        if (existingComment.length > 0) {
            // Update the existing comment if needed
            // For example, you might want to update the timestamp or modify the existing commentText
            const updateCommentQuery = `
                UPDATE comment SET commentText = '${commentText}' WHERE username = '${username}'
            `;
            await queryDB(updateCommentQuery);
        } else {
            // Insert the new comment into the comments table
            const insertCommentQuery = `
                INSERT INTO comment (username, commentText,timestamp)
                VALUES ('${username}', '${commentText}', CURRENT_TIMESTAMP)
            `;
            await queryDB(insertCommentQuery);
        }

        res.json({ message: 'Comment submitted successfully' });
    } catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getComments', async (req, res) => {
    try {
        
        // Retrieve comments from the database, ordered by timestamp in descending order
        //test
        const getCommentsQuery = 'SELECT * FROM comment ORDER BY timestamp DESC LIMIT 10';
        const commentsData = await queryDB(getCommentsQuery);


        res.json(commentsData);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//part2
app.post('/submitComment2', authenticateUser, async (req, res) => {
    try {
        const { commentText } = req.body;
        const username = req.username;

        // Check if the user already has a comment
        const existingCommentQuery = `SELECT * FROM comment2 WHERE username = '${username}'`;
        const existingComment = await queryDB(existingCommentQuery);

        if (existingComment.length > 0) {
            // Update the existing comment if needed
            // For example, you might want to update the timestamp or modify the existing commentText
            const updateCommentQuery = `
                UPDATE comment2 SET commentText = '${commentText}' WHERE username = '${username}'
            `;
            await queryDB(updateCommentQuery);
        } else {
            // Insert the new comment into the comments table
            const insertCommentQuery = `
                INSERT INTO comment2 (username, commentText,timestamp)
                VALUES ('${username}', '${commentText}', CURRENT_TIMESTAMP)
            `;
            await queryDB(insertCommentQuery);
        }

        res.json({ message: 'Comment submitted successfully' });
    } catch (error) {
        console.error('Error submitting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getComments2', async (req, res) => {
    try {
        
        // Retrieve comments from the database, ordered by timestamp in descending order
        //test
        const getCommentsQuery = 'SELECT * FROM comment2 ORDER BY timestamp DESC LIMIT 10';
        const commentsData = await queryDB(getCommentsQuery);


        res.json(commentsData);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//likebutton
// Add this route to your server.js file
app.post('/like', authenticateUser, async (req, res) => {
    try {
        const { username, updatedLikeCount } = req.body;

        // Update the like count in the database
        const updateLikeCountQuery = `UPDATE ${tablename} SET likeCount = ${updatedLikeCount} WHERE username = '${username}'`;
        await queryDB(updateLikeCountQuery);

        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating like count:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Add this route to your server.js file
// Change SELECT to UPDATE

// Add this route to your server.js file
app.post('/getLikeCount', authenticateUser, async (req, res) => {
    try {
        const { username } = req.body;

        // Fetch the like count from the database
        const getLikeCountQuery = `SELECT likeCount2 FROM ${tablename} WHERE username = '${username}'`;
        const result = await queryDB(getLikeCountQuery);

        if (result.length > 0) {
            const likeCount = result[0].likeCount2;
            res.json({ likeCount });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching like count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});