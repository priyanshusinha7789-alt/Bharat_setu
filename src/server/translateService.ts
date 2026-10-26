import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { geminiKeyManager, GeminiKeyManager } from './geminiKeyManager.js';
import { requestQueue, RequestQueue } from './requestQueue.js';
import { detectVisualFallback, VisualMetadata } from '../data/visualDetector.js';

// Ensure .env is loaded
dotenv.config();

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguageHint?: string;
}

export type { VisualMetadata };

export interface TranslationResponse {
  success: boolean;
  translation: string;
  phonetic?: string;
  detectedSource?: string;
  pedagogicalNote?: string;
  targetLanguage: string;
  modelUsed?: string;
  keyId?: string;
  visual?: VisualMetadata;
  error?: string;
  errorCode?: 'MISSING_API_KEY' | 'API_ERROR' | 'UNSUPPORTED_LANGUAGE' | 'INVALID_INPUT' | 'QUOTA_EXCEEDED';
  quotaType?: 'daily' | 'rpm' | 'tpm' | 'unknown';
  retryAfterSeconds?: number;
}

export interface TranslationExecutionOptions {
  mockExecutor?: (apiKey: string, model: string, prompt: string) => Promise<any>;
  keyManager?: GeminiKeyManager;
  maxTransientRetries?: number;
  initialBackoffMs?: number;
  skipQueue?: boolean;
}

const LANGUAGE_METADATA: Record<string, { name: string; script: string; family: string }> = {
  hindi: { name: 'Hindi', script: 'Devanagari', family: 'Indo-Aryan' },
  bengali: { name: 'Bengali', script: 'Bengali (Bangla)', family: 'Indo-Aryan' },
  santali: { name: 'Santali', script: 'Ol Chiki (along with standard Devanagari pronunciation)', family: 'Austroasiatic (Munda)' },
  mundari: { name: 'Mundari', script: 'Mundari Bani / Devanagari', family: 'Austroasiatic (Munda)' },
  ho: { name: 'Ho', script: 'Warang Citi / Devanagari', family: 'Austroasiatic (Munda)' },
  kurukh: { name: 'Kurukh (Oraon)', script: 'Tolong Siki / Devanagari', family: 'Dravidian' }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function translateWithGemini(
  req: TranslationRequest,
  options?: TranslationExecutionOptions
): Promise<TranslationResponse> {
  const { text, targetLanguage, sourceLanguageHint } = req;
  const km = options?.keyManager || geminiKeyManager;

  if (!text || !text.trim()) {
    return {
      success: false,
      translation: '',
      targetLanguage,
      error: 'Input text is empty. Please enter or speak a sentence to translate.',
      errorCode: 'INVALID_INPUT'
    };
  }

  const langMeta = LANGUAGE_METADATA[targetLanguage.toLowerCase()];
  if (!langMeta) {
    return {
      success: false,
      translation: '',
      targetLanguage,
      error: `Unsupported target language: "${targetLanguage}". Supported languages are: Hindi, Bengali, Santali, Mundari, Ho, Kurukh.`,
      errorCode: 'UNSUPPORTED_LANGUAGE'
    };
  }

  // Check if any keys are configured in pool
  if (!km.hasKeys()) {
    return {
      success: false,
      translation: '',
      targetLanguage,
      error: 'No Gemini API keys are configured on the server. Please add GEMINI_API_KEY_1 (or GEMINI_API_KEY) to your .env file.',
      errorCode: 'MISSING_API_KEY'
    };
  }

  // Deduplication & queueing wrapper
  const cacheKey = RequestQueue.makeKey(text, targetLanguage, sourceLanguageHint);

  const executeCore = async (): Promise<TranslationResponse> => {
    // Get available active or recovered keys
    const availableKeys = km.getAvailableKeys();
    if (availableKeys.length === 0) {
      if (km.isDailyQuotaExhaustedPool()) {
        return {
          success: false,
          translation: '',
          targetLanguage,
          error: 'Daily Gemini API request quota exhausted for this Google Cloud project (free-tier limit: 20 requests/day for gemini-3.8-flash). Please wait for the daily quota reset at midnight Pacific Time, check usage at https://ai.dev/rate-limit, or configure an API key from an independent Google Cloud project.',
          errorCode: 'QUOTA_EXCEEDED',
          quotaType: 'daily'
        };
      }

      const shortestCooldown = km.getShortestRemainingCooldownSeconds();
      const waitMsg = shortestCooldown > 0
        ? `All configured Gemini API keys are currently rate-limited (429 / RPM). Automatic recovery in ~${shortestCooldown}s.`
        : 'All configured Gemini API keys are exhausted or quarantined. Please check server keys and quotas.';

      return {
        success: false,
        translation: '',
        targetLanguage,
        error: waitMsg,
        errorCode: 'QUOTA_EXCEEDED',
        quotaType: 'rpm',
        retryAfterSeconds: shortestCooldown > 0 ? shortestCooldown : 30
      };
    }

    const systemPrompt = `You are BHASHA SETU (भाषा सेतु), an AI-Powered Vernacular Pedagogy and Real-Time Translation engine built for primary-school education in multilingual communities in Jharkhand, India.

Your core mission: "We Don't Translate Words, We Translate Learnings."
Help primary-school teachers explain concepts to young children (Grades 1-5) in their mother tongue.

TARGET LANGUAGE: ${langMeta.name} (Script: ${langMeta.script}, Family: ${langMeta.family}).
SOURCE INPUT LANGUAGE: May be English, Hindi, Marathi, Hinglish, mixed classroom language, or colloquial slang.
${sourceLanguageHint ? `Source Hint from user: ${sourceLanguageHint}` : ''}

INSTRUCTIONS:
1. Translate the user's input sentence accurately and context-aware into ${langMeta.name}.
2. Use clear, warm, child-friendly pedagogical vocabulary suitable for primary-school students.
3. If the input is in Hinglish, Marathi, or mixed vernacular speech, accurately decode the intended instructional meaning.
4. For tribal languages (Santali, Mundari, Ho, Kurukh): provide the authentic translation in its respective script (${langMeta.script}). If the script is Ol Chiki, Warang Citi, or Tolong Siki, also provide a Devanagari or Latin phonetic reading to assist bilingual teachers.
5. Provide a short pedagogical note (1 brief sentence) explaining the concept or vocabulary choice for children.
6. VISUAL LEARNING TAGGING: For primary children, select the most relevant visual category:
   - "plant_growth": plants, leaves, sunlight, photosynthesis, water, seeds, trees, food
   - "water_cycle": water, boiling, vapour, steam, heating, evaporation, rain, clouds
   - "triangle_geometry": triangle, 3 sides, geometry, polygons, shapes
   - "circle_geometry": circles, round shapes, wheels, spheres
   - "solar_system": sun, moon, stars, planets, sky, day and night
   - "animal_nature": animal, birds, insects, wildlife, nature
   - "counting_math": numbers, counting, arithmetic, math concepts
   - "classroom_chat": greetings, dialogue, conversational speech, Hinglish/slang chat
   - "pedagogy_concept": general school learning, books, science, knowledge

OUTPUT FORMAT: Return ONLY valid, raw JSON (no markdown formatting, no code fences, no preamble):
{
  "translation": "accurate vernacular translation in target script",
  "phonetic": "pronunciation or phonetic reading in Latin/Devanagari if helpful, otherwise null",
  "detectedSource": "e.g. English, Hinglish, Marathi, Hindi, etc.",
  "pedagogicalNote": "short note for primary school teaching context",
  "visual": {
    "visualType": "one of the types above",
    "conceptTitle": "short 2-4 word concept title",
    "keyElements": ["element 1", "element 2", "element 3"]
  }
}`;

    const prompt = `${systemPrompt}\n\nUSER INPUT TO TRANSLATE:\n"${text.trim()}"`;
    const models = km.getModels();
    const maxTransientRetries = options?.maxTransientRetries ?? 2;
    const initialBackoffMs = options?.initialBackoffMs ?? 200;

    let response: any = null;
    let modelUsed = '';
    let successfulKeyId = '';
    let lastErrorCategory: any = null;

    // Key Failover Loop: Iterate through available keys
    for (let keyIdx = 0; keyIdx < availableKeys.length; keyIdx++) {
      const keyEntry = availableKeys[keyIdx];
      let keyShouldBeSkipped = false;

      // Model Hierarchy: gemini-3.8-flash -> gemini-3.5-flash -> gemini-3.5-flash-lite -> gemini-3.1-flash-lite
      for (const model of models) {
        if (keyShouldBeSkipped) break;

        // Bounded retry loop with exponential backoff and random jitter
        let retryCount = 0;
        while (retryCount <= maxTransientRetries) {
          try {
            if (options?.mockExecutor) {
              response = await options.mockExecutor(keyEntry.key, model, prompt);
            } else {
              const ai = new GoogleGenAI({ apiKey: keyEntry.key });
              response = await ai.models.generateContent({
                model,
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
              });
            }

            modelUsed = model;
            successfulKeyId = keyEntry.id;
            km.markSuccess(keyEntry.id);
            break; // Succeeded!
          } catch (err: any) {
            const categorized = GeminiKeyManager.categorizeError(err);
            lastErrorCategory = categorized;

            if (categorized.type === 'daily_quota') {
              // Daily quota exhausted: Record daily state, do not retry this key
              km.markRateLimited(keyEntry.id, undefined, {
                quotaType: 'daily',
                quotaId: categorized.quotaId,
                projectId: categorized.projectId
              });
              keyShouldBeSkipped = true;
              break;
            }

            if (categorized.type === 'rate_limit') {
              // RPM rate-limit: Mark rate-limited with parsed retry delay + jitter, failover to next key
              const jitterMs = Math.floor(Math.random() * 2000);
              const customDelay = categorized.retryAfterMs ? categorized.retryAfterMs + jitterMs : undefined;
              km.markRateLimited(keyEntry.id, customDelay, {
                quotaType: categorized.quotaType || 'rpm',
                quotaId: categorized.quotaId,
                projectId: categorized.projectId
              });
              keyShouldBeSkipped = true;
              break;
            }

            if (categorized.type === 'invalid_key') {
              // 401: Quarantine key permanently
              km.markInvalid(keyEntry.id, categorized.message);
              keyShouldBeSkipped = true;
              break;
            }

            if (categorized.type === 'permission_denied') {
              // 403: Quarantine key permanently
              km.markPermissionDenied(keyEntry.id, categorized.message);
              keyShouldBeSkipped = true;
              break;
            }

            if (categorized.type === 'transient_server') {
              // 5xx / Network timeout: Retry with bounded exponential backoff with jitter
              retryCount++;
              if (retryCount <= maxTransientRetries) {
                const jitter = Math.floor(Math.random() * 100);
                const backoff = initialBackoffMs * Math.pow(2, retryCount - 1) + jitter;
                console.warn(
                  `[BHASHA SETU Auth] Transient error (${model}, ${keyEntry.id}). Retrying in ${backoff}ms (attempt ${retryCount}/${maxTransientRetries})...`
                );
                await sleep(backoff);
                continue;
              } else {
                break;
              }
            }

            // Other error (e.g. model not supported by key): Try next model
            break;
          }
        }

        if (response && modelUsed) break;
      }

      if (response && modelUsed) break;
    }

    if (!response || !modelUsed) {
      if (km.isDailyQuotaExhaustedPool() || lastErrorCategory?.type === 'daily_quota') {
        return {
          success: false,
          translation: '',
          targetLanguage,
          error: 'Daily Gemini API request quota exhausted for this Google Cloud project (free-tier limit: 20 requests/day for gemini-3.8-flash). Please wait for the daily quota reset at midnight Pacific Time, check usage at https://ai.dev/rate-limit, or configure an API key from an independent Google Cloud project.',
          errorCode: 'QUOTA_EXCEEDED',
          quotaType: 'daily'
        };
      }

      const shortestCooldown = km.getShortestRemainingCooldownSeconds();
      if (lastErrorCategory?.type === 'rate_limit' || shortestCooldown > 0) {
        return {
          success: false,
          translation: '',
          targetLanguage,
          error: `All available Gemini API keys have exceeded their requests-per-minute rate limits. Please retry in ~${shortestCooldown || 30} seconds.`,
          errorCode: 'QUOTA_EXCEEDED',
          quotaType: 'rpm',
          retryAfterSeconds: shortestCooldown || 30
        };
      }

      return {
        success: false,
        translation: '',
        targetLanguage,
        error: `Gemini translation service unavailable. ${lastErrorCategory?.message || 'All keys and fallback models failed.'}`,
        errorCode: 'API_ERROR'
      };
    }

    // Parse response
    const rawOutput = (typeof response === 'string' ? response : (response.text?.trim() || '')).trim();
    let parsed: any;
    try {
      const cleanJson = rawOutput.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      parsed = {
        translation: rawOutput,
        detectedSource: 'Auto-detected',
        pedagogicalNote: 'Direct vernacular translation adapted for primary instruction.'
      };
    }

    const visual = parsed.visual && parsed.visual.visualType
      ? parsed.visual
      : detectVisualFallback(text, parsed.translation);

    return {
      success: true,
      translation: parsed.translation || rawOutput,
      phonetic: parsed.phonetic || undefined,
      detectedSource: parsed.detectedSource || 'Auto-detected',
      pedagogicalNote: parsed.pedagogicalNote || undefined,
      targetLanguage,
      modelUsed,
      keyId: successfulKeyId,
      visual
    };
  };

  // Run through request queue for concurrency limiting and deduplication (unless explicitly skipped in testing)
  if (options?.skipQueue) {
    return executeCore();
  }

  return requestQueue.execute(cacheKey, executeCore);
}

export { detectVisualFallback };
