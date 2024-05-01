const utilFuncs=require('./util.js');
const EventEmitter = require('node:events');

const gameEmitter = new EventEmitter();
function emitToServer(userID,msg){
    gameEmitter.emit('gameEnd',userID,msg);
}

class gameManager{
    constructor(maze,sPos){
        this.maze=maze;
        this.playerPos=sPos;
        this.playerDir=0;
        this.playerFlashes=2;
        this.playerActionCharge=0;
        this.playerLastAction=Date.now();
        this.canPlayerAct=true;
        this.result=0;
        this.playerMoveCount=0;
    }
};
class mazeHunter{
    constructor(startX,startY){
        this.x=startX;
        this.y=startY;
        this.dir=0;
        this.canMove=true;
        this.state=-1;
        this.stateProgress=0;
        this.lastStateUpdate=Date.now();
        this.targetPos=[];
        this.trackedPos=[];
        this.moveDelay=2000;
        this.escapeWindow=5000;
        /*
        states:
        -1:inactive
        0:wandering
        1:alerted
        2:hunting
        */
    }
    /*
    pick a random viable tile that is far away from the player.
    */
    async spawn(GM){
        let pPos=GM.playerPos;
        let availableTiles=GM.maze.tiles;
        let possibleSpawns=[];
        let distReq=2;//Math.floor(0.25*(GM.maze.xSize+GM.maze.ySize)/2.4);
        console.log("DIST REQ" + distReq);
        console.log(GM.maze.xSize +";;" + GM.maze.ySize);
        for (let xInd=0;xInd<GM.maze.xSize;xInd++){
                for (let yInd=0;yInd<GM.maze.ySize;yInd++){
                    let tile=availableTiles[xInd][yInd];
                    //console.log(tile);
                    if (utilFuncs.distXY(pPos,[xInd,yInd])>distReq && tile.type==2){
                        possibleSpawns.push(tile);
                        console.log("PERFECT");
                    }
                }
        }
        if (possibleSpawns.length>0){
            let rand=Math.floor(Math.random()*possibleSpawns.length);
            let chosenSpot=possibleSpawns[rand];
            this.x=chosenSpot.xPos;
            this.y=chosenSpot.yPos;
        }
        else{
            let rand=Math.floor(Math.random()*availableTiles.length);
            let chosenSpot=availableTiles[rand];
            this.x=chosenSpot.xPos;
            this.y=chosenSpot.yPos;
        }
        console.log(this.x);//unmef?
        console.log(this.y);
        this.state=0;
    }
    //How State and StateProgress works
    /*
    -if stateProgress reaches 100, it resets to 0 and state+=1.
    -while in state 1, stateProgress influences how often the enemy moves.
    -after X seconds, if stateProgress has not changed at all and is not in state 2, stateProgress will decrease over time and can lower the state level
    -if the player moves to an adjacent tile that the enemy is facing, they will immediately go to state 2, with stateprogress of 0.
    -upon reaching state 2, does not move for 1.5 sec
    -movement and flash in state 0 and 1 updates targetPos to the position they moved to or flashed in
    -if stateprogress increases, play audio cue
    -if state changes, play audio cue
    -while in state 2, once the player is not in direct line of sight, marks the last seen location of the player
        -when it reaches the location, if the player has not moved/flash within X seconds, reverts to state 1 with 90 progress
    */
    //called to update the state and stateprogress
    async reenableMovement(){
        await utilFuncs.wait(2750);
        this.canMove=true;
    }
    stateUpdate(GM,action){
        switch(action){
            case 'flash':
                //
                if (this.state==0){
                    this.stateProgress+=50;
                }
                else if (this.state==1){
                    this.stateProgress+=20;
                }
                if (this.stateProgress>=100){
                    this.stateProgress=0;
                    this.state+=1;
                    if (state==2){
                        this.canMove=false;
                        this.reenableMovement();
                    }
                }
                break;
            case 'move':
                //
                if (this.state==0){
                    this.stateProgress+=20;
                }
                else if (this.state==1){
                    this.stateProgress+=10;
                }
                if (this.stateProgress>=100){
                    this.stateProgress=0;
                    this.state+=1;
                    if (state==2){
                        this.canMove=false;
                        this.reenableMovement();
                    }
                }
                break;
            case 'spot':
                this.stateProgress=0;
                this.state=2;
                this.canMove=false;
                this.reenableMovement();
                break;
        }
        if (this.state==2){
            this.trackedPos+=GM.playerPos;
        }
        this.lastStateUpdate=Date.now();
        this.targetPos=GM.playerPos;
    }
    wallsOfTile(currentTile){
        let wallInds=[];
        let walls=currentTile.walls;//NSWE
        for (let i=0;i<4;i++){
            if (walls[i]==1){
                wallInds+=i;
            }
        }
        return wallInds;
    }
    chooseBasedOnTarget(){
        let dirRay=utilFuncs.dirXY([this.x,this.y],this.targetPos);
        //check the walls of current tile. Pick a direction if the wall for it is open and if the tile falls within range of the dirRay
        //NSWE
        let walls=currentTile.walls;
        let bestTiles=[];
        let backupTiles=[];
        for (let i=0;i<4;i++){
            if (walls[i]==1){
                switch(i){
                   case 0://N
                       if (dirRay[1]==-1){
                            bestTiles.push(0);
                       }
                       else{
                            backupTiles.push(0);
                       }
                       break;
                   case 1://S
                        if (dirRay[1]==1){
                            bestTiles.push(1);
                        }
                        else{
                            backupTiles.push(1);
                        }
                        break;
                   case 2://W
                        if (dirRay[0]==-1){
                            bestTiles.push(2);
                        }
                        else{
                            backupTiles.push(2);
                        }
                        break;
                   case 3://E
                        if (dirRay[0]==1){
                            bestTiles.push(3);
                        }
                        else{
                            backupTiles.push(3);
                        }
                        break;
                }
            }
        }
        let randInd=0;
        if (bestTiles.length>0){
            randInd=bestTiles[Math.floor(Math.random()*bestTiles.length)];
        }
        else{//
            randInd=backupTiles[Math.floor(Math.random()*backupTiles.length)];
        }
        return randInd;
    }
    moveToTile(ind){
        switch (ind){
            case 0://N
                this.y-=1;
                this.dir=0;
                break;
            case 1://S
                this.y+=1;
                this.dir=2;
                break;
            case 2://W
                this.x-=1;
                this.dir=3;
                break;
            case 3://E
                this.x+=1;
                this.dir=1;
                break;
        }
    }
    //can see 1 tile away
    move(user,GM){
        if (this.canMove){
                let gMap=GM.maze;
                let currentTile=gMap.tiles[this.x][this.y];
                if (this.state==0){
                    //check walls
                    let wallInds=this.wallsOfTile(currentTile);

                    let randInd=wallInds[Math.floor(Math.random()*wallInds.length)];
                    this.moveToTile(randInd);
                }
                else if (this.state==1){//semi-random, will move towards target location,
                    /*
                    Get "angle" to player
                    */

                    this.moveToTile(this.chooseBasedOnTarget(currentTile));
                }
                else if (this.state==2){//directly moves towards player
                    /*
                    to do this
                    when the enemy spots the player, grabs the direction to the player.
                    track the player internally
                        -if the tile they moved to is in direct line of sight,
                        set the enemy's targetLocation to that position
                        -if the tile isn't in direct line of sight, add the position and Date.now() to trackedPos
                    the direction above is updated if the player is in direct line of sight and has moved/flashed recently

                    */
                    if (this.x!=this.targetPos[0] || this.y!=this.targetPos[1]){
                        //let dirRay=utilFuncs.dirXY([this.x,this.y],this.targetPos);
                        this.moveToTile(this.chooseBasedOnTarget(currentTile));

                        //move towards the position
                    }
                    else{//must be at the target location, determine if enemy has lost player
                        /*if player has moved recently and is nearby, change dir, has not lost player

                        //else check trackedPos.
                        -if there are tiles listed in there,
                        go to each of those tiles until none left,
                        then revert to state1.
                        -if there are no tiles, pick from any nearby
                        tile that isn't the targetLocation
                        or is along the direction ray casted from targetLoc.
                        Move X times before reverting to stage 1.
                        */
                        if (GM.playerPos[0]==this.targetPos[0] && GM.playerPos[1]==this.targetPos[1]){
                            //the player is on the targetpos, kill them
                            GM.result=-1;
                            emitToServer(user.UserID,"game over");
                            //"game over"
                            //   "escaped"
                        }
                        else if (Date.now()-GM.playerLastAction<this.escapeWindow && utilFuncs.distXY(this.targetPos,GM.playerPos)<=1){
                            this.targetPos=GM.playerPos;
                            //change direction and go for player
                        }
                        else if(this.trackedPos.length>0){
                            let poppedTile=this.trackedPos[0];

                            this.targetPos=poppedTile;
                            trackedPos=trackedPos.slice(1);
                            //check trackedPos, select dir based on that
                        }
                        else{
                            let wallInds=wallsOfTile(currentTile);
                            let randInd=wallInds[Math.floor(Math.random()*wallInds.length)];
                            this.moveToTile(randInd);
                            //trackedPos is invalid
                        }
                    }
                }
        }

    }
}

function checkForWall(tile,ind){
    if (tile.walls[ind]==1){
        return true;
    }
    return false;
}
async function flash(player){
    let manager=player.GameManager;
    let maze=manager.maze;
    let x=manager.playerPos[0];
    let y=manager.playerPos[1];
    let view={
        valid:0,
        walls:[0,0,0,0,0,0],//0 if there is a wall to left,right,front (1 space);left,right,front (2 spaces)
        enemy:[],//an array of ints. each int represents an enemy. -1 means not visisble, 0 means same tile.
        //otherwise, 1 means visible to left, 2 means visible to right, 3-4 means visible in front
    }
    let currentTile=maze.tiles[x][y];
    let xlim=maze.xSize;
    let ylim=maze.ySize;
    if (manager.playerFlashes>0){
        manager.playerFlashes-=1;
        view.valid=1;
        //determine walls
        switch(manager.playerDir){
            case 0://N
                view.walls[0]=currentTile.walls[2];
                view.walls[1]=currentTile.walls[3];
                view.walls[2]=currentTile.walls[0];
                if (y>0){
                    view.walls[3]=maze.tiles[x][y-1].walls[2];//make sure to put checks that the tiles are valid
                    view.walls[4]=maze.tiles[x][y-1].walls[3];
                    view.walls[5]=maze.tiles[x][y-1].walls[0];
                }
                break;
            case 1://E
                view.walls[0]=currentTile.walls[0];
                view.walls[1]=currentTile.walls[1];
                view.walls[2]=currentTile.walls[3];
                if (x<xlim-1){
                view.walls[3]=maze.tiles[x+1][y].walls[0];
                view.walls[4]=maze.tiles[x+1][y].walls[1];
                view.walls[5]=maze.tiles[x+1][y].walls[3];
                }
                break;
            case 2://S
                view.walls[0]=currentTile.walls[3];
                view.walls[1]=currentTile.walls[2];
                view.walls[2]=currentTile.walls[1];
                if (y<ylim-1){
                view.walls[3]=maze.tiles[x][y+1].walls[3];
                view.walls[4]=maze.tiles[x][y+1].walls[2];
                view.walls[5]=maze.tiles[x][y+1].walls[1];
                }
                break;
            case 3://W
                view.walls[0]=currentTile.walls[1];
                view.walls[1]=currentTile.walls[0];
                view.walls[2]=currentTile.walls[2];
                if (x>0){
                view.walls[3]=maze.tiles[x-1][y].walls[1];
                view.walls[4]=maze.tiles[x-1][y].walls[0];
                view.walls[5]=maze.tiles[x-1][y].walls[2];
                }
                break;
        }
        //determine enemy
         for (let i=0;i<player.Enemy.length;i++){
            let ePos=[player.Enemy[i].x,player.Enemy[i].y];
            if (ePos[0]==currentTile.xPos && ePos[1]==currentTile.yPos){
                view.enemy.push(0);
            }
            else{
                switch(manager.playerDir){
                    case 0://N
                        if (ePos[0]+1==currentTile.xPos && view.walls[0]==1){
                            view.enemy.push(1);
                        }
                        else if(ePos[0]-1==currentTile.xPos && view.walls[1]==1){
                            view.enemy.push(2);
                        }
                        else if(ePos[1]+1==currentTile.yPos && view.walls[2]==1){
                             view.enemy.push(3);
                        }
                        else if(ePos[1]+2==currentTile.xPos && view.walls[3]==1){
                             view.enemy.push(4);
                        }
                        else{
                            view.enemy.push(-1);
                        }
                        break;
                    case 1://E//TODOOOO

                        if (ePos[1]+1==currentTile.yPos && view.walls[0]==1){
                            view.enemy.push(1);
                        }
                        else if(ePos[1]-1==currentTile.yPos && view.walls[1]==1){
                            view.enemy.push(2);
                        }
                        else if(ePos[0]-1==currentTile.xPos && view.walls[2]==1){
                             view.enemy.push(3);
                        }
                        else if(ePos[0]-2==currentTile.xPos && view.walls[3]==1){
                             view.enemy.push(4);
                        }
                        else{
                            view.enemy.push(-1);
                        }
                        break;
                    case 2://S
                        if (ePos[0]-1==currentTile.xPos && view.walls[0]==1){
                            view.enemy.push(1);
                        }
                        else if(ePos[0]+1==currentTile.xPos && view.walls[1]==1){
                            view.enemy.push(2);
                        }
                        else if(ePos[1]-1==currentTile.yPos && view.walls[2]==1){
                             view.enemy.push(3);
                        }
                        else if(ePos[1]-2==currentTile.xPos && view.walls[3]==1){
                             view.enemy.push(4);
                        }
                        else{
                            view.enemy.push(-1);
                        }
                        break;
                    case 3://W

                        if (ePos[1]-1==currentTile.yPos && view.walls[0]==1){
                            view.enemy.push(1);
                        }
                        else if(ePos[1]+1==currentTile.yPos && view.walls[1]==1){
                            view.enemy.push(2);
                        }
                        else if(ePos[0]+1==currentTile.xPos && view.walls[2]==1){
                             view.enemy.push(3);
                        }
                        else if(ePos[0]+2==currentTile.xPos && view.walls[3]==1){
                             view.enemy.push(4);
                        }
                        else{
                            view.enemy.push(-1);
                        }
                        break;
                }
            }

        }
    }
    return view;
}
function addArrs(a,b){//element-wise addition
    return a.map((e,i) => e + b[i]);
}

async function moveInDir(gMap,player,dir){
    let currentPos=player.GameManager.playerPos;
    let posChange=[0,0];
    let wallInd=0;
    let GM=player.GameManager;
    switch(GM.playerDir){
        case 0://N
            posChange=[0,-dir];
            break;
        case 1://E
            posChange=[dir,0];
            wallInd=3;
            break;
        case 2://S
            posChange=[0,dir];
            wallInd=1;
            break;
        case 3://W
            posChange=[-dir,0];
            wallInd=2;
            break;
    }
    if(checkForWall(gMap.tiles[currentPos[0]][currentPos[1]],wallInd)){
        let newTile=addArrs(currentPos,posChange);
        console.log(currentPos);
        console.log(posChange);
        console.log(newTile);
        if (!(gMap.xSize<=newTile[0] || 0>newTile[0] || 0>newTile[1] || gMap.ySize<=newTile[1])){
            console.log(GM.playerFlashes);
            if (GM.playerFlashes<2){
                console.log("HELLO CHARGEd");
                GM.playerActionCharge+=1;
                if (GM.playerActionCharge>=4){
                    GM.playerActionCharge=0;
                    GM.playerFlashes+=1;
                }
            }
            GM.playerPos=newTile;
            GM.playerLastAction=Date.now();
            GM.playerMoveCount+=1;
            //if the player moved onto a tile that an enemy is on, either change enemy state or kill player
            for (let i=0;i<player.Enemy.length;i++){
                if (player.Enemy[i].x==GM.playerPos[0] && player.Enemy[i].y==GM.playerPos[1]){
                    if (player.Enemy[i].state==2 && player.Enemy[i].canMove){
                        GM.result=-1;
                        emitToServer(user.UserID,"game over");
                    }
                    else{
                        player.Enemy[i].canMove=false;
                        player.Enemy[i].state=2;
                        player.Enemy[i].reenableMovement();
                    }
                }
                else if (player.Enemy[i].state==2){
                    player.Enemy[i].trackedPos.push(GM.playerPos);
                }
            }
            return true;
        }
    }
    return false;


}

async function playerAction(player,req,responseBody){
    let GM=player.GameManager;
    if (GM.canPlayerAct){
        responseBody.accepted=1;
        GM.canPlayerAct=false;
        let inputCode=req.body;
        console.log(inputCode);
        switch(Number(inputCode)){
            case 65:
                GM.playerDir-=1;
                if (GM.playerDir<0){
                    GM.playerDir=3;
                }
                break;
            case 68:
                GM.playerDir+=1;
                if (GM.playerDir>3){
                    GM.playerDir=0;
                }
                break;
            case 87:
                if (await moveInDir(GM.maze,player,1)){
                    //perform check to see if win or lose
                    if ("EXIT" in GM.maze.tiles[GM.playerPos[0]][GM.playerPos[1]].tags){
                        GM.result=1;
                        emitToServer(user.UserID,"escaped");
                    }
                    else{
                        for (let i=0;i<player.Enemy.length;i++){
                            let ePos=[player.Enemy[i].x,player.Enemy[i].y];
                            let dist=utilFuncs.distXY(player.GameManager.playerPos,ePos);
                            if (dist<=3){
                                player.Enemy[i].stateUpdate(GM,'move');
                            }
                        }
                    }
                }
                break;
            case 83:
                if (await moveInDir(GM.maze,player,-1)){
                    if ("EXIT" in GM.maze.tiles[GM.playerPos[0]][GM.playerPos[1]].tags){
                        GM.result=1;
                        emitToServer(user.UserID,"escaped");
                    }
                    else{
                        for (let i=0;i<player.Enemy.length;i++){
                            let ePos=[player.Enemy[i].x,player.Enemy[i].y];
                            let dist=utilFuncs.distXY(player.GameManager.playerPos,ePos);
                            if (dist<=3){
                                player.Enemy[i].stateUpdate(GM,'move');
                            }
                        }
                    }
                }
                break;
            case 32:
                console.log("FLASH");
                let result=await flash(player);
                responseBody.view=result;
                for (let i=0;i<player.Enemy.length;i++){
                    let ePos=[player.Enemy[i].x,player.Enemy[i].y];
                    let dist=utilFuncs.distXY(player.GameManager.playerPos,ePos);
                    if (dist<=5){
                        player.Enemy[i].stateUpdate(GM,'flash');
                    }
                }
                break;
        }
        resetCanAct(GM);
        if (GM.playerMoveCount==2){//==5
            for (let i=0;i<player.Enemy.length;i++){
                if (player.Enemy[i].state==-1){
                    player.Enemy[i].spawn(GM);
                    enemyAI(player,GM,player.Enemy[i]);
                }

            }
        }
        responseBody.flashes=GM.playerFlashes;
        responseBody.flashCharge=GM.playerActionCharge;
    }
}
async function resetCanAct(GM){
    await utilFuncs.wait(1100);
    GM.canPlayerAct=true;
}

async function enemyAI(user,GM,enemy){//will have to use websockets or SSEs for this
    //player must still be playing the game
    if (GM.result==0){
        enemy.move(user,GM);
        await utilFuncs.wait(enemy.moveDelay);
        enemyAI(user,GM,enemy);
    }
}
async function getStarts(maze){
    let startTiles=[];
    for (let x=0;x<maze.xSize;x++){
        for (let y=0;y<maze.ySize;y++){
            if (maze.tiles[x][y].tags.includes("START")){
                startTiles.push(maze.tiles[x][y]);
            }
        }
    }
    return startTiles;
}
async function startGame(user,maze,currentPlayers){
    let sTiles=await getStarts(maze);
    let startTile=sTiles[Math.floor(Math.random()*sTiles.length)];
    let startPos=[startTile.xPos,startTile.yPos];
    let gm=new gameManager(maze,startPos);
    let hunter=new mazeHunter(0,0);
    currentPlayers[user]={UserID:user,Maze:maze,GameManager:gm,Enemy:[hunter]};
}
module.exports={startGame,playerAction};