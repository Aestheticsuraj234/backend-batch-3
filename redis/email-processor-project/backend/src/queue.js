import { redis } from "./redis.js";
import { config } from "./config.js";


const QUEUE_KEY = config.queueName;


export async function addBatchToQueue(batchId) {
    await redis.lpush(QUEUE_KEY , batchId)
}

export async function takeNextBatchFromQueue() {
    const result = await redis.brpop(QUEUE_KEY , 0);
    if(!result) return null;
    const [,batchId] = result;

    return batchId
}