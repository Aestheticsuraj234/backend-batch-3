import { db } from "../db";

export async function createAuth() {
  // `better-auth` is ESM-only. Using dynamic imports keeps your app compatible with a
  // CommonJS TypeScript build/dev runner.
  const { betterAuth } = await import("better-auth");
  const { drizzleAdapter } = await import("better-auth/adapters/drizzle");

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
  });
}