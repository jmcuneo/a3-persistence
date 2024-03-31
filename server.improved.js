const http = require( "http" ),
      fs   = require( "fs" ),
      express = require('express'),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library if you"re testing this on your local machine.
      // However, Glitch will install it automatically by looking in your package.json
      // file.
      mime = require( "mime" ),
      dir  = "public/",
      port = 3000,
      app = express();

const appdata = [
  { "name": "Duolian", "race": "Earth Genasi", "class": "Paladin", "modifier": "Charisma", "action": "Greatsword"},
  { "name": "Kaede", "race": "Wood Elf", "class": "Monk", "modifier": "Dexterity", "action": "Unarmed Strikes" },
  { "name": "Thaddeus Thunderclap", "race": "Gnome", "class": "Wizard", "modifier": "Intelligence", "action": "Thunderclap"}
]

//Allow loading of files in public dir
app.use(express.static("public"))

// Load main home page
app.get( '/', ( req, res ) => sendFile(res, "public/index.html") )


//Pass app data on get request
app.get('/api/appdata', async(req,res)=>{
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(appdata));
})


const handlePost = function( request, response ) {
  let dataString = ""

  request.on( "data", function( data ) {
      dataString += data 
  })

  request.on( "end", function() {
    // console.log( JSON.parse( dataString ) )

    if (request.url === "/submit") {
      //handle submit code
      saveData(dataString);
    } else if(request.url === "/edit") {
      saveEdit(dataString);
    }
    else if(request.url === "/delete"){
      console.log("received delete request")
      //handle delete code
      deleteData(dataString)
    }

    response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
    response.end("Character Information Received")
  })
}


const saveData = function( jsonData ){
  let myDataJSON = JSON.parse( jsonData )

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

  appdata.push({"name": myDataJSON.charname, "race": myDataJSON.charrace, "class": myDataJSON.charclass, "modifier": charModifier, "action": randAction})

  console.log(appdata)
}

const saveEdit = function( jsonData ){
  let myDataJSON = JSON.parse( jsonData )
  appdata.push({"name": myDataJSON.name, "race": myDataJSON.race, "class": myDataJSON.class, "modifier": myDataJSON.modifier, "action": myDataJSON.action})
}
const deleteData = function( jsonData ){
  console.log("deleting based on jsondata ", jsonData )
  let myDataJSON = JSON.parse( jsonData )
  const deleteName = myDataJSON.deleteName;
  const deleteRace = myDataJSON.deleteRace;

  for (let i = 0; i < appdata.length; i++) {
    // Check if the current object's name and race match the provided values
    if (appdata[i].name === deleteName && appdata[i].race === deleteRace) {
      // Remove the object from the array
      appdata.splice(i, 1);
      // Break out of the loop since we've found and removed the entry
      break;
    }
  }

}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we"ve loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { "Content-Type": type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( "404 Error: File Not Found" )

     }
   })
}

console.log("Starting server...");
app.listen( process.env.PORT || 3000 )