import 'dotenv/config';

export const config = {
    port:Number(process.env.PORT) || 4000,
    redisUrl:process.env.REDIS_URL || "",
    queueName:"email-queue",
    batchEmailsTtlSeconds:3600,
    minInsertChunk:100,
    maxInsertChunk:2000,
}