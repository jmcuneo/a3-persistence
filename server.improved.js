const http = require( "http" );
const fs = require( "fs" );
const mime = require("mime");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const EDIT_DELAY = 1000 * 60; // 60 second delay before editing again



app.use(express.static(__dirname + "/public"));

app.get("/read-grid", (_req, res) => {
    res.status(200).send(JSON.stringify({colors: colors, recent: recentList }));
});

app.post("/submit", (req, res) => {
    let dataString = "";
  
    req.on( "data", function( data ) {
        dataString += data 
    });
  
    req.on( "end", function() {
      const userData = JSON.parse(dataString);
  
      if(!userData.color.match("^#[0-9a-f]{6}$") || userData.name === "" || userData.name.match("^\\s+$") || userData.x < 0 || userData.x >= 10 || userData.y < 0 || userData.y >= 10) {
        response.status(200).send(JSON.stringify({ result: "invalid"}));
        return;
      }
  
      cleanCountdown(); // Ensures that only values are ones that cannot edit
      const search = countdown.find(u => u.name === userData.name);
      const readTime = new Date();
      if(search) {
        res.status(200).send(JSON.stringify({ result: "deny", extra: EDIT_DELAY - (readTime.getTime() - search.lastSubmitted.getTime()) }));
        return;
      }
  
      const coord = { x: userData.x, y: userData.y };
  
      countdown.push({ name: userData.name, lastSubmitted: readTime });
      recentList.push({ name: userData.name, lastSubmitted: readTime, color: userData.color, coord: coord });
      while(recentList.length > 20) {
        recentList.shift();
      }
  
      colors[coord.x * 10 + coord.y] = userData.color;
  
      res.status(200).send(JSON.stringify({ result: "accept"}));
    });
});

function cleanCountdown() {
  const readTime = new Date();
  for(let i = countdown.length - 1; i >= 0; i--) {
    if(readTime.getTime() - countdown[i].lastSubmitted.getTime() >= EDIT_DELAY) {
      countdown.splice(i);
    }
  }
}

function clearDatabase() {
    //Set all to white, remove all users & history, add generic admin account
}

app.listen( process.env.PORT || port );