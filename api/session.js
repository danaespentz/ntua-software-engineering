const express = require('express');
const router = express.Router();

router.get('/session', (req, res) => {
  
    if (req.session.user.user_id) {
        res.json({ userId: req.session.user.user_id });
    } else {
        res.status(401).json({ error: 'User not logged in' });
    }
});

module.exports = router;