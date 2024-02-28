const express = require('express');
const router = express.Router();
const pool = require('../back-end/connect');

const getTitleObject = (titleID, callback) => {
  pool.getConnection(function(err, connection) {
    if (err) {
      res.status(500).json({ status: "failed", error: err.message });
      console.error("Error establishing connection", err);
    } else {

    connection.query(
      "SELECT title_id as titleID, titleType as type, originalTitle, img_url_asset as titlePoster, startYear, genres FROM movies_basics WHERE title_id = ?",
      [titleID],
      (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (!result || result.length === 0) {
          return callback({ error: "No title with this titleID." }, null);
        }

        const genres_str = result[0].genres;
        const genres_list = genres_str ? genres_str.split(",").map((genre) => genre.trim()) : [];

        connection.query(
          "SELECT title as akaTitle, region as regionAbbrev FROM movies_akas WHERE title_id = ?",
          [titleID],
          (err, result_2) => {
            if (err) {
              return callback(err, null);
            }

            connection.query(
              "SELECT p.personal_id as nameID, n.primaryName as name, p.category as category FROM principals p INNER JOIN actors n ON n.personal_id = p.personal_id WHERE p.title_id = ?",
              [titleID],
              (err, result_3) => {
                if (err) {
                  return callback(err, null);
                }

                connection.query(
                  "SELECT averageRating as avRating, numVotes as nVotes FROM ratings WHERE title_id = ?",
                  [titleID],
                  (err, result_4) => {
                    if (err) {
                      return callback(err, null);
                    }

                    const return_dict = {
                      titleID: result[0].titleID,
                      type: result[0].type,
                      originalTitle: result[0].originalTitle,
                      titlePoster: result[0].titlePoster,
                      startYear: result[0].startYear,
                      endYear: result[0].endYear || "Null",
                      genres: genres_list,
                      titleAkas: result_2.length === 0 ? "None" : result_2,
                      principals: result_3.length === 0 ? "None" : result_3,
                      rating: result_4.length === 0 ? "None" : result_4,
                    };

                    callback(null, return_dict);
                  }
                );
              }
            );
          }
        );
      }
    );
    }
  });
};

router.get('/:titleID', function (req, res) {
  const { titleID } = req.params;
  const format = req.query.format || 'json';

  getTitleObject(titleID, (err, result) => {
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
        res.status(404).json({ status: 'not found', message: 'Movie not found' });
      }
    }
  });
});

module.exports = router;
