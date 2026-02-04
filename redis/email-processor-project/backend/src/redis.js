import Redis from "ioredis";
import { config } from "./config.js";

export const redis = new Redis(config.redisUrl);
export const subscriber = new Redis(config.redisUrl)

const BATCH_EMAILS_PREFIX = "batch:emails:";
export const CHANNEL_PREFIX = "batch:status:";

export function publishBatchStatus(batchId , payload){
    return redis.publish(
        CHANNEL_PREFIX + batchId,
        JSON.stringify(payload)
    )
}


export function setBatchEmails(batchId , emails){
    const key = BATCH_EMAILS_PREFIX + batchId;
    return redis.set(key , JSON.stringify(emails) , "EX" ,config.batchEmailsTtlSeconds )
}

export async function getBatchEmails(batchId) {
  const key = BATCH_EMAILS_PREFIX + batchId;
  const raw = await redis.get(key);
  return raw ? JSON.parse(raw) : null;
}

export function deleteBatchEmails(batchId) {
  return redis.del(BATCH_EMAILS_PREFIX + batchId);
}
