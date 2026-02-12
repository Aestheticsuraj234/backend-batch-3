import express from "express";
import 'dotenv/config';


const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Dockerized Node.js App!');
});

console.log(process.env.JWT_SECRET)

app.listen(process.env.PORT , ()=>{
    console.log("Server is running on port 3000")
})