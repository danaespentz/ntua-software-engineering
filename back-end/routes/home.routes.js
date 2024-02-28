const express = require('express');
const router = express.Router();
const pool = require('../connect');
const path = require('path');

router.get("/", function(req, res) {
  res.render(path.join(__dirname, '../..') + "/front-end/templates/home.html", { user: req.session.user });
});

router.post("/search", function(req, res) {
  const movieTitle = req.body.movie_title; 
  const movie_id = req.body.movie_id; 
  const genre = req.body.movie_genre; 
  const actor = req.body.movie_actor; 
  const mostRecent = req.body.mostRecent; 

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      if (movieTitle){
        const query = `SELECT * FROM movies_basics WHERE primaryTitle LIKE ?`;
        connection.query(query, [movieTitle], function(err, results) {
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              const title_id=results[0].title_id
              res.redirect(`/result?title_id=${title_id}`);
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
      else if (movie_id){
        const query = `SELECT * FROM movies_basics WHERE title_id = ?`;
        connection.query(query, [movie_id], function(err, results) {
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              const title_id=results[0].title_id
              res.redirect(`/result?title_id=${title_id}`);
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
      else if (genre){
        const query = `SELECT * FROM movies_basics WHERE genres LIKE ?`;
        connection.query(query, [genre], function(err, results) {
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              res.redirect(`/result?genre=${genre}`);
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
      else if (actor){
        const query = `SELECT * FROM actors WHERE primaryName LIKE ? AND (primaryProfession LIKE '%actor%' OR primaryProfession LIKE '%actress%') `;
        connection.query(query, [`${actor}%`], function(err, results) {
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              if (mostRecent){
                res.redirect(`/result?actor=${actor}&mostRecent=${mostRecent}`);
              }
              else {
              res.redirect(`/result?actor=${actor}`);
              }
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
    }
  });
});

module.exports = router;
