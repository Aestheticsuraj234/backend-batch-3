import dotenv from "dotenv";
import { connectDB } from "./config/db.config.js";
import { app } from "./app.js";

dotenv.config();

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});
