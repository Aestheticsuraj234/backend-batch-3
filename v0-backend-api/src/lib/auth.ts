
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";

const betterAuthSecret = process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET;
if (!betterAuthSecret) {
  // Better Auth also has a fallback, but we want an explicit fail in dev if missing.
  throw new Error("Missing BETTER_AUTH_SECRET (or AUTH_SECRET) in environment");
}

const betterAuthUrl = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
  secret: betterAuthSecret,
  baseURL: betterAuthUrl,
  trustedOrigins: [betterAuthUrl ?? "http://localhost:5000"],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true, 
  },
});