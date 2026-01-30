import express from "express";
import dotenv from "dotenv";

import Redis from "ioredis";

dotenv.config();
const redis = new Redis(process.env.REDIS_SERVER_URL);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//* # SET

app.get("/online/:user", async(req, res) => {
    await redis.sadd("online_users" , req.params.user);
    res.json({message:"User is online"})
});


app.get("/online", async(req, res) => {
    const users = await redis.smembers("online_users");
    res.json(users)
});

app.post("/score" , async(req , res)=>{
    const {user , score} = req.body;

    await redis.zadd("leaderboard" , score , user);
    res.json({ message: "Score updated" });
})

app.get("/leaderboard" , async(req , res)=>{

    const topUsers = await redis.zrevrange(
        "leaderboard",
        0,
        2,
        "WITHSCORES"
    )
  
    res.json(topUsers);
})


app.post("/order" , async(req , res)=>{
    const {orderId , user , amount} = req.body;

    await redis.xadd("orders_stream" , "*" , "orderId" , orderId , "user" , user , "amount" , amount);

    res.json({ message: "Order event added" });
})

app.get("/orders" , async(req , res)=>{
    const events = await redis.xrange(
        "orders_stream",
        "-",
        "+"
    );

    res.json(events)
})

app.get("/orders/count", async (req, res) => {
  const count = await redis.xlen("orders_stream");
  res.json({ totalEvents: count });
});


app.post("/user" , async(req , res)=>{
    const {id , name , email , age} = req.body;

    await redis.hset(`user:${id}` , {
        name,
        email,
        age
    })

    
  res.json({ message: "User saved" });
})

app.get("/user/:id", async (req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}`);
  res.json(user);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
