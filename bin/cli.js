#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonDir = path.join(__dirname, '../python');

const child = spawn('python', ['-m', 'euclid_mcp', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PYTHONPATH: pythonDir
  }
});

child.on('error', (err) => {
  console.error('Lỗi khi khởi chạy Euclid-MCP:', err);
  process.exit(1);
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});