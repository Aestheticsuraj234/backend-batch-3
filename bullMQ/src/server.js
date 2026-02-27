require("dotenv").config();
const express = require("express");
const {emailQueue} = require("../queues/email.queue")

const app = express();

app.use(express.json());

app.post("/send-email" , async(req , res)=>{
    const {to} = req.body;

    const job = await emailQueue.add("sendEmailJob",{
        to,
    });

    res.json({
        message:"Email Job added to queue",
        jobId:job.id
    })
})

app.listen(3000 , ()=>{
    console.log("Server running on port 3000")
})