const PORT = 4000;
const actionManager=require('./actionManager.js')
const express = require('express');
const classes=require('./mapClasses.js')
const { MongoClient } = require('mongodb');
const app = express();
const http=require( "http" );
const fs= require( "fs" );
const mime = require( "mime" );
const session = require('express-session');
const expressWs = require('express-ws');
const url = 'mongodb://localhost:27017';
const dir="/";
const client = new MongoClient(url, { family: 4 });

global.serverShutdown=false;
app.use(express.text());
expressWs(app);

app.use(session({
    secret: 'Oo6iCFWGj7Ip3GAjphCa2FFkm',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
const socketMap = new Map();
app.ws('/',function(ws,req){
    if (req.session.user){
        socketMap.set(req.session.user,ws);
        ws.onclose=function(){
            socketMap.delete(req.session.user);
        };
    }
});
app.get('*',(req,res)=>{
  const filename = req.url.slice( 1 );
  if( req.url === "/" ) {
    sendFile( res, "login.html" )
  }else{
    sendFile( res, filename )
  }

})
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
currentPlayers={

};
app.post('/playMaze',async(req,res)=>{//rather than this, have it just pass back the current maze on client
    if (req.session.user) {
        let user=req.session.user.username;
        let maze= JSON.parse(req.body);
        await actionManager.startGame(user,maze,currentPlayers);
        res.send(1);
    }
});
/*
KeyCodes
a	65
d	68
w	87
s	83
space	32
*/
/*
the monster will not be able to kill the player if the player has not moved in the past X seconds AND the player was not in its line of sight when they stopped moving. if the player uses a flash,t his resets the window
However, every time the monster directly enters the tile of the player, a difficulty value will rise (this value cannot rise for X seconds after it increases)
This value reduces the window to stop moving, and eventually removes said window.
*/
/*
this should determine if the player dies, and if so, send back a message
*/

app.post('/actionRequest',async(req,res)=>{
    let responseBody={
        accepted:0,
        state:0,
        view:{},
    }
    if (req.session.user) {
        let user=req.session.user.username;
        if (user in currentPlayers){
            let player=currentPlayers[user];
            await actionManager.playerAct(player,req,responseBody);

            //if valid, will pass back a json response body

        }
    }
    res.send(JSON.stringify(responseBody));

});


app.post('/loadMaze',async (req, res) => {
    if (req.session.user){
        let result=await actionManager.makeSavedMaze(client,req.session.user.username,req.body);
        res.send(result);
    }
    else{
        res.send(403);
    }
});


//connect.sid=s%3A7aSRyYD6ATlNKD9w7r1FqCdfsZT1Wai-.%2B%2FXhktMDaLMLGS3sktHssOvIwWtM0daiJ3Xgni3Wu1Q',connect.sid=s%3A7aSRyYD6ATlNKD9w7r1FqCdfsZT1Wai-.%2B%2FXhktMDaLMLGS3sktHssOvIwWtM0daiJ3Xgni3Wu1Q',
app.post('/login', async(req, res) => {
  // Replace this with the actual data you want to send.
  let userDetails=JSON.parse(req.body);
  let result=await actionManager.findUser(client,userDetails);
  if (result){
    req.session.user={
        username:userDetails.Username
    }
    res.redirect(302,"/index.html");
  }
  else{
    res.send(403,"Invalid Login!");
  }
});
app.post('/register', async(req, res) => {
    let userDetails=JSON.parse(req.body);
    let result=await actionManager.addUser(client,userDetails)
    switch(result){
        case 1:
            currentUser=userDetails;
            res.send("Registration Successful! You can login now");
            break;
        case 0:
            res.send("Unable to register user. Please try again.");
            break;
        case -1:
            res.send("User with that name already exists!");
            break;

    }
});

app.post('/userMazes',async(req,res) => {
    if (req.session.user) {
        console.log("GETTING USER MAZES " + req.session.user.username);
        let nameObj={
            "Username":req.session.user.username
        }
        let result= await actionManager.getMazes(client,nameObj);
        res.send(JSON.stringify(result));
    }
    else{
        res.send(403);
    }

});

app.post('/saveMaze', async(req, res) => {
    if (req.session.user) {
        let nameObj={

            "Username":req.session.user.username
        }
        let receivedMaze=JSON.parse(req.body);

        let result= await actionManager.addMaze(client,nameObj,receivedMaze);
        if (result){
            res.send("Saved!");
        }
        else{
            res.send("Failed to save. Try again.");
        }

    }
    else{
        console.log("not right user???");
    }

});


app.post('/generateMaze', async (req, res) => {
    if (req.session.user){
      const data = JSON.parse(req.body);
      var maze=await actionManager.makeMaze(data);

      res.send(maze);
    }
});


process.on('SIGINT', () => {
    if (global.serverShutdown){
     process.exit(); // Exit the process
    }
    else{
        global.serverShutdown=true;
    }
});

let server=app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})