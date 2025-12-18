import express from "express";

const app = express();

app.use(express.json())

// get , post , put , patch , delete

app.get("/:id" , (req , res)=>{
    // const {id} = req.params
    // const {name , age , lang} = req.query
    console.log({
        params:req.params,
        query:req.query,
    });

    // 1. req.params
    // 2. req.query
    // 3. req.body
    // 4. req.headers

    res.send("<h1 style='color:red'>Hello world</h1>")
})

app.post("/create" , (req , res)=>{
    const {username} = req.body;

    console.log(req.headers)

    res.json({
        message:"Hello from create endpoint",
        data:username
    })
})

app.listen(3000 , ()=>{
    console.log("Server is up and running🐇")
})