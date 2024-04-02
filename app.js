const express = require("express"),
	app = express(),
	dotenv = require("dotenv").config(),
	port = 3000;

const shiftRouter = require("./routes/shifts");
const passport = require("passport");
const GithubStrategy = require("passport-github2").Strategy;
const handlebars = require("express-handlebars");
const session = require("express-session");
const cors = require("cors");
const { database, connect } = require("./db/connection")


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GithubStrategy({
	clientID: process.env.GITHUB_CLIENT_ID,
	clientSecret: process.env.GITHUB_CLIENT_SECRET,
	callbackURL: "https://ssgreene.tech/auth/github/callback"
},
	function (accessToken, refreshToken, profile, done) {
		// asynchronous verification, for effect...
		process.nextTick(function () {

			// To keep the example simple, the user's GitHub profile is returned to
			// represent the logged-in user.  In a typical application, you would want
			// to associate the GitHub account with a user record in your database,
			// and return that user instead.
			return done(null, profile);
		});
	}
));


app.engine('handlebars', handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.json());
app.use(cors());
app.use(session({
	secret: 'sessionSecretHehe',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 60000 * 60 * 24 }
}));
app.use(express.static("public"))
app.use(passport.initialize());
app.use(passport.session());
app.use("/shifts", shiftRouter);

const ensureAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.render("login");
}

app.get('/login', (req, res) => {
	res.render("login");
})

app.get('/auth/github',
	passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

app.get("/", ensureAuthenticated, async (req, res) => {
	const db = database();

	const shifts = await db.collection("shifts").find({user: req.user.username}).toArray();
	shifts.forEach((shift) => {
		delete shift._id;
		delete shift.user;
	})
	console.log(shifts);

	res.locals.user = req.user.username;
	res.locals.shiftRecords = shifts;
	res.render("index");
})

connect().then(() => {
	console.log("Connected to Mongo");
	app.listen(port, () => {
		console.log("Listening to Web Requests");
	});
}).catch((err) => {
	console.log(err);
});
