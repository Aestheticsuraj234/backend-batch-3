const fs = require("node:fs");

console.log("Hello from top level code");


setTimeout(()=>console.log("Hello from timer-1") , 0);

setImmediate(()=>console.log("Hello from setImmediate"));

fs.readFile("./notes.md" , "utf-8" , () => console.log("IO polling"));

console.log("Hello from top level code -2 ")

