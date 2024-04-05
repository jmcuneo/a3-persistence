const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const loginRoutes = require('./routes/api/login');
const path = require('path');
const session = require('express-session');

const app = express();

const port = process.env.PORT || 3000;
app.use(session({
    secret: 'your secret',
    resave: false,
    saveUninitialized: true
  }));


app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {

    if (!req.session.userId && !req.path.startsWith('/api/login') && req.path != '/login.html') {
        res.redirect('/login.html');
    } else {
        next();
    }
});

//if already login and visting login page, redirect to index page
app.get('/login.html', (req, res) => {
    if (req.session.userId) {
        res.redirect('/index.html');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
}
);
//logout 
app.get('/logout', (req, res) => {
    req.session.userId = null;
    res.redirect('/login.html');
});

app.use(bodyParser.json());
app.use(express.json());
app.use('/api/login', loginRoutes);
app.use('/api', apiRoutes);


app.use(express.static(path.join(__dirname, 'private')));





module.exports = app;