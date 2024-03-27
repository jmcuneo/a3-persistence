const http = require("http"),
  fs = require("fs"),
  mime = require('mime'),
  ivm = require('isolated-vm'),
  dir = "public/",
  port = 3000,
  VarName = require('is-var-name');

const equations = []

function removeNameFromEquations(name) {
  var i = equations.length;
  while (i--) {
    if (equations[i].name == name) {
      equations.splice(i, 1);
    }
  }
}

// make sure avrible name is good
// returns noname# if not
function ensureVarName(name) {
  const bad = Array.from("=; \n\r");
  if (!bad.some(c=>name.includes(c))&&VarName(name)) {
    removeNameFromEquations(name)
    return name
  }
  var index = 1;
  while (true) {
    name = 'noname' + index
    if (equations.some(e => e.name == name)) {
      index++;
    } else {
      return name
    }
  }
}

var setupCode = "Object.keys($0).map(key=>this[key]=$0[key]);var ret = eval($1); return [ret,ret.toString()];";

// evalute and store varible
function evaluate(name, code) {
  return new Promise((resolve, reject) => {

    // delete varible
    if (code == "") {
      if (name != "")
        removeNameFromEquations(name)
      resolve()
    } else {

      var iso = new ivm.Isolate()
      name = ensureVarName(name);

      let vars = equations.reduce((a, e) => (a[e.name] = e.result, a), {});

      // run code in isolation *hopefully*
      iso.createContextSync().evalClosure(setupCode, [vars, code],
        { timeout: 5000, arguments: { copy: true }, result: { copy: true } }).then(result => {
          equations.push({ name, code, result: result[0], str: result[1] })
          resolve()
        }).catch((err) => {
          // probably can escape be throwing error with custom tostring - TODO
          equations.push({ name, code, result: err, str: err.toString() })
          resolve()
        })
    }
  });
}

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response)
  } else if (request.method === "POST") {
    handlePost(request, response)
  }
})

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1)

  if (request.url === "/") {
    sendFile(response, "public/index.html")
  } else {
    sendFile(response, filename)
  }
}

const handlePost = function (request, response) {
  let dataString = ""

  request.on("data", function (data) {
    dataString += data
  })

  request.on("end", function () {
    try {
      data = JSON.parse(dataString);

      evaluate(data.name ?? "", data.code ?? "").then(() => {
        response.writeHead(200, "OK", { "Content-Type": "application/json" });
        response.end(JSON.stringify(equations.map(e => ({ name: e.name, code: e.code, str: e.str }))));
      }).catch(e => {
        response.writeHeader(404);
        response.end("script failed to run");
      });
    } catch (e) {
      response.writeHeader(404);
      response.end("oh noes");
    }
  });
}

const sendFile = function (response, filename) {
  const type = mime.getType(filename)

  fs.readFile(filename, function (err, content) {

    // if the error = null, then we"ve loaded the file successfully
    if (err === null) {

      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type })
      response.end(content)

    } else {

      // file not found, error code 404
      response.writeHeader(404)
      response.end("404 Error: File Not Found")

    }
  })
}

server.listen(process.env.PORT || port)
