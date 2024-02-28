const path = require('path');
const express = require('express');
const router = express.Router();
const pool = require('../connect');
const axios = require('axios');

router.use(express.json());

async function fetchActorBiography(actorName) {
  try {
    const response = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        format: 'json',
        prop: 'extracts',
        exintro: true,
        explaintext: true,
        titles: actorName,
      },
    });

    const pages = response.data.query.pages;
    const firstPageId = Object.keys(pages)[0];
    const actorPage = pages[firstPageId];
    const actorBiography = actorPage.extract;

    return actorBiography;
  } catch (error) {
    console.error('Error fetching actor biography:', error);
    return null;
  }
}

router.get("/", function(req, res) {
  const { title_id } = req.query; 
  const { genre } = req.query; 
  const { actor } = req.query; 
  const { movieActor } = req.query; 
  const { movieGenre } = req.query; 
  const { quantity } = req.query; 
  const { mostRecent } = req.query;


  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      if (title_id){
        const query = `SELECT 
                          mb.title_id, 
                          mb.originalTitle, 
                          mb.img_url_asset, 
                          mb.startYear, 
                          mb.endYear,
                          mb.genres,
                          mb.runtimeMinutes,
                          COALESCE(r.averageRating, '') AS rating
                      FROM movies_basics mb
                      LEFT JOIN ratings r ON r.title_id = mb.title_id
                      WHERE mb.title_id = ? `;

        connection.query(query, [title_id], function(err, results) { 
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              if (results[0]['img_url_asset']) {
                results[0]['img_url_asset'] = results[0]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
              } else {
                results[0]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
              }              res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { result: results[0], user: req.session.user });
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
      else if (genre){
        const query = `SELECT 
                          mb.title_id, 
                          mb.originalTitle, 
                          mb.img_url_asset, 
                          mb.startYear, 
                          mb.endYear,
                          mb.genres,
                          mb.runtimeMinutes,
                          COALESCE(r.averageRating, '') AS rating
                      FROM movies_basics mb
                      LEFT JOIN ratings r ON r.title_id = mb.title_id
                      WHERE mb.genres LIKE ?;
                      `;

        connection.query(query, [`%${genre}%`], function(err, results) { 
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                if (results[i]['img_url_asset']) {
                  results[i]['img_url_asset'] = results[i]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
                } else {
                  results[i]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
                }              }
              res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, user: req.session.user});
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
                error: "Movie not found",
                user: req.session.user
            });
            }
          }
        });
      }
      else if (actor && mostRecent){
        const query = `SELECT 
            nm.personal_id,
            nm.primaryName, 
            p.title_id,
            mb.originalTitle, 
            mb.img_url_asset, 
            mb.startYear, 
            mb.endYear,
            mb.genres,
            mb.runtimeMinutes,
            COALESCE(r.averageRating, '') AS rating
        FROM actors nm 
        INNER JOIN principals p ON p.personal_id = nm.personal_id
        INNER JOIN movies_basics mb ON mb.title_id = p.title_id
        LEFT JOIN ratings r ON r.title_id = p.title_id
        WHERE nm.primaryName LIKE ?
        ORDER BY mb.startYear DESC
        LIMIT 1;
        `;

        connection.query(query,  [`${actor}%`], async function(err, results) { 
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              if (results[i]['img_url_asset']) {
                results[i]['img_url_asset'] = results[i]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
              } else {
                results[i]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
              }  
            }
          if (results.length == 1) {
            const actorName = results[0].primaryName;
            const actorBiography = await fetchActorBiography(actorName);
            res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, actorName, actorBiography, user: req.session.user});
          }
          else{
            res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, user: req.session.user});
          }
        } else {
          res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
            error: "Movie not found",
            user: req.session.user
        });
        }
      }
      });
      }
      else if (actor){
        const query = `SELECT 
                          nm.personal_id,
                          nm.primaryName, 
                          p.title_id,
                          mb.originalTitle, 
                          mb.img_url_asset, 
                          mb.startYear, 
                          mb.endYear,
                          mb.genres,
                          mb.runtimeMinutes,
                          COALESCE(r.averageRating, '') AS rating
                      FROM actors nm 
                      INNER JOIN principals p ON p.personal_id = nm.personal_id
                      INNER JOIN movies_basics mb ON mb.title_id = p.title_id
                      LEFT JOIN ratings r ON r.title_id = p.title_id
                      WHERE nm.primaryName LIKE ?;
                      `;

        connection.query(query,  [`${actor}%`], async function(err, results) { 
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                if (results[i]['img_url_asset']) {
                  results[i]['img_url_asset'] = results[i]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
                } else {
                  results[i]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
                }  
              }
              if (results.length == 1) {
                const actorName = results[0].primaryName;
                const actorBiography = await fetchActorBiography(actorName);
                res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, actorName, actorBiography, user: req.session.user});
              }
              else{
                res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, user: req.session.user});
              }
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
                error: "Movie not found", user: req.session.user
            });
            }
          }
        });
      }
      else if (movieGenre && quantity){
        const query = `SELECT 
								mb.title_id, 
								mb.originalTitle, 
								mb.img_url_asset, 
								mb.startYear, 
								mb.endYear,
								mb.genres,
								mb.runtimeMinutes,
								COALESCE(r.averageRating, '') AS rating
							FROM movies_basics mb
							LEFT JOIN ratings r ON r.title_id = mb.title_id
							WHERE mb.genres LIKE ?
							ORDER BY r.averageRating DESC
							LIMIT ?;
							`;
        connection.query(query, [`%${movieGenre}%`, parseInt(quantity)], function(err, results) { 
          connection.release();

          if (err) {
            res.status(500).json({ status: "failed", error: err.message });
            console.error("Error executing query", err);
          } else {
            if (results.length > 0) {
              for (let i = 0; i < results.length; i++) {
                if (results[i]['img_url_asset']) {
                  results[i]['img_url_asset'] = results[i]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
                } else {
                  results[i]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
                }              }
              res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, user: req.session.user});
            } else {
              res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
                error: "Movie not found", user: req.session.user
            });
            }
          }
        });
      }
      else if (movieActor && quantity){
        const query = `SELECT 
              nm.personal_id,
              nm.primaryName, 
              p.title_id,
              mb.originalTitle, 
              mb.img_url_asset, 
              mb.startYear, 
              mb.endYear,
              mb.genres,
              mb.runtimeMinutes,
              COALESCE(r.averageRating, '') AS rating
            FROM actors nm 
            INNER JOIN principals p ON p.personal_id = nm.personal_id
            INNER JOIN movies_basics mb ON mb.title_id = p.title_id
            LEFT JOIN ratings r ON r.title_id = p.title_id
            WHERE nm.primaryName LIKE ?
            ORDER BY r.averageRating DESC
            LIMIT ?;
            `;
      connection.query(query,  [`${movieActor}%`, parseInt(quantity)], async function(err, results) { 
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            for (let i = 0; i < results.length; i++) {
              if (results[i]['img_url_asset']) {
                results[i]['img_url_asset'] = results[i]['img_url_asset'].replace(/{[^}]*}/, 'w500').trim() || 'https://louisville.edu/history/images/noimage.jpg';
              } else {
                results[i]['img_url_asset'] = 'https://louisville.edu/history/images/noimage.jpg';
              }  
            }
            if (results.length == 1) {
              const actorName = results[0].primaryName;
              const actorBiography = await fetchActorBiography(actorName);
              res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, actorName, actorBiography, user: req.session.user});
            }
            else{
              res.render(path.join(__dirname, '../..') + "/front-end/templates/result.html", { list: results, user: req.session.user});
            }
          } else {
            res.status(404).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/home.html", {
              error: "Movie not found", user: req.session.user
          });
          }
        }
     });
    }
  }
});
});

router.post("/", function(req, res) {
  if(req.session){
    const userId = req.session.user.user_id;
    console.log("User_id: ", userId);
    const { titleId, preference } = req.body;
      if (titleId && preference) {
        console.log('Received data:', { titleId, preference });
        const insertQuery = `INSERT INTO preferences (user_id, title_id, preference) VALUES (?, ?, ?)`;
        pool.getConnection(function(err, connection) {
            if (err) {
                console.error('Server error in establishing database connection:', err);
                res.status(500).send('Server error');
            }else {
                connection.query(insertQuery, [userId, titleId, preference], function(err, results) {
                    connection.release();
                    if (err) {
                        console.error('Database error in executing query:', err);
                        res.status(500).send('Database error');
                    } else {
                        console.log(`Preference saved: User ID - ${userId}, Title ID - ${titleId}, Preference - ${preference}`);
                        res.status(200).send('Preference saved');
                    }
                });
            }
        });        
    } else {
        res.status(400).send('Missing data');
    } 
  } else {
    res.redirect("/login");
  }
});

module.exports = router;