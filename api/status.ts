import { geminiKeyManager } from '../src/server/geminiKeyManager';

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
}
