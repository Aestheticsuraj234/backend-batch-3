import express from "express";

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Dockerized Node.js App!');
});


app.listen(3000 , ()=>{
    console.log("Server is running on port 3000")
})