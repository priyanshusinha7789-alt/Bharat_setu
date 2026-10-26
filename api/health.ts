import { geminiKeyManager } from '../src/server/geminiKeyManager';
import { requestQueue } from '../src/server/requestQueue';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const diag = geminiKeyManager.getDiagnostics();
  const queueStats = requestQueue.getStats();
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.statusCode = diag.status === 'unhealthy' ? 503 : 200;
  res.end(JSON.stringify({ ...diag, queue: queueStats }, null, 2));
}
