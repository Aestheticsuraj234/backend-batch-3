
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const count = Math.min(10000, Math.max(1, parseInt(process.argv[2], 10) || 15000));
const domains = ['example.com', 'test.org', 'mail.net', 'company.com', 'demo.io', 'sample.co'];
const lines = ['email'];
for (let i = 0; i < count; i++) {
  lines.push(`user${i + 1}@${domains[i % domains.length]}`);
}
const out = join(__dirname, '..', 'sample-emails-large.csv');
writeFileSync(out, lines.join('\n'), 'utf8');
console.log(`Wrote ${count} emails to ${out}`);
