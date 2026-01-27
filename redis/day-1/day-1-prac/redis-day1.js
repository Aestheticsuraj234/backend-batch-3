import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config()

const redis = new Redis({
    url:process.env.UPSTASH_REDIS_REST_URL,
    token:process.env.UPSTASH_REDIS_REST_TOKEN
})

async function main() {
    console.log("Connected to Redis");

     /**
   * ===========================
   * 1. REDIS STRING
   * ===========================
   */
//   await redis.set("username" , "suraj");
//   await redis.set("username" , "karan")

//   const username = await redis.get("username");

//   console.log("Username" , username)

//   await redis.set("otp" , "123234" , {
//     ex:60
//   })

//   console.log("Otp set with ttl")


  
  /**
   * ===========================
   * 2. REDIS QUEUE (FIFO)
   * ===========================
   */

  await redis.rpush("emailQueue" , "user1@gmail.com");
  await redis.rpush("emailQueue" ,"user2@gmail.com" );

  const emailJob = await redis.lpop("emailQueue");
  console.log("Processing email job:" , emailJob);


  
  /**
   * ===========================
   * 3. REDIS STACK (LIFO)
   * ===========================
   */

  await redis.lpush("undoStack" , "ACTION_1");
  await redis.lpush("undoStack" , "ACTION_2");

  const lastAction = await redis.lpop("undoStack");

  console.log("Undo Last action:" , lastAction)
}

main()