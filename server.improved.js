const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  dir = "public/",
  port = 3000;

const appdata = [];

const suggestdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else {
    sendFile(response, filename);
  }
};
/**
 * Post request called thee places in client side - submit, remove, refresh
 * send response and/or request to function depending on request url
 */
const handlePost = function (request, response) {
  if (request.url === "/submit") {
    handleSubmit(request, response);
  } else if (request.url === "/refresh") {
    handleRefresh(response);
  } else if (request.url === "/remove") {
    handleRemove(request, response);
  } else if(request.url === "/suggest"){
    handleSuggest(request, response);
  } else if(request.url === "/bring"){
    handleBring(request, response);
  }
};
/**
 * recieves a string representing an object containing the name, item, and qty user entered
 * turns string back into an object
 * adds the object to the appdata array and sends the updata array to the client side
 */
const handleSubmit = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const dataObject = JSON.parse(dataString);
    const updatedObject = calculateDerived(dataObject);
    appdata.push(updatedObject);
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata
    };
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(bothArrays)); //send array back to client
  });
};

const calculateDerived = function (object) {
  if (object.price === "" || object.qty === "") {
    object.cost = "Cannot calculate total cost";
  } else {
    let totalCost = object.price * object.qty;
    object.cost = totalCost;
  }
  return object;
};

// sends the client the current data in the appdata array
const handleRefresh = function (response) {
  let bothArrays = {
    appdata: appdata,
    suggestdata: suggestdata
  };
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end(JSON.stringify(bothArrays));
};

/**
 * checks if the array index (dataString) is not 1
 * remove the element at specified index (dataString)
 * send client updated appdata array
 */
const handleRemove = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    appdata.splice(dataString, 1); // Remove the entry from the array
    console.log("Removed item at index: ", dataString);
    console.log("Updated appdata: ", appdata);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(appdata));
  });
};

const handleBring = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const newData = {name:"", item: suggestdata[dataString].Sitem, price: "",qty: suggestdata[dataString].Sqty};
    suggestdata.splice(dataString, 1); // Remove the entry from the array
    appdata.push(newData);
    console.log("index: ", dataString);
    console.log("Updated suggestdata: ", suggestdata);
    console.log("after bring, updated appdata: ", appdata);

    //send client both arrays -> make a new object, with both objects array inside (better way to do this??)
    let bothArrays = {
      appdata: appdata,
      suggestdata: suggestdata
    };
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(bothArrays));
  });
};

const handleSuggest = function(request, response){
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    //check if suggestion is already in array
    
    //if not - add to suggest array
    //send client suggestdata
    
    const suggestObject = JSON.parse(dataString);
    let repeat = 0;
    for(let i = 0; i < appdata.length; i++){
      if(appdata[i].item == suggestObject.Sitem){
        console.log("repeat", repeat);
        repeat++;
      }
    }
    if(repeat > 0){
      console.log("cannot add suggestion");
      return;
    }else{
      suggestdata.push(suggestObject);
    }
    //suggestdata.push(suggestObject);
    console.log("suggestdata after suggest: ", suggestdata)
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    response.end(JSON.stringify(suggestdata)); //send array back to client
  });
} 

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we"ve loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
