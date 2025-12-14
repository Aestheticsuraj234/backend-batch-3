const http = require("node:http");
const fs = require("node:fs");

const myServer = http.createServer((request, response) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${request.method} from ${request.url}\n`;

  fs.appendFile("./logs.log", logEntry, (err) => {
    if (err) console.log(err);
  });

  if (request.url === "/logs") {
    fs.readFile("./logs.log", "utf-8", (err, data) => {
      console.log(err);
      response.end(data);
    });
  }else{
    response.end("Hello")
  }
});

myServer.listen(8080, () => {
  console.log(`Server is running on port http://localhost:8080`);
});
