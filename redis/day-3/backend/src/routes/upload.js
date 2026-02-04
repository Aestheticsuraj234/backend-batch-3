import multer from 'multer';
import { parse } from 'csv-parse';
import { prisma } from '../db.js';
import { addBatchToQueue } from '../queue.js';
import { publishBatchStatus, setBatchEmails } from '../redis.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(csv)$/i)) {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
});

function parseCsv(buffer) {
  return new Promise((resolve, reject) => {
    const emails = [];
    const parser = parse({
      columns: false,
      trim: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
    parser.on('data', (row) => {
      const email = (row[0] || '').trim();
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emails.push(email);
      }
    });
    parser.on('error', reject);
    parser.on('end', () => resolve(emails));
    parser.write(buffer);
    parser.end();
  });
}

export function registerUploadRoutes(app) {
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded. Use field name: file' });
      }
      const emails = await parseCsv(req.file.buffer);
      if (emails.length === 0) {
        return res.status(400).json({ error: 'No valid emails found in CSV. CSV should have one email per line (or one column).' });
      }
      const batch = await prisma.batch.create({
        data: {
          filename: req.file.originalname,
          totalEmails: emails.length,
          status: 'pending',
        },
      });
      await setBatchEmails(batch.id, emails);
      await addBatchToQueue(batch.id);
      await publishBatchStatus(batch.id, {
        batchId: batch.id,
        status: 'pending',
        total: batch.totalEmails,
        processed: 0,
      });
      res.json({
        batchId: batch.id,
        filename: batch.filename,
        totalEmails: batch.totalEmails,
        status: batch.status,
        message: 'Batch queued for processing',
      });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  });
}
