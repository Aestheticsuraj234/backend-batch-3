import express from "express";
import axios from "axios";
import Redis from "ioredis";

const app = express();
app.use(express.json());

/**
 * =========================================
 * Redis Client
 * =========================================
 */
const redis = new Redis(process.env.REDIS_URL);
// local redis (optional)
// const redis = new Redis();

/**
 * =========================================
 * EXERCISE 1: RATE LIMITER
 * 10 requests / minute / user
 * =========================================
 */
const rateLimiter = async (req, res, next) => {
  const userId = req.headers["user-id"] || "anonymous";
  const key = `rate:${userId}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 10) {
    return res.status(429).json({
      message: "Too many requests. Try again later.",
    });
  }

  next();
};

app.get("/rate-limited-api", rateLimiter, (req, res) => {
  res.json({ message: "Request allowed" });
});

/**
 * =========================================
 * EXERCISE 2: CACHE LAYER (5 min)
 * =========================================
 */
app.get("/posts", async (req, res) => {
  const cacheKey = "posts_cache";

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      source: "cache",
      data: JSON.parse(cached),
    });
  }

  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );

  await redis.set(
    cacheKey,
    JSON.stringify(response.data),
    "EX",
    300 // 5 minutes
  );

  res.json({
    source: "api",
    data: response.data,
  });
});

/**
 * =========================================
 * EXERCISE 3: JOB QUEUE (FIFO)
 * =========================================
 */

// Add job
app.post("/jobs", async (req, res) => {
  const { job } = req.body;

  await redis.rpush("job_queue", JSON.stringify(job));

  res.json({ message: "Job added to queue" });
});

// Process job
app.post("/jobs/process", async (req, res) => {
  const job = await redis.lpop("job_queue");

  if (!job) {
    return res.json({ message: "No jobs in queue" });
  }

  const parsedJob = JSON.parse(job);

  // simulate processing
  console.log("Processing job:", parsedJob);

  res.json({
    message: "Job processed",
    job: parsedJob,
  });
});

/**
 * =========================================
 * EXERCISE 4: BROWSER HISTORY
 * Stack-based (Back / Forward)
 * =========================================
 */

/**
 * Visit page
 */
app.post("/history/visit", async (req, res) => {
  const { user, page } = req.body;

  await redis.lpush(`history:${user}:back`, page);
  await redis.del(`history:${user}:forward`);

  res.json({
    message: "Visited page",
    page,
  });
});

/**
 * Go back
 */
app.post("/history/back", async (req, res) => {
  const { user } = req.body;

  const current = await redis.lpop(`history:${user}:back`);
  if (!current) {
    return res.json({ message: "No history available" });
  }

  await redis.lpush(`history:${user}:forward`, current);

  const previous = await redis.lindex(`history:${user}:back`, 0);

  res.json({
    current: previous || null,
  });
});

/**
 * Go forward
 */
app.post("/history/forward", async (req, res) => {
  const { user } = req.body;

  const page = await redis.lpop(`history:${user}:forward`);
  if (!page) {
    return res.json({ message: "No forward history" });
  }

  await redis.lpush(`history:${user}:back`, page);

  res.json({
    current: page,
  });
});

/**
 * =========================================
 * Server
 * =========================================
 */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
