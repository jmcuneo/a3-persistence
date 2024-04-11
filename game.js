const util=require('./util.js');
class gameManager{
    constructor(maze,sPos){
        this.maze=maze;
        this.playerPos=sPos;
        this.playerDir=0;
        this.playerFlashes=2;
        this.playerActionCharge=0;
        this.playerLastAction=Date.now();
        this.canPlayerAct=false;
        this.result=0;
        this.playerMoveCount=0;
    }
};
class mazeHunter{
    constructor(startX,startY){
        this.x=startX;
        this.y=startY;
        this.dir=0;
        this.state=-1;
        this.stateProgress=0;
        this.lastStateUpdate=Date.now();
        this.targetPos=[];
        this.trackedPos=[];
        this.escapeWindow=5000;
        /*
        states:
        -1:inactive
        0:wandering
        1:alerted
        2:hunting
        */
    }
    spawn(){
        return null;
    }
    //How State and StateProgress works
    /*
    -if stateProgress reaches 100, it resets to 0 and state+=1.
    -while in state 1, stateProgress influences how often the enemy moves.
    -after X seconds, if stateProgress has not changed at all and is not in state 2, stateProgress will decrease over time and can lower the state level
    -if the player moves to an adjacent tile that the enemy is facing, they will immediately go to state 2, with stateprogress of 0.
    -upon reaching state 2, does not move for 1.5 sec
    -if the player flashes within 5 units, the enemy will gain stateProgress
        -state=0, gain 50 progress
        -state=1, gain 20 progress
    -if the player moves within 3 units, the enemy will gain stateProgress
        -state=0, gain 20 progress
        -state=1, gain 10 progress
    -movement and flash in state 0 and 1 updates targetPos to the position they moved to or flashed in
    -if stateprogress increases, play audio cue
    -if state changes, play audio cue
    -while in state 2, once the player is not in direct line of sight, marks the last seen location of the player
        -when it reaches the location, if the player has not moved/flash within X seconds, reverts to state 1 with 90 progress
    */
    //called to update the state and stateprogress
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
                }
                break;
            case 'spot':
                this.stateProgress=0;
                this.state=2;
                break;
        }
        this.lastStateUpdate=Date.now();
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
        switch (randInd){
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
    move(GM){
        let gMap=GM.maze;
        currentTile=gMap.tiles[x][y];
        let delay=2000;
        if (state==0){
            //check walls
            let wallInds=wallsOfTile(currentTile);

            let randInd=wallInds[Math.floor(Math.random()*wallInds.length)];
            moveToTile(randInd);
        }
        else if (state==1){//semi-random, will move towards target location,
            /*
            Get "angle" to player
            */

            moveToTile(chooseBasedOnTarget(currentTile));
        }
        else if (state==2){//directly moves towards player
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
                moveToTile(chooseBasedOnTarget(currentTile));
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
                }
                else if (Date.now()-GM.playerLastAction<this.escapeWindow && utilFuncs.distXY(this.targetPos,GM.playerPos)<=1){
                    //change direction and go for player
                }
                else if(false){
                    //check trackedPos, select dir based on that
                }
                else{
                    //trackedPos is invalid
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
function flash(manager){
    let view={
        valid:0,
        walls:[0,0,0,0],//0 if there is a wall to left,right,front (1 space),front (2 spaces)
    }
    if (manager.playerFlashes>0){
        manager.playerFlashes-=1;
        view[valid]=1;
        //determine what to draw via obj body

    }
    return view;
}


function moveInDir(gMap,player,dir){
    let currentPos=player.GameManager.playerPos;
    let posChange=[0,0];
    let wallInd=0;
    switch(player.GameManager.playerDir){
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
        let newTile=currentPos+posChange;
        if (!(gMap.xSize<=newTile[0] || 0>newTile[0] || 0>newTile[1] || gMap.ySize<=newTile[1])){
            if (player.GameManager.playerFlashes<2){
                player.GameManager.playerActionCharge+=1;
                if (player.GameManager.playerActionCharge>=6){
                    player.GameManager.playerActionCharge=0;
                    player.GameManager.playerFlashes+=1;
                }
            }
            player.GameManager.playerPos=newTile;
            return true;
        }
    }
    return false;


}

function playerAction(player,req,responseBody){
    let GM=player.GameManager;
    if (canAct(GM.canPlayerAct)){

        responseBody[accepted]=1;
        GM.canPlayerAct=false;
        let inputCode=req.body;
        switch(inputCode){
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
                if (moveInDir(GM.maze,player,1)){
                    //perform check to see if win or lose
                    if ("EXIT" in GM.maze.tiles[GM.playerPos[0]][GM.playerPos[1]].tags){
                        responseBody[status]=1;
                    }
                    else{

                    }
                }
                break;
            case 83:
                if (moveInDir(GM.maze,player,-1)){

                }

                break;
            case 32:
                flash(GM);
                break;
        }
    }
}

async function enemyAI(user,GM,enemy){//will have to use websockets or SSEs for this
    //player must still be playing the game
    if (GM.result==0 && (user in currentPlayers)){
        await utilFuncs.wait(1500);
        enemyAI(user,GM,enemy);
    }
}
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
async function startGame(user,maze,currentPlayers){
    let sTiles=getStarts(maze);
    let startPos=sTiles[Math.floor(Math.random()*sTiles.length)];
    let gm=new gameManager(maze,startPos);
    let hunter=new mazeHunter();
    currentPlayers[user]={Maze:maze,GameManager:gm,Enemy:[hunter]};
}
module.exports={startGame};