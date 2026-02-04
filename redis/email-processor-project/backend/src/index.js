import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { registerUploadRoutes } from "./routes/upload.js";
import { registerBatchRoutes } from "./routes/batch.js";
import path from "path";
import { fileURLToPath } from "url";


const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname , "../../ui")))

app.get("/api/health" , (req , res)=>{
      res.json({ ok: true, service: 'email-processor' });
})

registerUploadRoutes(app)
registerBatchRoutes(app)
app.listen(config.port , ()=>{
    console.log(`Server is running at http://localhost:${config.port}`)
})