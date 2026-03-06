import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problems.routes.js";


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/problems" , problemRoutes)

app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})