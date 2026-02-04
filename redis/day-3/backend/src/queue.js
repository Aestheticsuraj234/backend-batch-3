import { redis } from './redis.js';
import { config } from './config.js';

// Redis list key: we push job IDs here, worker pops from the other end
const QUEUE_KEY = config.queueName;

/**
 * Add a batch to the queue. Worker will pick it up and process the emails.
 */
export async function addBatchToQueue(batchId) {
  await redis.lpush(QUEUE_KEY, batchId);
}

/**
 * Take one batch ID from the queue. Waits (blocks) until a job is available.
 * Returns the batchId string, or null if something went wrong.
 */
export async function takeNextBatchFromQueue() {
  const result = await redis.brpop(QUEUE_KEY, 0);
  if (!result) return null;
  const [, batchId] = result;
  return batchId;
}
