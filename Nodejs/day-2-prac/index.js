const fs = require("node:fs");

console.log("Hello world from top level"); //1

setTimeout(() => {
    console.log("Hello from timer-1");
}, 0); //3

// assingment
setImmediate(()=>console.log("Hello from setImmediate")); // 4

fs.readFile("./sample.txt" , "utf-8" , ()=>console.log("IO polling"));

console.log("Hello world from top level -2"); //2

