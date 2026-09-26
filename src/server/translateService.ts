import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure .env is loaded
dotenv.config();

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguageHint?: string;
}

export interface TranslationResponse {
  success: boolean;
  translation: string;
  phonetic?: string;
  detectedSource?: string;
  pedagogicalNote?: string;
  targetLanguage: string;
  error?: string;
  errorCode?: 'MISSING_API_KEY' | 'API_ERROR' | 'UNSUPPORTED_LANGUAGE' | 'INVALID_INPUT';
}

const LANGUAGE_METADATA: Record<string, { name: string; script: string; family: string }> = {
  hindi: { name: 'Hindi', script: 'Devanagari', family: 'Indo-Aryan' },
  bengali: { name: 'Bengali', script: 'Bengali (Bangla)', family: 'Indo-Aryan' },
  santali: { name: 'Santali', script: 'Ol Chiki (along with standard Devanagari pronunciation)', family: 'Austroasiatic (Munda)' },
  mundari: { name: 'Mundari', script: 'Mundari Bani / Devanagari', family: 'Austroasiatic (Munda)' },
  ho: { name: 'Ho', script: 'Warang Citi / Devanagari', family: 'Austroasiatic (Munda)' },
  kurukh: { name: 'Kurukh (Oraon)', script: 'Tolong Siki / Devanagari', family: 'Dravidian' }
};

export async function translateWithGemini(req: TranslationRequest): Promise<TranslationResponse> {
  const { text, targetLanguage, sourceLanguageHint } = req;

  if (!text || !text.trim()) {
    return {
      success: false,
      translation: '',
      targetLanguage,
      error: 'Input text is empty. Please enter or speak a sentence to translate.',
      errorCode: 'INVALID_INPUT'
    };
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      translation: '',
      targetLanguage,
      error: 'GEMINI_API_KEY is not configured on the server. Please add your Gemini API key to the .env file in the project directory.',
      errorCode: 'MISSING_API_KEY'
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

  try {
    const ai = new GoogleGenAI({ apiKey });

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

OUTPUT FORMAT: Return ONLY valid, raw JSON (no markdown formatting, no code fences, no preamble):
{
  "translation": "accurate vernacular translation in target script",
  "phonetic": "pronunciation or phonetic reading in Latin/Devanagari if helpful, otherwise null",
  "detectedSource": "e.g. English, Hinglish, Marathi, Hindi, etc.",
  "pedagogicalNote": "short note for primary school teaching context"
}`;

    // Call Gemini 3.8 Flash (with fallback to gemini-2.0-flash / gemini-1.5-flash if needed)
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER INPUT TO TRANSLATE:\n"${text.trim()}"` }] }
        ]
      });
    } catch {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER INPUT TO TRANSLATE:\n"${text.trim()}"` }] }
          ]
        });
      } catch {
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUSER INPUT TO TRANSLATE:\n"${text.trim()}"` }] }
          ]
        });
      }
    }

    const rawOutput = response.text?.trim() || '';
    
    // Parse JSON safely
    let parsed: any;
    try {
      // Remove any surrounding code fences if model included them
      const cleanJson = rawOutput.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch {
      // If output is not pure JSON, use text directly
      parsed = {
        translation: rawOutput,
        detectedSource: 'Auto-detected',
        pedagogicalNote: 'Direct vernacular translation adapted for primary instruction.'
      };
    }

    return {
      success: true,
      translation: parsed.translation || rawOutput,
      phonetic: parsed.phonetic || undefined,
      detectedSource: parsed.detectedSource || 'Auto-detected',
      pedagogicalNote: parsed.pedagogicalNote || undefined,
      targetLanguage
    };
  } catch (err: any) {
    const errorStr = String(err?.message || err);
    let userFriendlyMsg = 'Gemini translation request failed. Please check your network connection and API key.';

    if (errorStr.includes('API_KEY_INVALID') || errorStr.includes('invalid api key') || errorStr.includes('401')) {
      userFriendlyMsg = 'Invalid Gemini API Key. Please verify the GEMINI_API_KEY in your .env file.';
    } else if (errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('429')) {
      userFriendlyMsg = 'Gemini API quota exceeded. Please try again in a few moments.';
    } else if (errorStr.includes('PERMISSION_DENIED') || errorStr.includes('403')) {
      userFriendlyMsg = 'Permission denied for this Gemini API key. Ensure the Generative Language API is enabled.';
    } else if (errorStr.includes('FETCH_ERROR') || errorStr.includes('ENOTFOUND')) {
      userFriendlyMsg = 'Network connectivity error reaching Google Gemini API. Please check your internet connection.';
    }

    return {
      success: false,
      translation: '',
      targetLanguage,
      error: userFriendlyMsg,
      errorCode: 'API_ERROR'
    };
  }
}
