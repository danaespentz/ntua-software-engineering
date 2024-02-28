const path = require('path')
const express = require('express')
const router = express.Router();
const pool = require('../connect');
const { connect } = require('http2');
const util = require('util');


router.get("/", function(req, res) {
	
	res.render(path.join(__dirname, '../..') + "/front-end/templates/profile.html", {user: req.session.user});
	console.log(req.session.user);
});


    

module.exports = router;
