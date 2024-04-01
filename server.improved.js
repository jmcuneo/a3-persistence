const express = require('express'),
    app = express()
    appdata = [
  { "username": "Bashar", "score": 2000, "time": 100, "scoreOverTime": 20, "date": "1/10/2024", "ID": 1},
  { "username": "Tim", "score": 4000, "time": 90, "scoreOverTime": 44.4, "date": "9/8/2023", "ID": 2 },
  { "username": "Emma", "score": 3000, "time": 70, "scoreOverTime": 42.9, "date": "10/2/2022", "ID": 3}
]

const logger = (req, res, next) => {
    //console.log('url:', req.url)
    next()
}

app.use(logger)
app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.get('/index.html', (req, res) => res.send('Hello World!'))


//POST: Modifies appdata and returns
app.post( '/post_to_appdata', (req, res) => {

  // ... do something with the data here!!!

  let newData = req.body
  console.log(newData)

  let replaceData = false;
  let replaceIndex = 0;

  for(let i = 0; i < appdata.length; i++)
  {
    if(newData.username === appdata[i].username)
    {
      replaceData = true;
      replaceIndex = i;
    }
  }


  if(replaceData)
  {
    appdata[replaceIndex].score = newData.score;
    appdata[replaceIndex].time = newData.time;
    appdata[replaceIndex].scoreOverTime = Math.round((newData.score / newData.time) * 10) / 10;
  }
  else
  {
    let curDate = new Date()
    newData.scoreOverTime = Math.round((newData.score / newData.time) * 10) / 10;
    newData.date = (curDate.getMonth() + 1) + "/" + curDate.getDate() + "/" + curDate.getFullYear()
    newData.ID = appdata.length + 1;

    appdata.push(newData)
    console.log(newData)
  }



  res.writeHead( 200, { 'Content-Type': 'application/json' })


  res.end( JSON.stringify( appdata ) )
})


// GET: Sends over appdata to read
app.get('/get_appdata', (req, res) =>
{
  res.send(JSON.stringify(appdata))
})


app.listen(process.env.PORT || 3000)






