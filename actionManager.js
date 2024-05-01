const classes=require('./mapClasses.js');//this should be sent to game and mazegen
const mazeGen=require('./mazeGen.js');
const dbManager=require('./dbManager.js');
const game=require('./game.js');
async function makeMaze(data){
    return await mazeGen.generate(data);
}
async function playerAct(player,req,responseBody){
    return await game.playerAction(player,req,responseBody);
}
async function startGame(user,maze,currentPlayers){
    return await game.startGame(user,maze,currentPlayers);
}





async function makeSavedMaze(user,body){
    return await dbManager.makeSavedMaze(user,body)

}


async function findUser(userDetails){
    return await dbManager.findUser(userDetails);
}
async function addUser(userDetails){
    return await dbManager.addUser(userDetails);
}
async function getMazes(nameObj){
    return await dbManager.getMazes(nameObj);
}
async function addMaze(nameObj,receivedMaze){
    return await dbManager.addMaze(nameObj,receivedMaze);
}

module.exports= {playerAct,makeMaze,startGame,makeSavedMaze,findUser,addUser,getMazes,addMaze};