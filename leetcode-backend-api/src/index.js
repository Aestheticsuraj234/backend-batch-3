import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problems.routes.js";
import cors from "cors";
import executeCodeRoutes from "./routes/executeCode.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/problems" , problemRoutes)
app.use("/api/v1/execute-code" , executeCodeRoutes)

app.get("/" , (req , res)=>{
    res.send("Hello")
})
// Start the server
app.listen(8080, () => {
    console.log(`Server is running on port http://localhost:8080`);
});