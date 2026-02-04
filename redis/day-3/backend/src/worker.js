import { config } from './config.js';
import { takeNextBatchFromQueue } from './queue.js';
import { prisma } from './db.js';
import { publishBatchStatus, getBatchEmails, deleteBatchEmails } from './redis.js';

/**
 * Calculate chunk size as 10% of total (clamped to min/max)
 */
function calculateInsertChunkSize(totalEmails) {
  const tenPercent = Math.ceil(totalEmails * 0.1);
  return Math.max(config.minInsertChunk, Math.min(config.maxInsertChunk, tenPercent));
}

/**
 * Process one batch: insert all emails into DB in chunks
 */
async function processOneBatch(batchId) {
  // 1. Get emails from Redis
  const emails = await getBatchEmails(batchId);
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    throw new Error('Batch email list missing or empty (expired or not stored)');
  }

  const total = emails.length;
  const chunkSize = calculateInsertChunkSize(total);
  let inserted = 0;

  // 2. Update status to "inserting"
  await prisma.batch.update({
    where: { id: batchId },
    data: { status: 'inserting' },
  });
  await publishBatchStatus(batchId, {
    batchId,
    status: 'inserting',
    total,
    inserted: 0,
  });

  console.log(`Batch ${batchId}: inserting ${total} emails in chunks of ${chunkSize}...`);

  // 3. Insert emails in chunks
  for (let i = 0; i < emails.length; i += chunkSize) {
    const chunk = emails.slice(i, i + chunkSize);
    await prisma.email.createMany({
      data: chunk.map((email) => ({ batchId, email })),
    });
    inserted += chunk.length;

    // Update progress in DB and publish to Redis Pub/Sub
    await prisma.batch.update({
      where: { id: batchId },
      data: { insertedCount: inserted },
    });
    await publishBatchStatus(batchId, {
      batchId,
      status: 'inserting',
      total,
      inserted,
    });

    console.log(`  Inserted ${inserted} / ${total}`);
  }

  // 4. Clean up Redis and mark as completed
  await deleteBatchEmails(batchId);

  await prisma.batch.update({
    where: { id: batchId },
    data: { status: 'completed', completedAt: new Date() },
  });
  await publishBatchStatus(batchId, {
    batchId,
    status: 'completed',
    total,
    inserted,
  });

  console.log(`Batch ${batchId}: completed (${inserted} emails inserted)`);
}

/**
 * Worker loop: wait for jobs from Redis queue, process each batch
 */
async function runWorker() {
  console.log('Worker started. Waiting for jobs in Redis queue...');
  console.log(`Using Redis queue: "${config.queueName}"`);

  while (true) {
    // BRPOP: blocks until a batch ID is available
    const batchId = await takeNextBatchFromQueue();
    if (!batchId) continue;

    console.log(`\nPicked up batch: ${batchId}`);

    try {
      await processOneBatch(batchId);
    } catch (err) {
      console.error(`Batch ${batchId} failed:`, err.message);
      await prisma.batch
        .update({
          where: { id: batchId },
          data: { status: 'failed' },
        }) 
        .catch(console.error);
      await publishBatchStatus(batchId, { batchId, status: 'failed' }).catch(console.error);
    }
  }
}

runWorker();
