// Allows usage of environment variabels to hide sensitive information
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const User = require('./User');

// Serve static files
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json

var currentUser = {};

app.get('/data', async (req, res) => {
  // Hopefulle remove NS_BINDING_ABORTED error in firefox
  res.set('Cache-Control', 'no-cache');
  //console.log("GET request received");
  //res.sendFile(path.join(__dirname, 'public', 'data.json'));
  let user = await queryUser(currentUser.sub);
  if (user) {
    res.json(user.toDoList);
  } else {
    res.status(500).json({ error: 'User not defined' });
  }
});

app.get('/user', (req, res) => {
  res.send(currentUser);
});

app.post('/submit', (req, res) => {
  //console.log("body:" , req.body);
  let data = req.body;

  // Derive the recommended deadline from the priority and creation date
  let date = new Date(data.creationDate);
  let recDeadline = new Date(date);
  recDeadline.setDate(date.getDate() + +data.priority);
  data.recommendedDeadline = recDeadline.toISOString().slice(0, 10);

  // Check if the user is in the database
  queryUser(currentUser.sub).then(user => {
    if (user) {
      // Check if the data already exists in the toDoList. If it is, return an error'
      for (let i = 0; i < user.toDoList.length; i++) {
        if (user.toDoList[i].name === data.name) {
          res.status(400).send("Name already exists");
          return;
        }
      }
      user.toDoList.push(data);
      user.save();
      res.send("Data added to user's toDoList")
    } else {
      // Create a new user and add the data to the toDoList
      let newUser = new User({
        authId: currentUser.sub,
        toDoList: [data]
      });
      newUser.save();
      console.log("User created and data added to toDoList");
    }
  });

});

app.post('/delete', (req, res) => {
  let data = req.body;


  // MongoDB stuff
  queryUser(currentUser.sub).then(user => {
    if (user) {
      for (let i = 0; i < user.toDoList.length; i++) {
        if (user.toDoList[i].name === data.name) {
          user.toDoList.splice(i, 1);
          user.save();
          res.send("Data deleted successfully");
          return;
        }
      }
      res.status(400).send("Name not found");
    } else {
      res.status(500).send("User not found");
    }
  });


});

app.post('/edit', (req, res) => {
  let data = req.body;

  // MongoDB stuff
  queryUser(currentUser.sub).then(user => {
    if (user) {
      for (let i = 0; i < user.toDoList.length; i++) {
        if (user.toDoList[i].name === data.name) {
          
          let date = new Date(data.creationDate);
          let recDeadline = new Date(date);
          recDeadline.setDate(date.getDate() + +data.priority);
          data.recommendedDeadline = recDeadline.toISOString().slice(0, 10);
          user.toDoList[i] = data;
          user.save();
          res.send("Data edited successfully");
          return;
        }
      }
      res.status(400).send("Name not found");
    } else {
      res.status(500).send("User not found");
    }
  });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})



// Auth0 stuff below
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://a3-darrenni-production.up.railway.app/',
  clientID: 'PlctauhHUByyDyxgsk3RTrNuKKCZXxvA',
  issuerBaseURL: 'https://dev-jcndioe3acrswo5m.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Get the user profile information
const { requiresAuth } = require('express-openid-connect');

app.get('/profile', requiresAuth(), (req, res) => {
  //res.send(JSON.stringify(req.oidc.user));
  res.sendFile(path.join(__dirname, '/dashboard.html'));
  console.log(req.oidc);
  currentUser = req.oidc.user;
});




// Mongo stuff below

const mongoose = require('mongoose');

startGoose().catch(err => console.log(err));

async function startGoose() {
  await mongoose.connect(process.env.DB_LINK);
  console.log("Connected to MongoDB");
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
  });
}

async function queryUser(authId) {
  let user = await User.findOne({authId: authId});
  if (!user) {
    user = new User({authId: authId});
    await user.save();
  }
  return user;
}

