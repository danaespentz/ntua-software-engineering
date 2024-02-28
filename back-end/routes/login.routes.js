const express = require('express');
const router = express.Router();
const pool = require('../connect');
const path = require('path');

router.get("/", function(req, res) {
  if (req.session.authenticated) {
    res.render(path.join(__dirname, '../..') + "/front-end/templates/home.html", { user: req.session.user });
  } else {
    res.render(path.join(__dirname, '../..') + "/front-end/templates/login.html");  }
});

router.post("/", function(req, res) {
  const username = req.body.user_name;
  const password = req.body.user_password;
  
  if (username && password) {
      if (req.session.authenticated) {
        res.json(req.session);
      } else {
      const query = `SELECT * FROM users WHERE (username = ? AND password = ?)`;
      pool.getConnection(function(err, connection) {
          if (err) {
              res.status(500).json({ status: "failed", error: err.message });
              console.error("Error establishing connection", err);
              
          } else {
              connection.query(query, [username, password], function(err, results) {
                  connection.release();
                  if (err) {
                      res.status(500).json({ status: "failed", error: err.message });
                      console.error("Error executing query", err);
                      
                  } else {
                      if (results.length > 0) {
                          req.session.authenticated = true;
                          req.session.user = {
                            username: results[0].username,
                            user_id: results[0].user_id
                          };
                          console.log(req.session);
                          res.redirect("/");

                      } else {
                          console.error("Wrong username or password", err);
                          res.render(path.join(__dirname, '../..') + "/front-end/templates/login.html", {
                              error: "Wrong username or password"
                          });
                      }
                  }
              });
          }
      });
    }
  } else {
      res.status(400).render(path.join(__dirname, '../..') + "/front-end/templates/login.html", {
        error: "Missing credentials"
    });  
    }
});

module.exports = router;