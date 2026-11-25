/**
 * Speaky — 로컬 개발 서버 (Node 18+)
 *
 *   node server.js            → http://localhost:3000
 *   PORT=8080 node server.js
 *
 * 정적 파일과 /api/* 를 함께 서빙합니다.
 * .env 파일에 OPENAI_API_KEY=sk-... 를 넣으면 서버 모드(AI)로 동작합니다.
 */
import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'node:fs';

import chatHandler from './api/chat.js';
import transcribeHandler from './api/transcribe.js';
import ttsHandler from './api/tts.js';
import healthHandler from './api/health.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

/* ── .env 간단 로더 ─────────────────────────────── */
async function loadEnv() {
  try {
    const raw = await readFile(path.join(__dirname, '.env'), 'utf8');
    raw.split('\n').forEach((line) => {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) return;
      let value = m[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = value;
    });
  } catch (e) { /* .env 없으면 무시 */ }
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const API_ROUTES = {
  '/api/chat': chatHandler,
  '/api/transcribe': transcribeHandler,
  '/api/tts': ttsHandler,
  '/api/health': healthHandler
};

function decorateResponse(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(obj));
    return res;
  };
  return res;
}

async function runApi(handler, req, res) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (raw) {
    try { req.body = JSON.parse(raw); } catch (e) { req.body = raw; }
  } else {
    req.body = {};
  }
  decorateResponse(res);
  try {
    await handler(req, res);
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'server error' });
    } else {
      res.end();
    }
  }
}

async function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/' || rel === '') rel = '/index.html';

  const filePath = path.join(__dirname, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      return serveStatic(req, res, path.join(rel, 'index.html'));
    }
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.setHeader('Content-Length', info.size);
    res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=300');
    createReadStream(filePath).pipe(res);
  } catch (e) {
    // SPA fallback
    if (!path.extname(rel)) {
      try {
        const index = await readFile(path.join(__dirname, 'index.html'));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(index);
        return;
      } catch (err) {}
    }
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('404 Not Found');
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (API_ROUTES[pathname]) {
    await runApi(API_ROUTES[pathname], req, res);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  await serveStatic(req, res, pathname);
});

await loadEnv();

server.listen(PORT, () => {
  const key = process.env.OPENAI_API_KEY ? '설정됨 (AI 서버 모드 사용 가능)' : '없음 (데모 모드)';
  console.log(`\n  🗣️  Speaky dev server`);
  console.log(`  ➜  http://localhost:${PORT}`);
  console.log(`  ➜  OPENAI_API_KEY: ${key}\n`);
});
