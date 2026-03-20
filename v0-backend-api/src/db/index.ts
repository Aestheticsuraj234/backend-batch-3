import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    'DATABASE_URL is missing. Copy .env.example to .env and paste your Neon connection string.',
  );
}

const sql = neon(url);
/** Use this in routes/services: import { db } from '../db' */
export const db = drizzle({ client: sql, schema });

export { schema };
