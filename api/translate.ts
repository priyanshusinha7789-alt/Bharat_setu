import { translateWithGemini } from '../src/server/translateService.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    } else if (!body) {
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      try {
        body = JSON.parse(raw);
      } catch {}
    }

    body = body || {};

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
}
