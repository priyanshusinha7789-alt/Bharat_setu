import { SampleSentence, LanguageId } from '../types';

export const PENDING_VALIDATION_MESSAGE = 'Sample translation requires validation by a fluent speaker';

export const SAMPLE_SENTENCES: SampleSentence[] = [
  {
    id: 1,
    english: 'Plants need sunlight, water and carbon dioxide to prepare their food.',
    subject: 'Environmental Studies / Science',
    gradeLevel: 'Primary (Class 3-5)',
    translations: {
      hindi: {
        text: 'पौधों को अपना भोजन बनाने के लिए सूर्य का प्रकाश, पानी और कार्बन डाइऑक्साइड की आवश्यकता होती है।',
        status: 'verified'
      },
      bengali: {
        text: 'উদ্ভিদের খাদ্য তৈরি করার জন্য সূর্যের আলো, জল এবং কার্বন ডাইঅক্সাইডের প্রয়োজন হয়।',
        status: 'verified'
      },
      santali: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Indigenous tribal curriculum entry under field validation with Santali linguists.'
      },
      mundari: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Grammatical and dialectical review pending with community primary educators.'
      },
      ho: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Warang Citi orthography review in progress.'
      },
      kurukh: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Oraon linguistic validation session planned for field prototype phase.'
      }
    }
  },
  {
    id: 2,
    english: 'A triangle has three sides.',
    subject: 'Basic Mathematics & Geometry',
    gradeLevel: 'Primary (Class 1-3)',
    translations: {
      hindi: {
        text: 'एक त्रिभुज की तीन भुजाएँ होती हैं।',
        status: 'verified'
      },
      bengali: {
        text: 'একটি ত্রিভুজের তিনটি বাহু আছে।',
        status: 'verified'
      },
      santali: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Awaiting native speaker terminology check for geometrical terms.'
      },
      mundari: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Pedagogical terminology check under community review.'
      },
      ho: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Classroom validation scheduled with local teachers in Kolhan.'
      },
      kurukh: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Field vocabulary standardization underway.'
      }
    }
  },
  {
    id: 3,
    english: 'Water changes into vapour when heated.',
    subject: 'General Science & States of Matter',
    gradeLevel: 'Primary (Class 3-5)',
    translations: {
      hindi: {
        text: 'गर्म करने पर पानी वाष्प में बदल जाता है।',
        status: 'verified'
      },
      bengali: {
        text: 'গরম করলে জল বাষ্পে পরিণত হয়।',
        status: 'verified'
      },
      santali: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Concept translation undergoing peer review with tribal educators.'
      },
      mundari: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Awaiting local dialect verification.'
      },
      ho: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Awaiting validation by fluent mother-tongue speaker.'
      },
      kurukh: {
        text: PENDING_VALIDATION_MESSAGE,
        status: 'pending_validation',
        note: 'Linguistic verification underway.'
      }
    }
  }
];

/**
 * Normalizes input text for matching against offline sample sentences.
 * Strips punctuation, multiple spaces, and converts to lowercase.
 */
export function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Looks up translation for a given input sentence and target language.
 */
export function findTranslation(
  inputText: string,
  targetLang: LanguageId
): {
  found: boolean;
  sample?: SampleSentence;
  translationText: string;
  status: 'verified' | 'pending_validation' | 'no_sample';
  note?: string;
} {
  const cleanInput = normalizeSentence(inputText);
  if (!cleanInput) {
    return {
      found: false,
      translationText: '',
      status: 'no_sample'
    };
  }

  const matched = SAMPLE_SENTENCES.find(
    s => normalizeSentence(s.english) === cleanInput
  );

  if (matched) {
    const entry = matched.translations[targetLang];
    return {
      found: true,
      sample: matched,
      translationText: entry.text,
      status: entry.status,
      note: entry.note
    };
  }

  return {
    found: false,
    translationText: 'No offline sample available for this sentence in prototype mode.',
    status: 'no_sample'
  };
}
