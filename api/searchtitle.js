const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');
const { getTitleObject } = require('./getTitleObject');

router.get("/", function(req, res) {
  const { titlePart } = req.query;
  const format = req.query.format || 'json';

  if (!titlePart) {
    return res.status(400).json({ status: "failed", error: "Missing titlePart in the request body" });
  }

  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {
      const query = `
      SELECT title_id FROM movies_basics WHERE originalTitle LIKE ?
      `;

      connection.query(query, [`%${titlePart}%`], function(err, results) {
        connection.release();

        if (err) {
          res.status(500).json({ status: "failed", error: err.message });
          console.error("Error executing query", err);
        } else {
          if (results.length > 0) {
            const titleObjectPromises = results.map(({ title_id }) => getTitleObject(title_id));
            
            Promise.all(titleObjectPromises)
              .then((titleObjects) => {
                if (format === 'csv') {
                  const csv = titleObjects
                    .map((obj) => Object.values(obj).map((value) => (Array.isArray(value) ? JSON.stringify(value) : value)).join(','))
                    .join('\n');

                  res.header('Content-Type', 'text/csv');
                  res.attachment('data.csv');
                  res.status(200).send(csv);
                } else {
                  // Default: JSON format
                  res.status(200).json({ status: "success", data: titleObjects });
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
