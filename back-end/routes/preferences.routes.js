
const express = require('express')
const router = express.Router();
const pool = require('../connect');

router.use(express.json());

router.post("/save-preference", function(req, res) {
    if (req.session.user_id && req.body.titleId && req.body.preference) {
        const data = req.body;
        console.log('Received data:', data);
         const userId = req.session.user_id;
 
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
 });

module.exports = router;