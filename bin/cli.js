#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonDir = path.join(__dirname, '../python');

// Thêm cờ -q và biến môi trường UV_QUIET để chặn uv in log rác vào stdout
const child = spawn('uv', ['run', '-q', '--directory', pythonDir, 'euclid-mcp', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: {
    ...process.env,
    UV_QUIET: '1'
  }
});

child.on('error', () => {
  const fallback = spawn('python', ['-m', 'euclid_mcp', ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PYTHONPATH: pythonDir
    }
  });

  fallback.on('close', (code) => process.exit(code ?? 0));
});

child.on('close', (code) => {
  process.exit(code ?? 0);
});
