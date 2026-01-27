import { Redis } from "@upstash/redis";

/**
 * Redis Client
 */
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

async function main() {
  console.log("Connected to Redis");

  /**
   * ===========================
   * 1. REDIS STRING
   * ===========================
   */
  await redis.set("username", "codesnippet");

  const username = await redis.get("username");
  console.log("Username:", username);

  await redis.set("otp", "123456", { ex: 60 });
  console.log("OTP set with TTL");

  /**
   * ===========================
   * 2. REDIS QUEUE (FIFO)
   * ===========================
   */
  await redis.rpush("emailQueue", "user1@gmail.com");
  await redis.rpush("emailQueue", "user2@gmail.com");

  const emailJob = await redis.lpop("emailQueue");
  console.log("Processing email job:", emailJob);

  /**
   * ===========================
   * 3. REDIS STACK (LIFO)
   * ===========================
   */
  await redis.lpush("undoStack", "ACTION_1");
  await redis.lpush("undoStack", "ACTION_2");

  const lastAction = await redis.lpop("undoStack");
  console.log("Undo last action:", lastAction);

  /**
   * ===========================
   * 4. SIMPLE RATE LIMIT LOGIC
   * ===========================
   */
  const userId = "user123";
  const rateKey = `rate:${userId}`;

  const count = await redis.incr(rateKey);
  if (count === 1) {
    await redis.expire(rateKey, 60);
  }

  console.log(`Requests in last minute: ${count}`);
}

main()
  .then(() => {
    console.log("Redis demo completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
