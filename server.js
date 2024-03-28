const express = require('express')
const dotenv = require('dotenv') //for .env file
const connectDb = require('./db')
const path = require('path');

//load the .env file in config, which contains personal information for connections
dotenv.config({path: './config/.env'})

connectDb()

const app = express()


app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )
//app.use('/', require('./routes/index'))

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'))
})

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, './views/dashboard.html'))
})

app.get('/billingsystem', (req, res) => {
    res.sendFile(path.join(__dirname, './views/billingsystem.html'))
})

app.get('/instructions', (req, res) => {
    res.sendFile(path.join(__dirname, './views/instructions.html'))
})

app.listen( process.env.PORT || 3000 )