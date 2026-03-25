import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import projectRoutes from "./routes/project.routes.js"

const app = express();
const PORT = 8080;

app.use("/api/auth/{*any}", (req, _res, next) => {
  if (!req.headers.origin) {
    req.headers.origin = `http://localhost:${PORT}`;
  }
  next();
});

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express 🚀");
});

app.get("/api/me", async (req, res) => {
 	const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
	return res.json(session);
});

app.use("/api/projects" , projectRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});