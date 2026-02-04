import { config } from "./config.js";
import { prisma } from "./db.js";
import { takeNextBatchFromQueue } from "./queue.js";
import { deleteBatchEmails, getBatchEmails, publishBatchStatus } from "./redis.js";


function calculateInsertChunkSize(totalEmails) {
  const tenPercent = Math.ceil(totalEmails * 0.1);
  return Math.max(config.minInsertChunk, Math.min(config.maxInsertChunk, tenPercent));
}



async function processOneBatch(batchId){
    const emails = await getBatchEmails(batchId);

     if (!emails || !Array.isArray(emails) || emails.length === 0) {
    throw new Error('Batch email list missing or empty (expired or not stored)');
  }

  const total = emails.length;
  const chunkSize = calculateInsertChunkSize(total);
  const inserted = 0;

  await prisma.batch.update({
    where:{id:batchId},
    data:{status:"inserting"}
  })
    await publishBatchStatus(batchId, {
    batchId,
    status: 'inserting',
    total,
    inserted: 0,
  });

  for(let i = 0; i < emails.length; i +=chunkSize){
    const chunk = emails.slice(i , i+chunkSize);

    await prisma.email.createMany({
        data:chunk.map((email)=>({batchId , email}))
    });
    inserted +=chunk.length;


    await prisma.batch.update({
        where:{id:batchId},
        data:{
           insertedCount:inserted 
        }
    });

    await publishBatchStatus(batchId, {
      batchId,
      status: 'inserting',
      total,
      inserted,
    });

  }

  await deleteBatchEmails(batchId)
   await prisma.batch.update({
        where:{id:batchId},
        data:{
           status:"completed",
           completedAt:new Date()
        }
    });

     await publishBatchStatus(batchId, {
      batchId,
      status: 'completed',
      total,
      inserted,
    });

}


async function runWorker() {
 console.log('Worker started. Waiting for jobs in Redis queue...');
  console.log(`Using Redis queue: "${config.queueName}"`);

  while (true){
    // BRPOP: Blocks until a batch Id is available
    const batchId = await takeNextBatchFromQueue();

    if(!batchId) continue;

    console.log(`\n Picked up batch: ${batchId}`);

    try {
        await processOneBatch(batchId)
    } catch (error) {
        console.error(`Batch ${batchId} failed:` , error.message)
        await prisma.batch.update({
            where:{id:batchId},
            data:{status:"failed"}
        })
        await publishBatchStatus(batchId, { batchId, status: 'failed' }).catch(console.error);
    }
  }
}

runWorker();