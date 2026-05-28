import react from '@vitejs/plugin-react';
import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'vite';

const COLLECTIONS = new Set(['plays', 'articles', 'learning']);

function devContentAdminPlugin() {
  return {
    name: 'sots-dev-content-admin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/content-admin') || req.method === 'OPTIONS') {
          return next();
        }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}');
            const { action, collection, id, data } = payload;
            if (!COLLECTIONS.has(collection)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Unknown collection' }));
              return;
            }

            const filePath = path.resolve(
              server.config.root,
              'public/data',
              `${collection}.json`,
            );
            const raw = await fs.readFile(filePath, 'utf8');
            let items = JSON.parse(raw);

            if (action === 'create') {
              const item = {
                ...data,
                id: data.id || crypto.randomUUID(),
              };
              items.push(item);
              await fs.writeFile(filePath, JSON.stringify(items, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ item }));
              return;
            }

            if (action === 'update') {
              const idx = items.findIndex((i) => i.id === id);
              if (idx === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
                return;
              }
              const item = { ...items[idx], ...data, id };
              items[idx] = item;
              await fs.writeFile(filePath, JSON.stringify(items, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ item }));
              return;
            }

            if (action === 'delete') {
              const next = items.filter((i) => i.id !== id);
              if (next.length === items.length) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Not found' }));
                return;
              }
              await fs.writeFile(filePath, JSON.stringify(next, null, 2));
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ ok: true }));
              return;
            }

            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Unknown action' }));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          }
        });
      });

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/admin-auth')) return next();

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              user: { email: 'admin@local.dev', role: 'admin' },
            }),
          );
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                token: 'dev-token',
                user: { email: 'admin@local.dev', role: 'admin' },
              }),
            );
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error',
  plugins: [react(), devContentAdminPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
