const express = require( 'express' ),
      app = express()
const appdata = [
        { "model": "toyota", "year": 1999, "mpg": 23, "EOL": 2077},
        { "model": "honda", "year": 2004, "mpg": 30, "EOL": 2060},
        { "model": "ford", "year": 1987, "mpg": 14, "EOL": 2049} 
      ]

app.use(express.static('public'))
app.use(express.json())


const calculateEOL = (year, mpg) => {
    let new_val = year + mpg;
    new_val = new_val - (year % mpg);
  
    return new_val;
  }

  app.post( '/submit', (req, res) => {
    req.body.EOL = calculateEOL(req.body.year, req.body.mpg)
    appdata.push(req.body)
    res.writeHead( 200, { 'Content-Type': 'application/json' })
    res.end( JSON.stringify( appdata ) )
  })

  //app.delete( '/submit', (req, res) => {})

  app.listen(3000)