const http = require("http"),
  port = 3000


const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response)
  }
})

const handleGet = function (request, response) {
  response.writeHead(302, {
    'Location': 'http://game.gamestream.stream:3000'
  });
  response.end();
}

server.listen(process.env.PORT || port)
