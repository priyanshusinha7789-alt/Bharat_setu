import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Ensure .env is loaded
dotenv.config();

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguageHint?: string;
}

export interface VisualMetadata {
  visualType: 'plant_growth' | 'water_cycle' | 'triangle_geometry' | 'circle_geometry' | 'solar_system' | 'animal_nature' | 'counting_math' | 'classroom_chat' | 'pedagogy_concept';
  conceptTitle: string;
  keyElements: string[];
}

export interface TranslationResponse {
  success: boolean;
  translation: string;
  phonetic?: string;
  detectedSource?: string;
  pedagogicalNote?: string;
  targetLanguage: string;
  visual?: VisualMetadata;
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
6. VISUAL LEARNING TAGGING: For primary children, select the most relevant visual category:
   - "plant_growth": plants, leaves, sunlight, photosynthesis, water, seeds, trees, food
   - "water_cycle": water, boiling, vapour, steam, heating, evaporation, rain, clouds
   - "triangle_geometry": triangle, 3 sides, geometry, polygons, shapes
   - "circle_geometry": circles, round shapes, wheels, spheres
   - "solar_system": sun, moon, stars, planets, sky, day and night
   - "animal_nature": animals, birds, insects, wildlife, nature
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

    // Determine visual metadata, falling back to semantic keyword detection if omitted
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
      visual
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

/**
 * Fallback semantic classifier to select appropriate visual illustration for primary students
 */
export function detectVisualFallback(sourceText: string, translatedText: string = ''): VisualMetadata {
  const combined = (sourceText + ' ' + translatedText).toLowerCase();

  if (/\b(vapour|vapor|steam|heated|boil|boiling|evaporat|वाष्प|भाप|गरम करने|বাষ্প|জল বাষ্প)\b/i.test(combined)) {
    return {
      visualType: 'water_cycle',
      conceptTitle: 'Evaporation & States of Matter',
      keyElements: ['Liquid water', 'Thermal heating', 'Ascending vapour particles']
    };
  }

  if (/\b(plant|plants|leaf|leaves|sunlight|photosynthesis|tree|trees|seed|sprout|soil|पौध|पेड़|पत्त|धूप|झाड़|গাছ|পাতা)\b/i.test(combined)) {
    return {
      visualType: 'plant_growth',
      conceptTitle: 'Plant Photosynthesis & Growth',
      keyElements: ['Sunlight energy', 'Water absorption', 'Plant food preparation']
    };
  }

  if (/\b(triangle|three sides|3 sides|angle|angles|polygon|corner|त्रिभुज|भुजा|कोन|त्रिकोण|ত্রিভুজ|বাহু)\b/i.test(combined)) {
    return {
      visualType: 'triangle_geometry',
      conceptTitle: 'Triangle Geometry & Sides',
      keyElements: ['Side 1 (Base)', 'Side 2 (Left)', 'Side 3 (Right)']
    };
  }

  if (/\b(circle|round|wheel|sphere|circular|perimeter|radius|गोल|वृत्त|चक्र|বৃত্ত)\b/i.test(combined)) {
    return {
      visualType: 'circle_geometry',
      conceptTitle: 'Circular Geometry & Shapes',
      keyElements: ['Center point', 'Continuous curved perimeter', 'Radius distance']
    };
  }

  if (/\b(sun|moon|star|stars|planet|space|sky|orbit|day|night|चाँद|तारे|आसमान|सूर्य|ग्रह)\b/i.test(combined)) {
    return {
      visualType: 'solar_system',
      conceptTitle: 'Planets & Celestial Motion',
      keyElements: ['Central Sun', 'Orbital path', 'Atmospheric cycle']
    };
  }

  if (/\b(animal|bird|cat|dog|fish|cow|lion|forest|creature|जानवर|पशु|पक्षी|चिड़िया)\b/i.test(combined)) {
    return {
      visualType: 'animal_nature',
      conceptTitle: 'Living Animals & Nature',
      keyElements: ['Natural habitat', 'Living creature', 'Ecosystem link']
    };
  }

  if (/\b(count|number|numbers|one|two|three|four|five|ten|plus|minus|math|maths|add|गिन|संख्या|जोड़|अंक)\b/i.test(combined)) {
    return {
      visualType: 'counting_math',
      conceptTitle: 'Foundational Counting & Numbers',
      keyElements: ['Numeral symbols', 'Visual token counting', 'Equivalence balance']
    };
  }

  if (/\b(hello|hi|namaste|kem cho|kasa|kaise|kya|bhai|yaar|friend|dost|talk|listen|bol|suno|सुनो|नमस्ते|কেমন)\b/i.test(combined)) {
    return {
      visualType: 'classroom_chat',
      conceptTitle: 'Classroom Dialogue & Expression',
      keyElements: ['Teacher expression', 'Mother tongue translation', 'Student comprehension']
    };
  }

  return {
    visualType: 'pedagogy_concept',
    conceptTitle: 'Curricular Concept Learning',
    keyElements: ['Concept definition', 'Vernacular context', 'Primary explanation']
  };
}
