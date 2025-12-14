const EventEmitter = require("events");

const emitter = new EventEmitter();

// .on
emitter.on("GREET" , ()=>{
    console.log("Hello World");
})

// .emit

emitter.emit("GREET")