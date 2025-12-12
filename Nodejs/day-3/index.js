const http = require("http");


const myServer = http.createServer((req , res)=>{
    console.log("New Req Received");
console.log(req)
    res.end("Hello World");
});

myServer.listen(3000 , ()=>{
    console.log("Server is listening on port 3000");
});