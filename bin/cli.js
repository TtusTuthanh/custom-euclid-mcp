#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pythonDir = path.join(__dirname, '../python');

// Ưu tiên dùng uv run để tự động nạp dependencies từ pyproject.toml
const child = spawn('uv', ['run', '--directory', pythonDir, 'euclid-mcp', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env
});

child.on('error', () => {
  // Nếu máy chưa cài uv, fallback về Python hệ thống
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
