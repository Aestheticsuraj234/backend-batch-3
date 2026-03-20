import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { db } from './db';

dotenv.config();

const app = express();

app.use(cors());
// Better Auth must be mounted before `express.json()` (body parsing) for requests to
// `/api/auth/*` to avoid the client getting stuck on "pending".

/** Confirms API + Neon wiring (see https://orm.drizzle.team/docs/get-started/neon-new) */
app.get('/api/db-check', async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ ok: true, message: 'Database reachable' });
  } catch {
    res.status(500).json({ ok: false, message: 'Database unreachable — check DATABASE_URL and db:push' });
  }
});

export default app;