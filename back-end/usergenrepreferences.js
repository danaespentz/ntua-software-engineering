const express = require('express')
const pool = require('../back-end/connect');
const util = require('util');


// Promisify the query function for async/await use
const query = util.promisify(pool.query).bind(pool);

async function getUserGenrePreferences(userId) {
  const sql = `
    SELECT mb.genres, p.preference
    FROM ntuaflix.preferences p
    JOIN ntuaflix.movies_basics mb ON p.title_id = mb.title_id
    WHERE p.user_id = ?
  `;

  try {
    const results = await query(sql, [userId]);
    const genrePreferences = {};

    results.forEach(row => {
      const genres = row.genres.split(',');
      genres.forEach(genre => {
        if (!genrePreferences[genre]) {
          genrePreferences[genre] = { like: 0, dislike: 0, total: 0 };
        }
        genrePreferences[genre][row.preference]++;
        genrePreferences[genre].total++;
      });
    });

    const percentages = {};
    Object.keys(genrePreferences).forEach(genre => {
      percentages[genre] = {
        likePercentage: ((genrePreferences[genre].like / genrePreferences[genre].total) * 100).toFixed(2),
        dislikePercentage: ((genrePreferences[genre].dislike / genrePreferences[genre].total) * 100).toFixed(2)
      };
    });

    return percentages;
  } catch (err) {
    console.error('Error querying the database:', err);
    throw err;
  }
}

module.exports = getUserGenrePreferences;

