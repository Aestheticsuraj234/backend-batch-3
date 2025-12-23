import fs from 'fs';
import path from 'path';

const logsDir = path.join(import.meta.dirname, '..', 'logs'); 
const logsPath = path.join(logsDir, 'logs.txt');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logStream = fs.createWriteStream(logsPath, { flags: 'a' });

const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${req.method} ${req.url} - ${req.get('user-agent') || 'unknown'}\n`;
  logStream.write(logEntry);
  console.log(logEntry.trim());
  next();
};

export default loggerMiddleware;
