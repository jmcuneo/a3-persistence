// app.js
const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;