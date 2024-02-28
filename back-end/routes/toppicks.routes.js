const path = require('path');
const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
    res.render(path.join(__dirname, '../../front-end/templates/toppicks.html'), {user: req.session.user});
});

router.post("/", function(req, res) {
    const quantity = req.body.quantity;
    const movieGenre = req.body.genre;
    const movieActor = req.body.movie_actor;

    if (movieGenre && quantity) {
        res.redirect(`/result?movieGenre=${movieGenre}&quantity=${quantity}`);
    } else if (movieActor && quantity){
        res.redirect(`/result?movieActor=${movieActor}&quantity=${quantity}`);
    } else {
        res.status(400).render(path.join(__dirname, '../..') + "/softeng23-50/front-end/templates/toppicks.html", {
            error: "Missing parameters",
            user: req.session.user
        });  
    }
});

module.exports = router;