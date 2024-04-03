const express = require('express'),
    { MongoClient, ObjectId } = require("mongodb"),
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

const uri = `mongodb+srv://docterbuster:WrAcuHkhqtPSf1OQ@a3-basharalqassar-clust.h6f3nj7.mongodb.net/`
const client = new MongoClient( uri )


let collection = null
let userdata = null

async function run() {
  await client.connect()
  collection = await client.db("a3-basharalqassar-db").collection("users")
  userdata = await client.db("a3-basharalqassar-db").collection("user-appdata")
  // route to get all docs
}

run()

app.post("/post_login", async (req, res) => {
  if (collection !== null) {

    let loginInfo = req.body

    //Query for this account
    const docs = await collection.find(
        {
          username: loginInfo.username,
          password: loginInfo.password
        }
    ).toArray()
    //res.json( docs )

    //If we find an account
    if(docs[0] !== undefined)
    {
      //Query userdata for this user and return all associated data
      const selectedUserData = await userdata.find(
          {
            username: loginInfo.username
          }
      ).toArray()
      res.json( selectedUserData )
      //console.log(selectedUserData)

    }
    //If no account is found
    else
    {
      //console.log("No Data found for " + loginInfo.username + "with password " + loginInfo.password)
      res("NoDataFound")
    }

  }
})

app.post("/add_userdata", async (req, res) => {
  if (userdata !== null)
  {
    console.log("Adding/Updating User Data")

    //User we are logged in for
    let user = req.body.username;

    console.log(req.body.password)

    //Query for this account (before we add data)
    const docs = await collection.find(
        {
          username: req.body.username,
          password: req.body.password
        }
    ).toArray()

    //If we find an account
    if(docs[0] !== undefined)
    {
      console.log("User Found!")
      //Query userdata for data with this user on a specific date

      const query =
      {
        username: user,
        date: req.body.date
      };

      const userScoreOnDate = await userdata.find(query).toArray()

      //If we find data, update it
      if(userScoreOnDate[0] !== undefined)
      {
        console.log("Replacing Data")

        let newData =
            {
              _id: userScoreOnDate[0]._id,
              score: req.body.score,
              time: req.body.time,
              scoreOverTime: Math.round((req.body.score / req.body.time) * 10) / 10,
              date: req.body.date,
              username: user
            };

        const updatedData = userdata.replaceOne(query, newData)

        console.log(updatedData)
        res.json(updatedData)

      }
      else //otherwise, add this information to the dataset
      {

      }

      // console.log(userScoreOnDate)
    }
    else
    {
      //Don't add any data if we don't find an account
    }



    //Return updated user data with res
  }
})

app.get('/login.html', (req, res) => res.send('Hello World!'))

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



app.post('/post_account', (req, res) =>
{
  let loginInfo = req.body
  console.log(loginInfo)

  /*
    username: loginInfo.username,
    password: loginInfo.password
  */

})


app.listen(process.env.PORT || 3000)






