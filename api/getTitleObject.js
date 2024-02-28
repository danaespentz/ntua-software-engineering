const pool = require('../back-end/connect');

const getTitleObject = (titleID) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        connection.release();
        reject({ error: err.message });
      } else {
        connection.query(
          "SELECT title_id as titleID, titleType as type, originalTitle, img_url_asset as titlePoster, startYear, genres FROM movies_basics WHERE title_id = ?",
          [titleID],
          (err, result) => {
            if (err) {
              connection.release();
              reject(err);
            }

            if (!result || result.length === 0) {
              connection.release();
              reject({ error: "No title with this titleID." });
            }

            const genres_str = result[0].genres;
            const genres_list = genres_str ? genres_str.split(",").map((genre) => genre.trim()) : [];

            connection.query(
              "SELECT title as akaTitle, region as regionAbbrev FROM movies_akas WHERE title_id = ?",
              [titleID],
              (err, result_2) => {
                if (err) {
                  connection.release();
                  reject(err);
                }

                connection.query(
                  "SELECT p.personal_id as nameID, n.primaryName as name, p.category as category FROM principals p INNER JOIN actors n ON n.personal_id = p.personal_id WHERE p.title_id = ?",
                  [titleID],
                  (err, result_3) => {
                    if (err) {
                      connection.release();
                      reject(err);
                    }

                    connection.query(
                      "SELECT averageRating as avRating, numVotes as nVotes FROM ratings WHERE title_id = ?",
                      [titleID],
                      (err, result_4) => {
                        connection.release();
                        if (err) {
                          reject(err);
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

                        resolve(return_dict);
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
  });
};

module.exports = { getTitleObject };