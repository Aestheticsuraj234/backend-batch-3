const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { EMAIL_QUEUE } = require("../queues/email.queue");
const sendEmail = require("../services/email.service");

const worker = new Worker(
  EMAIL_QUEUE,
  async (job) => {
    console.log("Processing Job", job.id);

    await sendEmail(job.data);
  },
  { connection },
);


worker.on("completed" , (job)=>{
    console.log(`Job ${job.id} completed ✅`)
})


worker.on("failed" , (job , err)=>{
    console.log(`Job ${job.id} Failed ❌` , err.message)
})