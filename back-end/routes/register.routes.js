const path = require('path');
const express = require('express');
const router = express.Router();
const pool = require('../connect');

router.get("/", function(req, res) {
    res.render(path.join(__dirname, '../..') + "/front-end/templates/register.html");
});

router.post("/", function(req, res) {
    const user_name = req.body.user_name;
    const user_password = req.body.user_password;
    const name = req.body.name;
    const last_name = req.body.last_name;

    if (user_name && user_password && name && last_name) {

        const query = `INSERT INTO users (username, password, name, last_name)
                       VALUES (?, ?, ?, ?)`;
        pool.getConnection(function(err, connection) {
            if (err) {
                res.status(500).json({ status: "failed", error: err.message });
                console.error("Error establishing connection", err);
            } else {
                connection.query(query, [user_name, user_password, name, last_name], function(err, results) {
                    connection.release();

                    if (err) {
                        res.status(500).json({ status: "failed", error: err.message });
                        console.error("Error executing query", err);
                    } else {
                        res.redirect('/login');
                    }
                });
            }
        });
    } else {
        res.status(400).render(path.join(__dirname, '../..') + "/front-end/templates/register.html", {
            error: "Missing credentials"
        });  
    }
});

module.exports = router;