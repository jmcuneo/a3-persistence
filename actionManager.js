
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


async function makeSavedMaze(client,user,body){
    return await dbManager.makeSavedMaze(client,user,body)

}
async function findUser(client,userDetails){
    return await dbManager.findUser(client,userDetails);
}

async function addUser(client,userDetails){
    return await dbManager.addUser(client,userDetails);
}
async function getMazes(client,nameObj){
    return await dbManager.getMazes(client,nameObj);
}
async function addMaze(client,nameObj,receivedMaze){
    return await dbManager.addMaze(client,nameObj,receivedMaze);
}

module.exports= {playerAct,makeMaze,startGame,makeSavedMaze,findUser,addUser,getMazes,addMaze};