import express from 'express';

import fs from 'fs';
import path from 'path';
import loggerMiddleware from './middleware/logger.middleware.js';

const app = express();
const PORT = 3000;


app.use(loggerMiddleware);


app.get('/', (req, res) => {
  res.send(`
    <h1>Express Logger API (ES Modules)</h1>
    <p><a href="/api/logs">View Logs</a> | <a href="/api/logs/download">Download Logs</a></p>
    <p>Hit any route to generate logs!</p>
  `);
});

// Route 2: API to read logs (path relative to app.js)
app.get('/api/logs', (req, res) => {
  const logsPath = path.join(import.meta.dirname, 'logs', 'logs.txt');
  let logs = 'No logs yet';
  if (fs.existsSync(logsPath)) {
    logs = fs.readFileSync(logsPath, 'utf8');
  }
  res.json({ 
    logs: logs.split('\n').filter(line => line.trim()), 
    count: logs.split('\n').filter(line => line.trim()).length 
  });
});


app.get('/api/logs/download', (req, res) => {
  const logsPath = path.join(import.meta.dirname, 'logs', 'logs.txt');
  res.setHeader('Content-Disposition', 'attachment; filename=logs.txt');
  
  if (!fs.existsSync(logsPath)) {
    return res.status(404).send('No logs available');
  }
  
  const readStream = fs.createReadStream(logsPath);
  readStream.pipe(res);
});

// POST route example
app.post('/api/ping', (req, res) => {
  res.json({ message: 'Pong!', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
