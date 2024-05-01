//import * as WebSocket from "ws";
/*
        let socketURL='ws://'+window.location.hostname + ":"+PORT+"/"
        //console.log('ws://'+window.location.hostname + ":"+PORT+"/"+"token="+user);
        socket= new WebSocket('ws://'+window.location.hostname + ":"+PORT+"/");//+"token="+user
        //so with token, it ends up in app.get, else it ends up w/ ws
        //i guess bc the websocket listens for "/"
        socket.onopen = async() => {
            let msgObj={
                type:"Auth",
                data:user
            }
            console.log("HELLO");
            await socket.send(JSON.stringify(msgObj));
            socket.onmessage= (event) => {
                                // The 'data' property of the 'event' object contains the server's message
                                let serverMessage = JSON.parse(event.data);

                                if (serverMessage.type === 'authResponse') {
                                    // Handle the server's response to the auth request
                                    // For example, you might redirect to another page
                                    window.location.href = serverMessage.redirectUrl;
                                }
                            };
            const redirectUrl = response.url;
            window.location.href = redirectUrl;
        };
*/
/*
// Assume you have an endpoint on the server that provides the image dynamically
const imageUrl = '/get-image'; // Replace with your actual server endpoint

// Make an AJAX request to fetch the image data
const xhr = new XMLHttpRequest();
xhr.open('GET', imageUrl, true);
xhr.responseType = 'blob'; // Set the response type to blob (binary data)
xhr.onload = function () {
    if (xhr.status === 200) {
        const blob = xhr.response;
        const objectURL = URL.createObjectURL(blob);

        // Create an Image element
        const img = new Image();
        img.src = objectURL;

        // Wait for the image to load
        img.onload = function () {
            // Image is fully loaded, you can display it now
            document.getElementById('myImageDiv').appendChild(img);
        };

        // Optional: Handle image loading errors
        img.onerror = function () {
            console.error('Error loading image: ' + imageUrl);
        };
    } else {
        console.error('Error fetching image: ' + xhr.status);
    }
};

// Send the request
xhr.send();

*/
let imgRef=new Image();
let moveAudio=new Audio();
let flashAudio=new Audio();
let growlAudio=new Audio();

const PORT=4000;
let drawXSize=20;
let drawYSize=20;
let currentMaze=null;
let isPlaying=false;
const socket = new WebSocket('ws://'+window.location.hostname + ":"+PORT+"/");//conn fail
socket.onmessage=(event)=>{//used to tell player game over
    console.log('Received:', event.data);
    if (event.data.toLowerCase()=="game over"){
        //game over
        alert("YOU WERE CAUGHT!");
    }
    else if (event.data.toLowerCase()=="escaped"){
        alert("YOU ESCAPED!");
    }
};
socket.onclose=(event)=>{
    //lost connection, attempt to reconnect.
    //if connection failed
}
currentView=
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


async function loadImage(url) {
    return new Promise((resolve, reject) => {
        imgRef.onload = () => resolve(imgRef);
        imgRef.onerror = reject;
        imgRef.src = url;
    });
}
/*
    let view={
        valid:0,
        walls:[0,0,0,0,0,0],//0 if there is a wall to left,right,front (1 space);left,right,front (2 spaces)
        enemy:[],//an array of ints. each int represents an enemy. -1 means not visisble, 0 means same tile.
        //otherwise, 1 means visible to left, 2 means visible to right, 3-4 means visible in front
    }
*/

async function playMaze(){
    if (currentMaze!=null && !isPlaying){
        //block all other buttons until game is done
        isPlaying=true;
        var url="http://"+ window.location.hostname + ":"+PORT +'/playMaze';
            //http://localhost:5173/
        var jsonBody=JSON.stringify(currentMaze);

        const response = await fetch(url, {
            method:"POST",
            body:jsonBody
        })
        let results = await response.text();
        console.log(results);
        if (results=='OK'){
            let canvas=document.getElementById("mazeCanvas");
            let ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle="black";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            //send request to get img src
            url="http://"+ window.location.hostname + ":"+PORT +'/imgs/staticFilter.png';
            const getImgSource=await fetch(url,{
                method:"GET",
            });
            let blob=await getImgSource.blob();
            let imgURL = URL.createObjectURL(blob);
            await loadImage(imgURL);
        }
        else{
            isPlaying=false;
        }

    }
    else{
        alert("NO MAZE AVAILABLE TO PLAY");
    }
}
document.addEventListener("keydown", (event) => {
    var code=event.keyCode;
    action(code)
});
/*
the server should control how the game works i guess?
w/s: forward/backward movement
a/d: turn left/right
space bar: flash

*/
async function action(code){
    if (isPlaying){
        //send request to move to server
        console.log("HELLO ACTION");
        var url="http://"+ window.location.hostname + ":"+PORT +'/actionRequest';

        const response = await fetch(url, {
            method:"POST",
            body:code
        })
        let results = await response.text();
        let jsonResult=JSON.parse(results);
        /*
            let view={
                valid:0,
                walls:[0,0,0,0],//0 if there is a wall to left,right,front (1 space),front (2 spaces)
                enemy:[],//an array of ints. each int represents an enemy. -1 means not visisble, 0 means same tile.
                //otherwise, 1 means visible to left, 2 means visible to right, 3-4 means visible in front
            }
        */
        /*
    let responseBody={
        accepted:0,
        view:{},
        flashes:0,
        flashCharge:0,
    }
        */
        //also, needs to return # of flashes and stuff
        //modify canvas based on view if the player attempted to flash
        console.log(jsonResult);
        if (code==32 &&jsonResult.accepted==1 && jsonResult.view.valid){

            //let
            let canvas=document.getElementById("mazeCanvas");
            let ctx = canvas.getContext("2d");
            let view=jsonResult.view;
            ctx.clearRect(0, 0, canvas.width, canvas.height);


            ctx.globalAlpha = 1;

            //width="600" height="600"
            if (view.walls[0]==0){
                ctx.beginPath();
                ctx.moveTo(0,600);
                ctx.lineTo(130, 350);
                ctx.lineTo(130, 0);
                ctx.lineTo(0,150)
                ctx.lineTo(0, 600); // Close the path
                ctx.fillStyle = '#5C4C61'; // Set fill color
                ctx.fill(); // Fill the rhombus
                ctx.closePath();
            }

            if (view.walls[1]==0){
                ctx.beginPath();
                ctx.moveTo(600,600);
                ctx.lineTo(470, 350);
                ctx.lineTo(470, 0);
                ctx.lineTo(600,150)
                ctx.lineTo(600, 600); // Close the path
                ctx.fillStyle = '#5C4C61'; // Set fill color
                ctx.fill(); // Fill the rhombus
                ctx.closePath();
            }

            if (view.walls[2]==0){
                ctx.beginPath();
                ctx.moveTo(130, 350);
                ctx.lineTo(470, 350);
                ctx.lineTo(470, 0);
                ctx.lineTo(130,0);
                ctx.lineTo(130, 350); // Close the path
                ctx.fillStyle = '#5C4C61'; // Set fill color
                ctx.fill(); // Fill the rhombus
                ctx.closePath();
            }
            else{
                if (view.walls[3]==0){
                    ctx.beginPath();
                    ctx.moveTo(130,0);
                    ctx.lineTo(200, 0);
                    ctx.lineTo(200, 200);
                    ctx.lineTo(130,350)
                    ctx.lineTo(130, 0); // Close the path
                    ctx.fillStyle = '#5C4C61'; // Set fill color
                    ctx.fill(); // Fill the rhombus
                    ctx.closePath();
                }
                if (view.walls[4]==0){
                    ctx.beginPath();
                    ctx.moveTo(470,0);
                    ctx.lineTo(400, 0);
                    ctx.lineTo(400, 200);
                    ctx.lineTo(470,350)
                    ctx.lineTo(470, 0); // Close the path
                    ctx.fillStyle = '#5C4C61'; // Set fill color
                    ctx.fill(); // Fill the rhombus
                    ctx.closePath();
                }
                if (view.walls[5]==0){
                    ctx.beginPath();
                    ctx.moveTo(200, 0);
                    ctx.lineTo(400, 0);
                    ctx.lineTo(400, 200);
                    ctx.lineTo(200,200)
                    ctx.lineTo(200, 0); // Close the path
                    ctx.fillStyle = '#5C4C61'; // Set fill color
                    ctx.fill(); // Fill the rhombus
                    ctx.closePath();
                }
            }

            //draw enemies
            for (let i=0;i<view.enemy.length;i++){
                switch (view.enemy[i]){
                    case -1:{//cannot be seen
                        break;
                    }
                    case 0:{//same tile
                         break;
                    }
                    case 1:{//left
                        if (view.walls[0]==1){

                        }
                        break;
                    }
                    case 2:{//right
                        if (view.walls[1]==1){

                        }
                        break;
                    }
                    case 3:{//front
                        if (view.walls[2]==1){
                            const canvas = document.querySelector("canvas");
                            const ctx = canvas.getContext("2d");

                            ctx.beginPath();
                            ctx.arc(300, 130, 50, 0.15*Math.PI,0.85*Math.PI,true);
                            ctx.stroke();
                            ctx.fillStyle = '#000e41';
                            ctx.fill();
                            ctx.closePath();
                            ctx.beginPath();
                            ctx.moveTo(253, 150);
                            ctx.lineTo(347,150);
                            ctx.lineTo(300,220);
                            ctx.lineTo(253,150);
                            ctx.fillStyle = 'black';
                            ctx.fill();
                            ctx.closePath();
                            ctx.beginPath();
                            ctx.moveTo(253, 150);
                            ctx.lineTo(347,150);
                            ctx.lineTo(300,190);
                            ctx.lineTo(253,150);
                            ctx.fillStyle = '#000e41';
                            ctx.fill();
                            ctx.closePath();

                            ctx.beginPath();
                            ctx.arc(277, 120, 5, 1.15*Math.PI,2*Math.PI,true);
                            ctx.stroke();
                            ctx.fillStyle = 'white';
                            ctx.fill();
                            ctx.closePath();

                            ctx.beginPath();
                            ctx.arc(323, 120, 5, 1*Math.PI,1.85*Math.PI,true);
                            ctx.stroke();
                            ctx.fillStyle = 'white';
                            ctx.fill();
                            ctx.closePath();
                        }
                        break;
                    }
                    case 4:{//distant front
                        if (view.walls[5]==1){
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

ctx.beginPath();
ctx.arc(300, 70, 22, 0.15*Math.PI,0.85*Math.PI,true);
ctx.stroke();
ctx.fillStyle = '#000e41';
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(280, 80);
ctx.lineTo(320,80);
ctx.lineTo(300,110);
ctx.lineTo(280,80);
ctx.fillStyle = 'black';
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(280, 80);
ctx.lineTo(320,80);
ctx.lineTo(300,99);
ctx.lineTo(280,80);
ctx.fillStyle = '#000e41';
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(290, 65, 3, 1.15*Math.PI,2*Math.PI,true);
ctx.stroke();
ctx.fillStyle = 'white';
ctx.fill();
ctx.closePath();

ctx.beginPath();
ctx.arc(310, 65, 3,  1*Math.PI,1.85*Math.PI,true);
ctx.stroke();
ctx.fillStyle = 'white';
ctx.fill();
ctx.closePath();
                        }
                        break;
                    }
                }
            }

            ctx.globalAlpha = 0.2;
            ctx.drawImage(imgRef, 0, 0,600,600);
            if (alpha<1 && alpha>0){//a fadeout is currently in progress. reset its progress
                alpha=0;
            }
            else{//presumably a fadeout is not in progress.
                fadeOut();
            }


        }
        let fCount=jsonResult.flashes;
        let charges=jsonResult.flashCharge;
        //then, update ui for flashes/charges

    }
}
let alpha=0;
async function fadeOut(){
    const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw your existing elements here (e.g., images, text, shapes)
    // ...

    // Increase alpha for the next frame
    alpha += 1/210.0;
    if (alpha<1){
        requestAnimationFrame(() => fadeOut(alpha));
    }
    else{
        alpha=0;
    }
}

async function clearMaze(){
    if(!isPlaying){
        let canvas=document.getElementById("mazeCanvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        currentMaze=null;
    }
}

//const socket=new WebSocket("ws://"+ window.location.hostname + ":"+PORT)
async function makeMaze(){
    if(!isPlaying){
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
        await mapDrawer(currentMaze);

    }

}


async function saveMaze(){
    if (!isPlaying){
        var url="http://"+ window.location.hostname + ":"+PORT +'/saveMaze';
        if (currentMaze!=null){
            console.log("ATTEMPTINMG TO SAVE");
            var jsonBody=JSON.stringify(currentMaze);
            const response = await fetch(url, {
                method:"POST",
                body:jsonBody
            })
            let res=await response.text();
            alert(res);
        }
        else{
            alert("No maze to save!");
        }
    }

}


async function getSavedMazes(){
    if (!isPlaying){
        var url="http://"+ window.location.hostname + ":"+PORT +'/userMazes';
        let listButton=document.getElementById("listMazes");
        while (listButton.firstChild) {
          listButton.removeChild(listButton.lastChild);
        }
        //maybe put a cute loading image or smth while getting mazes, same for generating
        const response = await fetch(url, {
            method:"POST",
        })
        let data= await response.text();
        let jsonResult=JSON.parse(data);
        //{ID:doc.MazeID;XSize:doc.Maze.xSize;YSize:doc.Maze.ySize}
        for (let m of jsonResult){
            let savedMaze=document.createElement("li");
            savedMaze.textContent="ID: " + m.ID + ". Size:" + m.XSize + " by " + m.YSize;
            savedMaze.onclick=function(){
                loadMaze(m.ID);
            }
            listButton.append(savedMaze);
        }
    }
}

//the saved mazes should be separate from above
async function loadMaze(id){
    if(!isPlaying){
        var url="http://"+ window.location.hostname + ":"+PORT +'/loadMaze';
        const response = await fetch(url, {
            method:"POST",
            body:id
        })
        let data= await response.text();
        currentMaze=JSON.parse(data);
        console.log(currentMaze);
        await mapDrawer(currentMaze);
    }
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