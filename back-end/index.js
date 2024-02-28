const path = require('path');
const express = require('express'),
 app = express(),
 webapp = express(),
 router = express.Router();
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');



const sessionMiddleware = session({
	secret: 'abcd',
	cookie: { maxAge: 3000000, secure: false}, 
	resave: false,
	saveUninitialized: false,
	store: new session.MemoryStore()
  });

app.use(sessionMiddleware);
webapp.use(sessionMiddleware);

const PORT = process.env.PORT || 9876;
const baseurl = '/ntuaflix/api';

// TEMPLATE INHERITANCE
const nunjucks = require('nunjucks');
nunjucks.configure(['../front-end/templates/'], {
	autoescape: true,
	express: webapp
})

const key = fs.readFileSync('./certificates/localhost.decrypted.key');
const cert = fs.readFileSync('./certificates/localhost.crt');
const server = https.createServer({ key, cert }, app);
const webserver = https.createServer({ key , cert }, webapp);

app.set('view engine', 'ejs');

//Middleware to parse JSON
app.use(express.json());
// MIDDLEWARE FOR CROSS-ORIGIN REQUESTS
app.use(cors({
	credentials:true,
	origin:'https://localhost:3000'
}));

//Express app set up to handle form data
app.use(express.urlencoded({ extended: true }));
app.get(baseurl, (req,res) => {
	res.end('NTUAFLIX IS UP!');
});

server.listen(PORT, () => {
	console.log(`app listening at: https://localhost:${PORT}${baseurl}`);
});

webapp.use(express.urlencoded({ extended: true }));

// WEB SERVER (for front-end)
webserver.listen(3000, () => {
	console.log('Web-server is up and runing at: https://localhost:3000');
});

const adminhealth = require('../api/admin/healthcheck.js'),
	logout = require('../api/logout'),
	login = require('../api/login'),
	titlebasics = require('../api/admin/upload/titlebasics.js'),
	titleakas = require('../api/admin/upload/titleakas.js'),
	namebasics = require('../api/admin/upload/namebasics.js'),
	titlecrew = require('../api/admin/upload/titlecrew.js'),
	titleepisode = require('../api/admin/upload/titleepisode.js'),
	titleprincipals = require('../api/admin/upload/titleprincipals.js'),
	titleratings = require('../api/admin/upload/titleratings.js'),
	resetall = require('../api/admin/resetall.js'),
	title = require('../api/title'),
	userMod = require('../api/admin/usermod'),
	userInfo = require('../api/admin/users'),
	genrePreferences = require('../api/genre-preferences'),
	searchtitle = require('../api/searchtitle'),
	bygenre = require('../api/bygenre'),
	name = require('../api/name'),
	searchname = require('../api/searchname');

// RESTFUL API ROUTES
app.use(baseurl+'/login', login);
app.use(baseurl+'/logout', logout);
app.use(baseurl+'/admin/healthcheck', adminhealth);
app.use(baseurl+'/admin/userMod', userMod);
app.use(baseurl+'/admin/userInfo', userInfo);
app.use(baseurl+'/admin/upload/titlebasics', titlebasics);
app.use(baseurl+'/admin/upload/namebasics', namebasics);
app.use(baseurl+'/admin/upload/titleakas', titleakas);
app.use(baseurl+'/admin/upload/titlecrew', titlecrew);
app.use(baseurl+'/admin/upload/titleepisode', titleepisode);
app.use(baseurl+'/admin/upload/titleprincipals', titleprincipals);
app.use(baseurl+'/admin/upload/titleratings', titleratings);
app.use(baseurl+'/admin/resetall', resetall);
app.use(baseurl+'/title', title);
app.use(baseurl+'/searchtitle', searchtitle);
app.use(baseurl+'/bygenre', bygenre);
app.use(baseurl+'/name', name);
app.use(baseurl+'/searchname', searchname);
app.use(baseurl+'/genre-preferences', genrePreferences);


// ROUTES FOR front-end
webapp.use(express.static(path.join(__dirname, '../front-end/static')));
webapp.use("/", require('./routes/home.routes.js'));
webapp.use("/login", require('./routes/login.routes.js'));
webapp.use("/logout", require('./routes/logout.routes.js'));
webapp.use("/register", require('./routes/register.routes.js'));
webapp.use("/result", require('./routes/result.routes.js'));
webapp.use("/toppicks", require('./routes/toppicks.routes.js'));
webapp.use("/profile", require('./routes/profile.routes.js'));

// Middleware to pass session data to all templates
app.use(function(req, res, next) {
    res.locals.username = req.session.user ? req.session.user.username : null;
    res.locals.user_id = req.session.user ? req.session.user.user_id : null;
    next();
});


module.exports = router;
