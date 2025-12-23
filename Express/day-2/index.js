import express from "express";
import userRouter from "./user.routes.js";

const app = express();

function logger(req, res, next) {
    console.log(req.method, req.path);
    next();
   
}

// app.use(logger);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/about" , logger , (req , res)=>{

})

app.use("/api/v1/user" , userRouter)

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});