import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
import express from "express";
import axios from "axios";
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const app = express();

app.use(express.json());


/**
 * =========================================
 * EXERCISE 1: RATE LIMITER
 * 10 requests / minute / user
 * =========================================
 */

const rateLimiter = async(req , res , next)=>{
  const userId = req.headers['user-id'] || "anonymous"

  const key = `rate:${userId}`

  const count = await redis.incr(key);
  console.log(count)

  if(count === 1){
    await redis.expire(key , 60)
  }

  if(count > 10){
    return res.status(429).json({
      message:"Too many request. Try again later"
    })
  }

  next()
}

app.get("/rate-limited-api" , rateLimiter , (req , res)=>{
  res.json({message:"Request Allowed"})
})

app.get("/posts", async (req, res) => {
  const cacheKey = "posts_cache";

  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json({
      source: "cache",
      data: cached,
    });
  }

  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/posts"
  );

  await redis.set(
    cacheKey,
    JSON.stringify(response.data),
  {
    ex:300
  }
  );

  res.json({
    source: "api",
    data: response.data,
  });
});









app.get("/" , (req , res)=>{
  res.send("Hello world")
})

app.listen(3000, () => {
  console.log("SERVER IS RUNNING ON http://localhost:3000");
});
