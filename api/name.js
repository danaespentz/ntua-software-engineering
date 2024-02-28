const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

const getNameObject = (nameID, callback) => {
  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {

    connection.query(
      "SELECT personal_id as nameID, primaryName as name, img_url_asset as namePoster, birthYear, deathYear, primaryProfession as profession FROM actors WHERE personal_id = ?",
      [nameID],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback({ error: "No actor with this nameID." }, null);
        }

        connection.query(
          "SELECT mb.title_id as titleID, p.category as category FROM actors a INNER JOIN principals p ON a.personal_id = p.personal_id INNER JOIN movies_basics mb ON mb.title_id = p.title_id WHERE a.personal_id = ?",
          [nameID],
          (err, result_2) => {
            if (err) {
              return callback(err, null);
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

            callback(null, return_dict);
            }
        );
      }
    );
    }
  });
};

router.get('/:nameID', function (req, res) {
  const { nameID } = req.params;
  const format = req.query.format || 'json';

  getNameObject(nameID, (err, result) => {
    if (err) {
      res.status(500).json({ status: 'failed', error: err.message });
      console.error('Error getting title object', err);
    } else {
      if (result) {
        if (format === 'csv') {
          const csv = Object.values(result)
            .map((value) => (Array.isArray(value) ? JSON.stringify(value) : value))
            .join(',');

          res.header('Content-Type', 'text/csv');
          res.attachment('data.csv');
          res.status(200).send(csv);
        } else {
          // Default: JSON format
          res.status(200).json({ status: 'success', data: result });
        }
      } else {
        res.status(404).json({ status: 'not found', message: 'Person not found' });
      }
    }
  });
});

module.exports = router;
