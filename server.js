const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express(),
    path = require('path'),
    session = require('express-session');

require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')) )
app.use(express.json() )
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let charCollection = null
let loginCollection = null

async function run() {
    await client.connect()
    charCollection = await client.db("a3-aidanmacnevin").collection("characters")
    loginCollection = await client.db("a3-aidanmacnevin").collection("login")

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (charCollection !== null) {
            const docs = await charCollection.find({}).toArray()
            res.json( docs )
        }
    })
}

app.use( (req,res,next) => {
    if( charCollection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', async (req, res) => {
    // TODO: load from mongodb
    const {username, password} = req.body;

    const user = await loginCollection.findOne({username: username});

    let validated = false;

    if (!user) {
        return false;
    }

    validated = user.password === password;

    if (validated) {
        req.session.userId = user.username;
        res.redirect('/main');
    } else {
        res.send('Invalid username or password');
    }
});

function requireLogin(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
}

app.get('/main', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});


app.post( '/submit', async (req,res) => {
    console.log("Request Body: ", req.body);
    await saveData(req.body)
    res.send("Data successfully added")
})

app.post( '/delete', async (req,res) => {
    const result = await charCollection.deleteOne({ _id: new ObjectId(req.body.deleteId) });
    res.send("Data successfully deleted")
})

app.post( '/edit', async (req,res) => {
    console.log("Request Body: ", req.body);
    const result = await charCollection.updateOne(
        { _id: new ObjectId(req.body.id) },
        {$set: {
                "name": req.body.name,
                "race": req.body.race,
                "class": req.body.class,
                "modifier": req.body.modifier,
                "action": req.body.action
            }}
        );
    res.send("Data successfully edited")
})

const saveData = async function (myDataJSON) {
    let charModifier = "unknown"
    let randAction = "Unarmed Strikes"

    console.log("class :", myDataJSON.charclass)
    const charClass = myDataJSON.charclass.toString().toLowerCase();

    //Either weapon or spell
    const actionType = myDataJSON.action;


    if (charClass === "artificer" || charClass === "wizard") {
        charModifier = "Intelligence";
    } else if (charClass === "druid" || charClass === "ranger" || charClass === "cleric") {
        charModifier = "Wisdom";
    } else if (charClass === "paladin" || charClass === "bard" || charClass === "sorcerer" || charClass === "warlock") {
        charModifier = "Charisma";
    } else if (charClass === "monk" || charClass === "rogue") {
        charModifier = "Dexterity";
    } else if (charClass === "barbarian" || charClass === "fighter") {
        charModifier = "Strength";
    } else {
        charModifier = "unknown";
    }

    if (actionType === "weapon") {
        switch (charClass) {
            case "artificer":
                randAction = "gun";
                break;
            case "wizard":
                randAction = "Quarterstaff";
                break;
            case "druid":
                randAction = "Quarterstaff";
                break;
            case "ranger":
                randAction = "Longbow";
                break;
            case "cleric":
                randAction = "Mace";
                break;
            case "paladin":
                randAction = "Warhammer";
                break;
            case "bard":
                randAction = "Lute";
                break;
            case "sorcerer":
                randAction = "Quarterstaff";
                break;
            case "warlock":
                randAction = "Hexblade";
                break;
            case "monk":
                randAction = "Unarmed Strikes";
                break;
            case "rogue":
                randAction = "Dagger";
                break;
            case "barbarian":
                randAction = "Greataxe";
                break;
            case "fighter":
                randAction = "Longsword";
                break;
            default:
                // Default case
                break;
        }
    } else { // actionType === "magic"
        switch (charClass) {
            case "artificer":
                randAction = "Arcane Weapon";
                break;
            case "wizard":
                randAction = "Fireball";
                break;
            case "druid":
                randAction = "Entangle";
                break;
            case "ranger":
                randAction = "Hunter's Mark";
                break;
            case "cleric":
                randAction = "Cure Wounds";
                break;
            case "paladin":
                randAction = "Divine Smite";
                break;
            case "bard":
                randAction = "Vicious Mockery";
                break;
            case "sorcerer":
                randAction = "Magic Missile";
                break;
            case "warlock":
                randAction = "Eldritch Blast";
                break;
            case "monk":
                randAction = "Slow Fall";
                break;
            case "rogue":
                randAction = "Invisibility";
                break;
            case "barbarian":
                randAction = "RAGE!!";
                break;
            case "fighter":
                randAction = "Action Surge";
                break;
            default:
                // Default case
                randAction = "Firebolt";
                break;
        }
    }

    // Add to mongodb
    const result = await charCollection.insertOne({
        "name": myDataJSON.charname,
        "race": myDataJSON.charrace,
        "class": myDataJSON.charclass,
        "modifier": charModifier,
        "action": randAction
    })
    console.log(result)
}

run()

app.listen(3000)