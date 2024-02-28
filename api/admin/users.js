const express = require('express');
const router = express.Router();
const pool = require('../../back-end/connect');

router.post("/:username", (req, res) => { 
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ status: "failed", message: "Username is required" });
    }
    pool.getConnection((err, connection) => {
        if (err) {
        res.status(500).json({ status: "failed", message: "Connection failed" });
        console.error("Connection failed", err);
        } else {
            connection.query(`SELECT * FROM users WHERE username = ?`, [username], (err, results) => {
            connection.release();
            if (err) {
                res.status(500).json({ status: "failed", message: "Query execution failed" });
                console.error(`Query execution failed`, err);
            } else {
            if (results.length > 0) {
                res.status(200).json({ status: "OK", message: results });
            } else {
                res.status(404).json({ status: "failed", message: "Invalid User" });
            }
            }
        });
        }
    });
});

module.exports = router;