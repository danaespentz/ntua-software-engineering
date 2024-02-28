const getUserGenrePreferences = require('../back-end/usergenrepreferences'); 
const express = require('express');
const router = express.Router();

// Endpoint to get genre preferences for a user
router.get('/', async (req, res) => {
    // Check if user_id is stored in the session
    console.log(req.session);
    if (req.session) {
        console.log('User ID:', req.session.user);
    } else {
        console.log('User session or user_id is undefined');
    }
    if (req.session) {
      try {
        const userId = req.session.user.user_id;
        const percentages = await getUserGenrePreferences(userId);
        res.json(percentages);
      } catch (error) {
        console.error('Failed to get genre preferences:', error);
        res.status(500).send({ error: 'Failed to get genre preferences' });
      }
    } else {
      res.status(403).send({ error: 'User not authenticated' });
    }
  });

module.exports = router;