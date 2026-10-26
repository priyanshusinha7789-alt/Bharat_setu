import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { translateWithGemini } from './src/server/translateService';
import { geminiKeyManager } from './src/server/geminiKeyManager';
import { requestQueue } from './src/server/requestQueue';

dotenv.config();

function bhashaSetuApiPlugin(): Plugin {
  const setupApiMiddleware = (server: any) => {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      // Server diagnostics and failover health endpoints
      if ((req.url === '/health' || req.url === '/api/health') && req.method === 'GET') {
        const diag = geminiKeyManager.getDiagnostics();
        const queueStats = requestQueue.getStats();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = diag.status === 'unhealthy' ? 503 : 200;
        res.end(JSON.stringify({ ...diag, queue: queueStats }, null, 2));
        return;
      }

      // Quick API status endpoint
      if (req.url === '/api/status' && req.method === 'GET') {
        const diag = geminiKeyManager.getDiagnostics();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.statusCode = 200;
        res.end(JSON.stringify({
          status: diag.status,
          hasApiKey: diag.keys.total > 0,
          activeKeys: diag.keys.active,
          totalKeys: diag.keys.total,
          model: 'gemini-3.8-flash',
          supportedModels: diag.supportedModels
        }));
        return;
      }

      // Translation endpoint
      if (req.url === '/api/translate' && req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
        req.on('end', async () => {
          try {
            const bodyStr = Buffer.concat(chunks).toString('utf-8');
            const body = JSON.parse(bodyStr || '{}');

            const result = await translateWithGemini({
              text: body.text || '',
              targetLanguage: body.targetLanguage || 'hindi',
              sourceLanguageHint: body.sourceLanguageHint
            });

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = result.success
              ? 200
              : (result.errorCode === 'MISSING_API_KEY'
                  ? 400
                  : (result.errorCode === 'QUOTA_EXCEEDED' ? 429 : 500));
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              translation: '',
              error: 'Server error processing translation request: ' + (err.message || String(err)),
              errorCode: 'API_ERROR'
            }));
          }
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'bhasha-setu-api-plugin',
    configureServer(server) {
      setupApiMiddleware(server);
    },
    configurePreviewServer(server) {
      setupApiMiddleware(server);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), bhashaSetuApiPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['heavy-parents-sniff.loca.lt', '.loca.lt']
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['heavy-parents-sniff.loca.lt', '.loca.lt']
  }
});
