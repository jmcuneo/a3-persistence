const dbName = 'mazeMakerDB';
async function findUser(client,userData) {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);
  const userCollection=await db.collection( "MazeUsers");
    const result=await userCollection.countDocuments(userData);
    if (result>0){
        return true;
    }
    else{
        return false;
    }
}


async function addUser(client,userData) {
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


async function addMaze(client,userData,maze){
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


async function getMazes(client,userData){
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




async function getMazeMap(client,userData){
    await client.connect();
    const db = client.db(dbName);
    const userCollection=await db.collection( "Mazes");
    let mazesToReturn=[];
    const result=await userCollection.find(userData);
    for await (const doc of result) {
        mazesToReturn.push({Maze:doc.Maze});
    }
    return mazesToReturn;
}

async function makeSavedMaze(client,user,mazeID){
    let nameObj={
        "Username":user,
        "MazeID":Number(mazeID)
    }
    let result= await getMazeMap(client,nameObj);
    if (result.length==1){
        return result[0].Maze;
    }
    else{
        //err
        return 404;
    }
}

module.exports={findUser,addUser,addMaze,getMazes,makeSavedMaze};