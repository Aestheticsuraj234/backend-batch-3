import { prisma } from '../db.js';
import { subscriber, CHANNEL_PREFIX } from '../redis.js';

export function registerBatchRoutes(app) {
  app.get('/api/batches', async (req, res) => {
    try {
      const batches = await prisma.batch.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          filename: true,
          totalEmails: true,
          insertedCount: true,
          status: true,
          createdAt: true,
          completedAt: true,
        },
      });
      res.json(batches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch batches' });
    }
  });

  app.get('/api/batches/:id', async (req, res) => {
    try {
      const batch = await prisma.batch.findUnique({
        where: { id: req.params.id },
        select: {
          id: true,
          filename: true,
          totalEmails: true,
          insertedCount: true,
          status: true,
          createdAt: true,
          completedAt: true,
        },
      });
      if (!batch) return res.status(404).json({ error: 'Batch not found' });
      res.json(batch);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch batch' });
    }
  });

  app.get('/api/batches/:id/stream', (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const channel = CHANNEL_PREFIX + id;
    const onMessage = (ch, message) => {
      if (ch === channel) res.write(`data: ${message}\n\n`);
    };
    subscriber.subscribe(channel).then(() => {
      prisma.batch
        .findUnique({
          where: { id },
          select: {
            id: true,
            filename: true,
            totalEmails: true,
            insertedCount: true,
            status: true,
          },
        })
        .then((batch) => {
          if (batch) res.write(`data: ${JSON.stringify(batch)}\n\n`);
        })
        .catch(() => {});
    }).catch((err) => {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    });
    subscriber.on('message', onMessage);
    req.on('close', () => {
      subscriber.removeListener('message', onMessage);
    });
  });
}
