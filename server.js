const express = require("express"),
    { MongoClient, ObjectId } = require("mongodb"),
    app = express()

require('dotenv').config();

app.use(express.static("public") )
app.use(express.json() )

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`
const client = new MongoClient( uri )

let collection = null

async function run() {
    await client.connect()
    collection = await client.db("a3-aidanmacnevin").collection("characters")

    // route to get all docs
    app.get("/docs", async (req, res) => {
        if (collection !== null) {
            const docs = await collection.find({}).toArray()
            res.json( docs )
        }
    })
}

app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
})

app.post( '/submit', async (req,res) => {
    console.log("Request Body: ", req.body);
    await saveData(req.body)
    res.send("Data successfully added")
})

app.post( '/delete', async (req,res) => {
    const result = await collection.deleteOne({ _id: new ObjectId(req.body.deleteId) });
    res.send("Data successfully deleted")
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
    const result = await collection.insertOne({
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