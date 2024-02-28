const express = require('express');
const router = express.Router();
const pool = require('../../back-end/connect');

router.post("/:username/:password", (req, res) => {
    const { username, password } = req.params;

    if (!username || !password) {
        return res.status(400).json({ status: "failed", message: "Username and password are required" });
    }

    pool.getConnection((err, connection) => {
        if (err) {
            res.status(500).json({ status: "failed", message: "Connection failed" });
            console.error("Connection failed", err);
            return;
        }

        // Check if user already exists
        connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                connection.release();
                res.status(500).json({ status: "failed", message: "Query execution failed" });
                console.error(`Query execution failed`, err);
                return;
            }

            if (results.length > 0) {
                // User exists, update password
                connection.query('UPDATE users SET password = ? WHERE username = ?', [password, username], (err, updateResult) => {
                    connection.release();
                    if (err) {
                        res.status(500).json({ status: "failed", message: "Update operation failed" });
                        console.error(`Update operation failed`, err);
                        return;
                    }
                    res.status(200).json({ status: "OK", message: "Password updated" });
                });
            } else {
                // User doesn't exist, create new user
                connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, insertResult) => {
                    connection.release();
                    if (err) {
                        res.status(500).json({ status: "failed", message: "Insert operation failed" });
                        console.error(`Insert operation failed`, err);
                        return;
                    }
                    res.status(200).json({ status: "OK", message: "New user created" });
                });
            }
        });
    });
});

module.exports = router;