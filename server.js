const express = require('express');
const classes=require('./mapClasses.js')
const { MongoClient } = require('mongodb');
const app = express();
const http=require( "http" );
const fs= require( "fs" );
const mime = require( "mime" );
const PORT = 4000;

//"http://" +'/generateMaze';
const url = 'mongodb://localhost:27017';
const dir="/";
const client = new MongoClient(url, { family: 4 });
// Database Name
const dbName = 'mazeMakerDB';
let serverShutdown=false;
app.use(express.text())
const session = require('express-session');

app.use(session({
  secret: 'Oo6iCFWGj7Ip3GAjphCa2FFkm',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get('*',(req,res)=>{
  const filename = req.url.slice( 1 );
  console.log(filename);
  console.log("STAT" + req.status);
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



class gameManager{
    constructor(maze,sPos){
        this.maze=maze;
        this.playerPos=sPos;
        this.playerFlashes=2;
        this.playerActionCharge=0;
        this.canPlayerAct=false;
    }
};
class mazeHunter{
    constructor(startX,startY){
        this.x=startX;
        this.y=startY;
        this.state=-1;
        /*
        states:
        -1:inactive
        0:wandering
        1:alerted
        2:hunting
        */
    }
}



async function findUser(userData) {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);
  const userCollection=await db.collection( "MazeUsers");
    const result=await userCollection.countDocuments(userData);
    console.log(result);
    if (result>0){
        return true;
    }
    else{
        return false;
    }
}
async function addUser(userData) {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const userCollection=await db.collection( "MazeUsers");
    const result=await userCollection.countDocuments({"Username":userData.Username});
    console.log(result);
    if (result>0){
        return -1;
    }
    else{
        let insertResult=await userCollection.insertOne(userData);
        if (insertResult){
            return 1;
        }
        return 0;
    }
}
async function addMaze(userData,maze){
 await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const userCollection=await db.collection( "Mazes");
    const result=await userCollection.countDocuments(userData);
    console.log(result);
    let mazeObj=null;
    if (result>0){//user has a maze here, add another one
        mazeObj={
                    Username:userData.Username,
                    Maze:maze,
                    MazeID:result,
                }
    }
    else{
        mazeObj={
            Username:userData.Username,
            Maze:maze,
            MazeID:0,
        }
    }
    let insertResult=await userCollection.insertOne(mazeObj);
    if (insertResult){
        console.log("MAZE SAVED");
        return true;
    }
    return false;
}
async function getMazes(userData){
    await client.connect();
    const db = client.db(dbName);
    const userCollection=await db.collection( "Mazes");
    let mazesToReturn=[];
    const result=await userCollection.find(userData);
    for await (const doc of result) {
        mazesToReturn.push({ID:doc.MazeID,XSize:doc.Maze.xSize,YSize:doc.Maze.ySize});
    }
    return mazesToReturn;
}

async function makeSavedMaze(user,mazeID){
    let nameObj={
        "Username":user,
        "ID":mazeID
    }
    let result= await getMazes(nameObj);
    if (result.length==1){

    }
    else{
        //err
        return -1;
    }
}

app.post('/login', async(req, res) => {
  // Replace this with the actual data you want to send.
  let userDetails=JSON.parse(req.body);
  let result=await findUser(userDetails);
  if (result){
    req.session.user={
        username:userDetails.Username
    }
    res.redirect(302,"/index.html");

  }
  else{
    res.send("Invalid Login!");
  }
});
app.post('/register', async(req, res) => {
    let userDetails=JSON.parse(req.body);
    let result=await addUser(userDetails)
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
        let result= await getMazes(nameObj);
        res.send(JSON.stringify(result));

    }

});
currentPlayers={

};
app.post('/playMaze',async(req,res)=>{
    if (req.session.user) {
        let user=req.session.user.username;
        let id=req.body;
        let maze= await makeSavedMaze(user,id);
        if (maze==-1){

        }
        else{
            let sTiles=getStarts(maze);
            let startPos=sTiles[Math.floor(Math.random()*sTiles.length)];
            let gm=new gameManager(maze,startPos);
            let hunter=new mazeHunter();
            currentPlayers[user]=;
        }

    }

});

app.post('/actionRequest',async(req,res)=>{
    if (req.session.user) {
        let user=req.session.user.username;
    }

});

app.post('/saveMaze', async(req, res) => {
    if (req.session.user) {
        let nameObj={

            "Username":req.session.user.username
        }
        let result= await addMaze(nameObj,JSON.parse(req.body));
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

app.post('/generateSaved',async (req, res) => {

   });

app.post('/generateMaze', async (req, res) => {
  const data = JSON.parse(req.body);
  var maze=await generate(data);
  console.log(JSON.stringify(maze));
  res.send(maze);
});

/*
Given a map of tiles
Designate X exit points
Choose a random starting point, preferring to be as far away as possible from the exits
Random walk until an exit point is reached
Each step
First, check if that tile is already a path
If so, cancel this random walk and backtrack before restarting.
Else
Connects that tile to the path
When an exit point is reached
Backtrack. Occasionally, start a separate random walk at random points


basically a variant of depth-first
*/

/*
Type 1: Standard Maze: Entrance and exits are at the edges
Type 2: Exits are at the edges
Type 3: Exits can be anywhere

Tile Types
0:NULL (not used, for possible future versions)
1:WALL
2:PATH

Tile Tags: Can have multiple"
"EXIT"
"EDGE"
"START"
*/
async function getStarts(maze){
    let startTiles=[];
    for (let x=0;x<maze.xSize;x++){
        for (let y=0;y<maze.ySize;y++){
            if (maze.tiles[x][y].tags.include("START")){
                startTiles.push(maze.tiles[x][y]);
            }
        }
    }
    return startTiles;
}

async function generate(params){
    console.log("RECEIVED REQ TO MAKE MAZE");
    let x=params.xSize
    let y=params.ySize;
    var newMap=new classes.GameMap(x,y);
    let exitAmt=params.exitCount;
    console.log(x+";"+y+";"+exitAmt);
    let mazeType=1;
    newMap.tiles=empty2DArr(x,y);
    //we got an empty map
    //now, make a maze out of it
    edgeTiles(newMap,x,y);
    let startCandidates=null;
    let exitCandidates=null;
    let startPos=null;
    let exits=[];
    //make exits
    switch(mazeType){
        case 1:
            startCandidates=getTilesOfTag(newMap,["EDGE"],"ONLY");
            startPos=startCandidates[Math.floor(Math.random()*startCandidates.length)];

        case 2:
            if (startPos==null){
                startCandidates=getTilesOfTag(newMap,["EDGE"],"NOT");
                startPos=startCandidates[Math.floor(Math.random()*startCandidates.length)];
            }
            startPos.tags.push("START");
            startPos.type=2;
            exitCandidates=getTilesOfTag(newMap,["EDGE"],"ONLY");
            for (let e=0;e<exitAmt;e++){
                let randInd=Math.floor(Math.random()*exitCandidates.length);
                console.log("RAND WALK");
                //attempt a random walk from this pt to the start
                await randomWalk(newMap,startPos,exitCandidates[randInd]);
                exitCandidates.splice(randInd, 1);
            }
            break;
        case 3:
            break;
    }
    return newMap;
    //cho
}
function addTileAndWeight(tileArr,weightArr,tile,weight){
    tileArr.push(tile);
    if (tile.tags.includes("EDGE")){
        weight*=0.8;
    }
    if (tile.type==2){
        weight*=0.5;
    }
    weightArr.push(weight);
}
async function randomWalk(gMap,tile,dest,minLength=10){//returns a stack of tiles of the path to the dest
    let stack=[tile];
    let visited=[tile];
    dest.type=2;
    dest.tags.push("EXIT");
    let currentTile=tile.copy();
    let pathLength=0;
    let bt=false;
    console.log("Dest TILE IS " + dest.xPos + "," + dest.yPos);
    const createStream = fs.createWriteStream('pathLog.txt');
    while (!currentTile.matches(dest) && !serverShutdown){
        if (bt){
            createStream.write(`Restarting at ${currentTile.xPos},${currentTile.yPos}\n`);
            createStream.write("Can choose between these\n");
        }
        console.log(currentTile);
        //console.log("PATH LENGTH IS "+pathLength);
        //console.log("CURRENT TILE IS " + currentTile.xPos + "," + currentTile.yPos);
        let possibleTiles=[];
        let tileWeights=[];
        //Tiles have lower weight when
        /*
            base weight 1
            path length is too small and the tile is near the dest->weight gets set to 0
            tile is already a path tile->weight * 0.5
            tile is an edge tile->weight *0.8
        */
        for (let tempX=-1;tempX<2;tempX+=2){
            let xPos=currentTile.xPos+tempX;
            let wallInd=(1+tempX)/2;
            wallInd+=2;
            let yPos=currentTile.yPos;
            if (xPos<gMap.xSize && xPos>=0){
                let candidate=gMap.tiles[xPos][yPos];
                //console.log("LOOKING AT TILE " + xPos +","+yPos);
                if (!visited.includes(candidate) && currentTile.walls[wallInd]!=1){
                    let weight=10;
                    if (pathLength<minLength){
                        addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                        /*
                        //depending on how close path is to minLength, the restricting area size changes
                        if (pathLength/minLength<0.7){//3 by 3 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=3 || Math.abs(dest.yPos-yPos)<=3)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }
                        else if(pathLength/minLength<0.4){//5 by 5 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=5 || Math.abs(dest.yPos-yPos)<=5)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }
                        else{//7 by 7 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=7 || Math.abs(dest.yPos-yPos)<=7)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }
                        */
                    }
                    else{
                        addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                    }
                }
                else{
                    console.log("IN STACK is TILE " + candidate.xPos+","+candidate.yPos);
                }
            }
        }
        for (let tempY=-1;tempY<2;tempY+=2){
            let xPos=currentTile.xPos;
            let yPos=currentTile.yPos+tempY;
            let wallInd=(1+tempY)/2;
            if (yPos<gMap.ySize && yPos>=0){
                let candidate=gMap.tiles[xPos][yPos];
                //console.log("LOOKING AT TILE " + xPos +","+yPos);
                if (!visited.includes(candidate) && currentTile.walls[wallInd]!=1){
                //note: must not enter if the wall btwn the two is already open
                    let weight=10;
                    if (pathLength<minLength){
                    /*
                        //depending on how close path is to minLength, the restricting area size changes
                        if (pathLength/minLength<0.7){//3 by 3 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=3 && Math.abs(dest.yPos-yPos)<=3)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }
                        else if(pathLength/minLength<0.4){//5 by 5 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=5 && Math.abs(dest.yPos-yPos)<=5)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }
                        else{//7 by 7 square, dest center
                            if (!(Math.abs(dest.xPos-xPos)<=7 && Math.abs(dest.yPos-yPos)<=7)){
                                addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                            }
                        }*/
                        addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                    }
                   else{
                        addTileAndWeight(possibleTiles,tileWeights,candidate,weight);
                    }

                }
                else{
                    console.log("IN STACK is TILE " + candidate.xPos+","+candidate.yPos);
                }
            }
        }
        if (possibleTiles.length>0){
            if (bt){
                bt=false;

                createStream.write("Our candidate options are\n");
                for(let i=0;i<possibleTiles.length;i++){
                createStream.write(`\t ${possibleTiles[i].xPos},${possibleTiles[i].yPos}\n`);
                }
            }
            let totalWeight=0;
            //console.log("POSSIBLE TILES: " + possibleTiles.length);
            // Running the for loop
            for (let i = 0; i < tileWeights.length; i++) {
                totalWeight += tileWeights[i];
            }
            let chosenWeight=Math.random()*totalWeight;
            let chosenTile=null;
            let ind=0;
            for (ind = 0; ind < tileWeights.length; ind++)
            {
                if (tileWeights[ind] > chosenWeight)
                {
                    break;
                }
                chosenWeight-=tileWeights[ind];
            }

            chosenTile=possibleTiles[ind];
            chosenTile.type=2;
            let xDir=chosenTile.xPos-currentTile.xPos;
            if (xDir!=0){
                if (xDir<0){
                    chosenTile.walls[3]=1;
                    gMap.tiles[currentTile.xPos][currentTile.yPos].walls[2]=1;
                }
                else{
                    chosenTile.walls[2]=1;
                    gMap.tiles[currentTile.xPos][currentTile.yPos].walls[3]=1;
                }
            }
            else{
                let yDir=chosenTile.yPos-currentTile.yPos;
                if (yDir<0){
                    chosenTile.walls[1]=1;
                    gMap.tiles[currentTile.xPos][currentTile.yPos].walls[0]=1;
                }
                else{
                    chosenTile.walls[0]=1;
                    gMap.tiles[currentTile.xPos][currentTile.yPos].walls[1]=1;
                }
            }
            chosenTile.type=2;
            stack.push(chosenTile);
            visited.push(chosenTile);
            createStream.write(`Moved to tile ${chosenTile.xPos},${chosenTile.yPos}\n`);
            currentTile=chosenTile.copy();
            //console.log("MOVED TO TILE "+ currentTile.xPos+","+currentTile.yPos);
            pathLength++;
        }
        else if (stack.length>0){

            console.log("BACKTRACK");
            let mostRecent=stack.pop();
            createStream.write(`Tile ${mostRecent.xPos},${mostRecent.yPos} is a dead end\n`);
            //iterate thr stack to find a tile w/ an unvisited neighbor
            let foundValidBacktrack=false;
            while (stack.length>0 && !foundValidBacktrack){
                pathLength--;
                let mostRecent=stack.pop();
                //console.log("BACKTRACKED TO TILE "+mostRecent.xPos+","+mostRecent.yPos);
                if (mostRecent.walls.includes(0)){
                    let wInd=0;
                    for(let v=-1;v<2;v+=2){
                        if (mostRecent.walls[wInd]==0 && mostRecent.yPos+v>=0 && mostRecent.yPos+v<gMap.ySize){
                            if (!visited.includes(gMap.tiles[mostRecent.xPos][mostRecent.yPos+v])){
                                currentTile=mostRecent.copy();
                                stack.push(mostRecent);
                                createStream.write(`Valid Tile ${mostRecent.xPos},${mostRecent.yPos}, stop backtracking\n`);
                                createStream.write(`The possible path found is tile ${mostRecent.xPos},${mostRecent.yPos+v}\n`);
                                foundValidBacktrack=true;
                                break;
                            }
                        }
                        wInd++;
                    }
                    for(let h=-1;h<2;h+=2){
                        if (mostRecent.walls[wInd]==0  && mostRecent.xPos+h>=0 && mostRecent.xPos+h<gMap.xSize){
                            if (!visited.includes(gMap.tiles[mostRecent.xPos+h][mostRecent.yPos])){
                                currentTile=mostRecent.copy();
                                stack.push(mostRecent);
                                createStream.write(`Valid Tile ${mostRecent.xPos},${mostRecent.yPos}, stop backtracking\n`);
                                createStream.write(`The possible path found is tile ${mostRecent.xPos+h},${mostRecent.yPos}\n`);
                                foundValidBacktrack=true;
                                break;
                            }
                        }
                        wInd++;
                    }

                }
                if (!foundValidBacktrack){
                    createStream.write(`Moved back to Tile ${mostRecent.xPos},${mostRecent.yPos}, keep going\n`);
                }

            }
            //console.log("DONE WITH BT");
            bt=true;
        }
        else{
            console.log("BREAKING");
            //console.log(gMap.tiles);
            break;
        }
        await new Promise(resolve => setTimeout(resolve, 2));
    }
    createStream.end();
    console.log("WE MADE A PATH");
}

function edgeTiles(gMap,x,y){
    for (let xC=0;xC<x;xC+=(gMap.xSize-1)){
        for (let yC=0;yC<y;yC++){
            gMap.tiles[xC][yC].tags.push("EDGE");
            if (xC==0){
                gMap.tiles[xC][yC].walls[2]=1;
            }
            else{
                gMap.tiles[xC][yC].walls[3]=1;
            }
        }
    }
    for (let xC=0;xC<x;xC++){
        for (let yC=0;yC<y;yC+=(gMap.ySize-1)){
            gMap.tiles[xC][yC].tags.push("EDGE");
            if (yC==0){
                gMap.tiles[xC][yC].walls[0]=1;
            }
            else{
                gMap.tiles[xC][yC].walls[1]=1;
            }
        }
    }
    //sets the borders of the map to be edges
}
function getTilesOfTag(gMap,tagArr,operator="OR"){
    //operator: OR or AND
    var tileArr=[];
    if (operator=="OR"){
        for (let x=0;x<gMap.xSize;x++){
            for (let y=0;y<gMap.ySize;y++){
                if (tagArr.some((element) => gMap.tiles[x][y].tags.includes(element))){
                    tileArr.push(gMap.tiles[x][y]);
                }
            }
        }
    }
    else if(operator=="AND"){
        for (let x=0;x<gMap.xSize;x++){
            for (let y=0;y<gMap.ySize;y++){
                if (tagArr.every((element) => gMap.tiles[x][y].tags.includes(element))){
                    tileArr.push(gMap.tiles[x][y]);
                }
            }
        }
    }
    else if(operator=="ONLY"){
        for (let x=0;x<gMap.xSize;x++){
            for (let y=0;y<gMap.ySize;y++){
                if (tagArr.length === gMap.tiles[x][y].tags.length && tagArr.every(v => gMap.tiles[x][y].tags.includes(v))){
                    tileArr.push(gMap.tiles[x][y]);
                }
            }
        }
    }
    else if(operator=="NOT"){

    }
    return tileArr;
}

process.on('SIGINT', () => {
    if (serverShutdown){
     process.exit(); // Exit the process
    }
    else{
        serverShutdown=true;
        }
});
function empty2DArr(x,y){//basic rectangular map
    return Array.from({length: x}, (v, i) => Array.from({length: y}, (w,j) => new classes.Tile(i,j,1)));
}
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
})

/*
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());*/
//https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/