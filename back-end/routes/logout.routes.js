const path = require('path');
const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.error("Error destroying session", err);
      return res.status(500).json({ status: "failed", error: err.message });
    }
    res.redirect("/login");
  });
});

module.exports = router;