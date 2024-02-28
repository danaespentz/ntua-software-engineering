const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

router.post("/", (req, res) => { 
    const username = req.query.user_name;
    const password = req.query.user_password;

    if (!username || !password) {
        return res.status(400).json({ status: "failed", message: "Username and password are required" });
    }
    pool.getConnection((err, connection) => {
        if (err) {
        res.status(500).json({ status: "failed", message: "Connection failed" });
        console.error("Connection failed", err);
        } else {
        connection.query(`SELECT * FROM users WHERE (username = ? AND password = ?)`, [username, password], (err, results) => {
            connection.release();
            if (err) {
            res.status(500).json({ status: "failed", message: "Query execution failed" });
            console.error(`Query execution failed`, err);
            } else {
            if (results.length > 0) {
                req.session.authenticated = true;
                req.session.user = {
                username: results[0].username,
                user_id: results[0].user_id
                };
                const token = "FOO";
                res.status(200).json({ token });
            } else {
                res.status(404).json({ status: "failed", message: "User not found" });
            }
            }
        });
        }
    });
});

module.exports = router;