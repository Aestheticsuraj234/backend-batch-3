import app from './app';
import express from 'express';
import { mountBetterAuth } from './lib/mountBetterAuth';

const PORT = process.env.PORT || 5000;

(async () => {
  await mountBetterAuth(app);

  // Mount after Better Auth handler.
  app.use(express.json());

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();