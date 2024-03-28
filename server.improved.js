require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const GitHubStrategy = require('passport-github').Strategy;
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: null } // Session expires immediately after the browser is closed
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});

// Function to create a new MongoClient and connect to the database
async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI, {
   
    });
    await client.connect();
    return client.db("4241database");
}

// Configure GitHub Strategy
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://a3-hanzalahqamar.vercel.app/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, done) {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        try {
            let user = await usersCollection.findOne({ githubId: profile.id });
            if (!user) {
                // User does not exist, create a new user
                const newUser = {
                    username: profile.username,
                    githubId: profile.id
                };
                await usersCollection.insertOne(newUser);
                user = newUser;
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        // Successful authentication, redirect to the app.
        res.redirect('/app');
    });

// Passport local strategy
passport.use(new LocalStrategy(
    async (username, password, done) => {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        try {
            let user = await usersCollection.findOne({ username: username });
            if (!user) {
                // User does not exist, create a new user
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = {
                    username: username,
                    password: hashedPassword
                };
                await usersCollection.insertOne(newUser);
                return done(null, newUser, { newUser: true });
            } else {
                // User exists, check if they have a password
                if (!user.password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                // Check password
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            }
        } catch (err) {
            return done(err);
        }
    }
));

// Serialization and deserialization
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Flash messages
app.use(flash());

// Routes
app.get('/', (req, res) => {
    res.render('index.ejs', { message: req.flash('error') });
});

app.get('/app', async (req, res) => {
    if (!req.user) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }
    const db = await connectToDatabase();
    const userSurveysCollection = db.collection('surveys');
    const carsCollection = db.collection('cars');

    try {
        const userData = await userSurveysCollection.findOne({ userId: req.user._id });
        const carsData = await carsCollection.find({ userId: req.user._id }).toArray(); // Fetch car data
        let showAlert = false;
        if (req.query.newUser && !req.session.newUserAlertShown) {
            req.session.newUserAlertShown = true;
            showAlert = true;
        }
        if (userData) {
            // If user has survey data, render the page without the survey form
            res.render('app', { newUser: showAlert, userData, showSurveyForm: false, carsData });
        } else {
            // If user does not have survey data, render the page with the survey form
            res.render('app', { newUser: showAlert, userData, showSurveyForm: true, carsData });
        }
    } catch (err) {
        console.error('Failed to fetch user data:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/',
        failureFlash: true
    }),
    (req, res) => {
        if (req.authInfo && req.authInfo.newUser) {
            res.redirect('/app?newUser=true');
        } else {
            res.redirect('/app');
        }
    });

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.get('/data', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = await connectToDatabase();
    const carsCollection = db.collection('cars');

    try {
        const cars = await carsCollection.find({ userId: req.user._id }).toArray();
        res.json(cars);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/add', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = await connectToDatabase();
    const carsCollection = db.collection('cars');

    try {
        const car = { ...req.body, userId: req.user._id };
        const result = await carsCollection.insertOne(car);
        res.json({ status: 'success', insertedId: result.insertedId });
    } catch (err) {
        console.error("Failed to insert car:", err);
        res.status(500).json({ error: 'Failed to insert car' });
    }
});

app.post('/update', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const db = await connectToDatabase();
    const carsCollection = db.collection('cars');

    try {
        const { _id, updatedData } = req.body;
        const filter = { _id: new ObjectId(_id), userId: req.user._id };
        const update = { $set: updatedData };
        const result = await carsCollection.updateOne(filter, update);
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Car not found or not owned by user' });
        }
        res.json({ status: 'success' });
    } catch (err) {
        console.error("Failed to update car:", err);
        res.status(500).json({ error: 'Failed to update car' });
    }
});

app.post('/delete', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = await connectToDatabase();
  const carsCollection = db.collection('cars');

  try {
    const _id = req.body._id;
    const filter = { _id: new ObjectId(_id), userId: req.user._id };
    const result = await carsCollection.deleteOne(filter);
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Car not found or not owned by user' });
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error("Failed to delete car:", err);
    res.status(500).json({ error: 'Failed to delete car' });
  }
});

app.get('/username', (req, res) => {
  if (req.user) {
      res.json({ username: req.user.username });
  } else {
      res.json({ username: null });
  }
});


app.post('/survey', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = await connectToDatabase();
  const userSurveysCollection = db.collection('surveys');

  try {
      // Check if survey data already exists for the user
      const existingSurvey = await userSurveysCollection.findOne({ userId: req.user._id });
      if (existingSurvey) {
          return res.status(400).json({ error: 'Survey data already exists' });
      }

      // Create a new survey data entry
      const surveyData = { ...req.body, userId: req.user._id };
      await userSurveysCollection.insertOne(surveyData);
      res.json({ status: 'success' });
  } catch (err) {
      console.error("Failed to insert survey data:", err);
      res.status(500).json({ error: 'Failed to insert survey data' });
  }
});


app.get('/survey', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = await connectToDatabase();
  const userSurveysCollection = db.collection('surveys');

  try {
      const existingSurveyData = await userSurveysCollection.findOne({ userId: req.user._id });
      if (!existingSurveyData) {
          return res.status(404).json({ error: 'Survey data not found' });
      }
      res.json(existingSurveyData);
  } catch (err) {
      console.error("Failed to fetch existing survey data:", err);
      res.status(500).json({ error: 'Failed to fetch existing survey data' });
  }
});

// Add this route to your server-side code
app.post('/submit-survey', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = await connectToDatabase();
  const userSurveysCollection = db.collection('surveys');

  try {
      // Check if there is already a survey for the user
      const existingSurvey = await userSurveysCollection.findOne({ userId: req.user._id });
      if (existingSurvey) {
          return res.status(400).json({ error: 'Survey data already exists for the user' });
      }

      const surveyData = { ...req.body, userId: req.user._id };
      await userSurveysCollection.insertOne(surveyData);
      // Redirect to the app page without the newUser query parameter
      res.redirect('/app');
  } catch (error) {
      console.error('Failed to submit survey:', error);
      res.status(500).json({ error: 'Failed to submit survey' });
  }
});

app.get('/load-survey', async (req, res) => {
  if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
  }
  const db = await connectToDatabase();
  const userSurveysCollection = db.collection('surveys');

  try {
      const surveys = await userSurveysCollection.find({ userId: req.user._id }).toArray();
      res.json({ status: 'success', surveys });
  } catch (err) {
      console.error('Failed to load surveys:', err);
      res.status(500).json({ error: 'Failed to load surveys' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
