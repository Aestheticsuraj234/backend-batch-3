const EventEmiiter = require("events");


const emitter = new EventEmiiter()

// 1. on ( listner )
emitter.on("ON_LLM_CALL" , ()=>{
    console.log("Hello llm is calling🥸")
})

// 2. emit
setInterval(() => {
    emitter.emit("ON_LLM_CALL")
}, 3000);