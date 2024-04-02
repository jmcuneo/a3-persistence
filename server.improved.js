const express = require('express'),
  app = express(),
  { MongoClient, ObjectId } = require("mongodb")

let appdata = []

app.use(express.static('public'))
app.use(express.static('views'))
app.use(express.json())

require("dotenv").config()

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient(uri)

let collection
let userCollection

(async function () {
  await client.connect()
  const database = client.db('A3')
  collection = database.collection('webwareCollection')
  userCollection = database.collection('users')
})();

(async function () {
  await client.connect()
  const database = client.db('A3')
  userCollection = database.collection('users')
})();

const cookieSession = require('cookie-session')
const passport = require('passport');
const session = require('express-session');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}));


app.use(session({
  secret: process.env.EXPRESS_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const GitHubStrategy = require('passport-github2').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser((id, done) => {
  userCollection.findOne({ "userId": id }).then((user) => {
    done(null, user);
  });
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3100/auth/github/callback"
},
  (accessToken, refreshToken, profile, done) => {
    userCollection.findOne({ "userId": profile.id }).then((currentUser) => {
      if (currentUser) {
        console.log(currentUser)
        done(null, currentUser)
      } else {
        const newUser = [
          {
            "userId": profile.id,
            "username": profile.username
          }
        ]
        userCollection.insertMany(newUser).then(user => {
          console.log("new user created:" + newUser)
          done(null, newUser)
        })
      }
    })
  }
));

let totalCredits = 0
let totalGradePoints = 0
let id = 0
let gpa = 0

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    let parsedJSON = JSON.parse(dataString);
    const userId = request.user.userId;

    const grade = parsedJSON.grade;
    const numCredits = parseFloat(parsedJSON.credits);
    const className = parsedJSON.class;

    const searchForID = await findDocumentById(collection, id);
    if (searchForID) {
      id = id + 10
    }

    let individualGradePoints = 0;

    switch (grade) {
      case 'A':
        individualGradePoints = 4;
        break;
      case 'B':
        individualGradePoints = 3;
        break;
      case 'C':
        individualGradePoints = 2;
        break;
      case 'D':
        individualGradePoints = 1;
        break;
      default:
        individualGradePoints = 0;
        break;
    }

    totalGradePoints = individualGradePoints * numCredits;
    totalCredits = numCredits;

    const existingData = await collection.find({ "userId": userId }).toArray();

    existingData.forEach((doc) => {
      const existingGrade = doc.grade;
      const existingNumCredits = doc.credits;

      let existingIndividualGradePoints = 0;
      switch (existingGrade) {
        case 'A':
          existingIndividualGradePoints = 4;
          break;
        case 'B':
          existingIndividualGradePoints = 3;
          break;
        case 'C':
          existingIndividualGradePoints = 2;
          break;
        case 'D':
          existingIndividualGradePoints = 1;
          break;
        default:
          existingIndividualGradePoints = 0;
          break;
      }

      totalGradePoints += (existingIndividualGradePoints * existingNumCredits);
      totalCredits += existingNumCredits;
    });

    gpa = (totalGradePoints / totalCredits).toFixed(2);

    const insertToDB = await collection.insertOne({
      "userId": userId,
      "id": id,
      "class": className,
      "grade": grade,
      "credits": numCredits,
      "currentGPA": gpa
    });

    console.log(insertToDB);

    id++;

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(gpa.toString());
  });
};


async function findDocumentById(collection, id) {
  const doc = await collection.findOne({ "id": id });
  return doc;
}

const handleDelete = function (request, response) {
  let dataString = ""

  request.on("data", function (data) {
    dataString += data
  })

  request.on("end", async function () {

    let parsedJSON = JSON.parse(dataString)
    const toBeDeletedID = parseFloat(parsedJSON.id)
    const userId = request.user.userId

    let individualGradePoints = 0

    const deletedDoc = await collection.findOne({ "id": toBeDeletedID, "userId": userId })
    if (deletedDoc) {
      switch (deletedDoc.grade) {
        case 'A':
          individualGradePoints = 4
          break;
        case 'B':
          individualGradePoints = 3
          break;
        case 'C':
          individualGradePoints = 2
          break;
        case 'D':
          individualGradePoints = 1
          break;
        default:
          individualGradePoints = 0
          break;
      }
      totalGradePoints -= individualGradePoints * deletedDoc.credits
      totalCredits -= deletedDoc.credits

      gpa = (totalGradePoints / totalCredits).toFixed(2)
    }

    const deleteFromDB = await collection.deleteOne({ "id": toBeDeletedID, "userId": userId })

    const count = await collection.countDocuments({ "userId": userId });
    if (count === 0) {
      response.writeHead(204, "NO CONTENT", { "Content-Type": "text/plain" })
    } else {
      response.writeHead(200, "OK", { "Content-Type": "text/plain" })
    }
    response.end(gpa.toString())
  })
}

const handlePut = function (request, response) {
  let dataString = ""

  request.on("data", function (data) {
    dataString += data
  })

  request.on("end", async function () {
    //console.log( JSON.parse( dataString ) )

    let parsedJSON = JSON.parse(dataString)
    const idToBeModified = parseFloat(parsedJSON.id)
    const gradeModified = parsedJSON.grade
    const numCreditsModified = parseFloat(parsedJSON.credits)
    const classNameModified = parsedJSON.class

    const userId = request.user.userId; 

    const docToBeModified = await collection.findOne({ "id": idToBeModified, "userId": userId }); 

    const individualGradePointsOriginal = gradePointCalc(docToBeModified.grade);
    const individualGradePointsModified = gradePointCalc(gradeModified);

    totalGradePoints -= individualGradePointsOriginal * docToBeModified.credits;
    totalGradePoints += individualGradePointsModified * numCreditsModified;

    totalCredits -= docToBeModified.credits;
    totalCredits += numCreditsModified;

    gpa = (totalGradePoints / totalCredits).toFixed(2);

    const updateDB = await collection.updateOne(
      { "id": idToBeModified, "userId": userId }, 
      {
        $set: {
          "class": classNameModified,
          "grade": gradeModified,
          "credits": numCreditsModified,
          "currentGPA": gpa
        }
      }
    );

    console.log(updateDB);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(gpa.toString());
  });
};

function gradePointCalc(grade) {
  switch (grade) {
    case 'A':
      return 4;
    case 'B':
      return 3;
    case 'C':
      return 2;
    case 'D':
      return 1;
    default:
      return 0;
  }
}

app.post('/calculate', (req, res) => {
  handlePost(req, res)
})

app.delete('/calculate', (req, res) => {
  handleDelete(req, res)
})

app.put('/calculate', (req, res) => {
  handlePut(req, res)
})

app.get('/appdata', async (req, res) => {
  if (collection !== null) {
    const userId = req.user.userId
    const docs = await collection.find({ "userId": userId }).toArray()
    res.json(docs)
  }
})

app.get('/github', passport.authenticate('github', {
  scope: ['profile']
}))

const authCheck = (req, res, next) => {
  if (!req.session.login) {
    res.redirect('/index.html')
  } else {
    next()
  }
};

app.get('/profile', authCheck, (req, res) => {
  console.log("ran profile")
  res.sendFile(__dirname + '/public/profile.html')
});

app.get('/', (req, res) => {
  res.sendFile('index')
});

app.get('/auth/github/callback', passport.authenticate('github'), (req, res) => {
  req.session.login = true
  res.redirect('/profile')
});

app.get('/gpa', async (req, res) => {
  if (collection !== null) {
    const userId = req.user.userId

    const docs = await collection.find({ "userId": userId }).toArray()

    let totalCredits = 0
    let totalGradePoints = 0

    docs.forEach((doc) => {
      const grade = doc.grade
      const numCredits = doc.credits

      let individualGradePoints = 0
      switch (grade) {
        case 'A':
          individualGradePoints = 4
          break;
        case 'B':
          individualGradePoints = 3
          break;
        case 'C':
          individualGradePoints = 2
          break;
        case 'D':
          individualGradePoints = 1
          break;
        default:
          individualGradePoints = 0
          break;
      }

      totalGradePoints += (individualGradePoints * numCredits);
      totalCredits += numCredits
    });

    gpa = (totalGradePoints / totalCredits).toFixed(2);

    const count = await collection.countDocuments({ "userId": userId });
    if (count === 0) {
      gpa = 0
    }

    res.json({gpa});
  }
})

app.listen(process.env.PORT)