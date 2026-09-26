import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { translateWithGemini } from './src/server/translateService';

dotenv.config();

function bhashaSetuApiPlugin(): Plugin {
  return {
    name: 'bhasha-setu-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Health check and API key readiness endpoint
        if (req.url === '/api/status' && req.method === 'GET') {
          const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({
            status: 'online',
            hasApiKey: hasKey,
            model: 'gemini-2.5-flash / gemini-1.5-flash'
          }));
          return;
        }

        // Translation endpoint
        if (req.url === '/api/translate' && req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', chunk => chunks.push(Buffer.from(chunk)));
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
              res.statusCode = result.success ? 200 : (result.errorCode === 'MISSING_API_KEY' ? 400 : 500);
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
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), bhashaSetuApiPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
