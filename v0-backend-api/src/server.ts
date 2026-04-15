import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { serve } from "inngest/express";

import { auth } from "./lib/auth.js";
import projectRoutes from "./routes/project.routes.js";
import { inngest, functions } from "./integrations/inngest/index.js";
import cors from "cors";

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

app.use(
  cors({
    // all origins
    origin: ["*"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Range", "X-Total-Count"],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express 🚀");
});

app.get("/api/me", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return res.json(session);
});

app.use("/api/projects", projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
