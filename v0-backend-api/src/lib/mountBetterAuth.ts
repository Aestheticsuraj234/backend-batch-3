import type { Express } from 'express';
import { createAuth } from './auth';

export async function mountBetterAuth(app: Express) {
  const { toNodeHandler } = await import('better-auth/node');
  const auth = await createAuth();

  // Express v5 uses the `*splat` wildcard.
  app.all('/api/auth/*splat', toNodeHandler(auth));
}

