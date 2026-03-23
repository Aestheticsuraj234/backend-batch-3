import {drizzle} from "drizzle-orm/node-postgres"
import pkg from "pg";
import "dotenv/config";

const {Pool} = pkg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
})

export const db = drizzle(pool)