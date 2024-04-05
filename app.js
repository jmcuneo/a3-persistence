const PORT=4000;
let drawXSize=20;
let drawYSize=20;
let currentMaze=null;
class genParams{
    xSize;
    ySize;
    exitCount;
    constructor(x,y,eCnt){
        this.xSize=x;
        this.ySize=y;
        this.exitCount=eCnt;
    }
}

//const socket=new WebSocket("ws://"+ window.location.hostname + ":"+PORT)
async function makeMaze(){
    var url="http://"+ window.location.hostname + ":"+PORT +'/generateMaze';
    //http://localhost:5173/
    var params=new genParams(document.getElementById("Maze X Size").value,document.getElementById("Maze Y Size").value,document.getElementById("Amount of Exits").value);
    var jsonBody=JSON.stringify(params);

    const response = await fetch(url, {
        method:"POST",
        body:jsonBody
    })
    let results = await response.text();
    currentMaze=JSON.parse(results);
    console.log(currentMaze);
    await mapDrawer(currentMaze);
}
async function saveMaze(){
    var url="http://"+ window.location.hostname + ":"+PORT +'/saveMaze';
    //http://localhost:5173/

    if (currentMaze!=null){
        console.log("ATTEMPTINMG TO SAVE");
        var jsonBody=JSON.stringify(currentMaze);
        const response = await fetch(url, {
            method:"POST",
            body:jsonBody
        })
        let res=await response.text();
        console.log("Done");
        alert(res);
    }
    else{
    console.log("nothing to save");
        alert("No maze to save!");
    }
}
async function getSavedMazes(){
 var url="http://"+ window.location.hostname + ":"+PORT +'/userMazes';
    let listButton=document.getElementById("listMazes");
    while (listButton.firstChild) {
      listButton.removeChild(listButton.lastChild);
    }
    listButton.textContent = "Get Saved Mazes";
    var obj={
        Username:"USER",
        Password:"Password"
    }
    var jsonBody=JSON.stringify(jsonBody);
    const response = await fetch(url, {
        method:"POST",
        body:jsonBody
    })
    let data= await response.text();
    let jsonResult=JSON.parse(data);
    //get saved mazes
    //{ID:doc.MazeID;XSize:doc.Maze.xSize;YSize:doc.Maze.ySize}
    console.log("WILL START LISTING MAZES");
    for (let m of jsonResult){
        console.log("MAZE ID " + m.ID);
        let savedMaze=document.createElement("li");
        savedMaze.textContent="ID: " + m.ID + ". Size:" + m.XSize + " by " + m.YSize;
        listButton.append(savedMaze);
    }
}

async function loadMaze(){

}
async function mapDrawer(maze){
    let tilesToDraw=maze.tiles;
    let canvas=document.getElementById("mazeCanvas");
    let ctxBG = canvas.getContext("2d");
    let detachedCanvas=canvas.cloneNode();
    let ctx=detachedCanvas.getContext("2d")
    ctxBG.fillStyle = "purple";
    ctxBG.fillRect(0,0,canvas.width,canvas.height);
    ctxBG.fillStyle = "black";
    ctxBG.fillRect(0,0,maze.xSize*drawXSize,maze.ySize*drawYSize);
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";

    for(let y=0;y<maze.ySize;y++){
        for(let x=0;x<maze.xSize;x++){
            ctx.beginPath();
            ctx.fillStyle = "white";
            let ourTile=maze.tiles[x][y];

            if (ourTile.type==2){
                console.log("TILE "+x+","+y+" is path");

                if (ourTile.tags.includes("EXIT")){
                    ctx.fillStyle="red";
                }
                else if(ourTile.tags.includes("START")){
                    ctx.fillStyle="green";
                }
                ctx.fillRect(x*drawXSize+1,y*drawYSize+1,drawXSize-2,drawYSize-2);//upper left corner is x,y
                //draw the walls
                for(let w=0;w<4;w++){
                    if (ourTile.walls[w]==1){
                        ctx.beginPath();

                        let startX=0;
                        let startY=0;
                        let endX=0;
                        let endY=0;
                        if (w<2){
                            startX=x*drawXSize;
                            endX=startX+drawXSize;
                            if (w%2==0){
                                startY=y*drawYSize;
                                endY=startY;
                            }
                            else{
                                startY=(y+1)*drawYSize;
                                endY=startY;
                            }
                        }
                        else{
                            startY=y*drawYSize;
                            endY=startY+drawYSize;
                            if (w%2==0){
                                startX=x*drawXSize;
                                endX=startX;
                            }
                            else{
                                startX=(x+1)*drawXSize;
                                endX=startX;
                            }
                        }
                        /*
                            ctx.moveTo(75, 50);
                            ctx.lineTo(100, 75);
                        */
                        //console.log(ctx.strokeStyle);
                        console.log("DRAWING opening FROM " + startX+","+startY+" TO " + endX+","+endY);
                        ctx.moveTo(startX,startY);
                        ctx.lineTo(endX,endY);
                        ctx.stroke();

                    }
                }
            }
        }
    }
    ctxBG.globalAlpha=1;
    ctxBG.drawImage(detachedCanvas,0,0);

}