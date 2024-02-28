const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

const getNameObject = (nameID) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        reject({ error: err.message });
      } else {
        connection.query(
          "SELECT personal_id as nameID, primaryName as name, img_url_asset as namePoster, birthYear, deathYear, primaryProfession as profession FROM actors WHERE personal_id = ?",
          [nameID],
          (err, result) => {
            if (err) {
              connection.release();
              reject(err);
            }

            if (!result || result.length === 0) {
              connection.release();
              reject({ error: "No person with this nameID." });
            }

            connection.query(
              "SELECT mb.title_id as titleID, p.category as category FROM actors a INNER JOIN principals p ON a.personal_id = p.personal_id INNER JOIN movies_basics mb ON mb.title_id = p.title_id WHERE a.personal_id = ?",
              [nameID],
              (err, result_2) => {
                if (err) {
                  connection.release();
                  reject(err);
                }

                const return_dict = {
                  nameID: result[0].nameID,
                  name: result[0].name,
                  namePoster: result[0].namePoster,
                  birthYr: result[0].birthYear,
                  deathYr: result[0].deathYear,
                  profession: result[0].profession,
                  nameTitles: result_2.length === 0 ? "None" : result_2,
                };

                resolve(return_dict);
              }
            );
          }
        );
      }
    });
  });
};

router.get("/", function(req, res) {
  const { namePart } = req.query;
  const format = req.query.format || 'json';

  if (!namePart) {
    return res.status(400).json({ status: "failed", error: "Missing namePart in the request body" });
  }

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `
      SELECT personal_id FROM actors WHERE primaryName LIKE ?
      `;

      connection.query(query, [`%${namePart}%`], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            const nameObjectPromises = results.map(({ personal_id }) => getNameObject(personal_id));
            
            Promise.all(nameObjectPromises)
              .then((nameObjects) => {
                if (format === 'csv') {
                  const csv = nameObjects
                    .map((obj) => Object.values(obj).map((value) => (Array.isArray(value) ? JSON.stringify(value) : value)).join(','))
                    .join('\n');

                  res.header('Content-Type', 'text/csv');
                  res.attachment('data.csv');
                  res.status(200).send(csv);
                } else {
                  // Default: JSON format
                  res.status(200).json({ status: "success", data: nameObjects });
                }
              })
              .catch((error) => {
                res.status(500).json({ status: "failed", error: error.message });
                console.error("Error getting title objects", error);
              });
          } else {
            res.status(404).json({ status: "not found", message: "No matching titles found" });
          }
        }
      });
    }
  });
});

module.exports = router;
