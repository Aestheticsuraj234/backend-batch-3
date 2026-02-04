import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerUploadRoutes } from './routes/upload.js';
import { registerBatchRoutes } from './routes/batches.js';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../ui')));

registerUploadRoutes(app);
registerBatchRoutes(app);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'email-processor' });
});

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
});
