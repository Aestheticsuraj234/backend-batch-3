import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 4000,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  queueName: 'email-queue',
  batchSize: 50,
  minInsertChunk: 100,
  maxInsertChunk: 2000,
  batchEmailsTtlSeconds: 3600,
};
