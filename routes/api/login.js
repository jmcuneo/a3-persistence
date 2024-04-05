const express = require('express');
const passport = require('passport');
require('dotenv').config();
const router = express.Router();
const GitHubStrategy = require('passport-github').Strategy;
const dir = 'public/';

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

//create a user model
const userSchema = new Schema({
  username: String,
  password: String,
  githubId: String
});
const User = mongoose.model('User', userSchema);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/api/login/github/callback'
  },
  async (accessToken, refreshToken, profile, cb) => {
    let user = await User.findOne({ username: profile.username });
    if (!user) {
      user = new User({ username: profile.username, githubId: profile.id });
      await user.save();
    }

    return cb(null, user);
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});

const app = express();
const session = require('express-session');

app.use(session({
  secret: 'your secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if your app is on https
}));

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username, password });
      await user.save();
      req.session.userId = user._id;
      res.json({ success: true, message: 'User created successfully' });
    } else {
        if (user.githubId) {
            res.json({ success: false, message: 'User already exists with github. You must login with GitHub.' });
        } else if (user.password === password) {
        req.session.userId = user._id;
        res.json({ success: true, message: 'Login successful' });
      } else {
        res.json({ success: false, message: 'Invalid password' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    req.session.userId = req.user._id;
    res.redirect('/index.html');
  }
);

// get username 
router.get('/getusername', async (req, res) => {
  try {
    if (req.session.userId) {
      const user
        = await User.findById(req.session
          .userId);
      res.json({ username: user.username });
    } else {
      es.status(500).json({ error: 'Failed to retrieve username' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve username' });
  }
});

module.exports = router;
