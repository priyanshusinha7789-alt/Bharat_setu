export type LanguageId = 'hindi' | 'bengali' | 'santali' | 'mundari' | 'ho' | 'kurukh';

export type TranslationStatus = 'verified' | 'pending_validation';

export interface LanguageInfo {
  id: LanguageId;
  name: string;
  nativeName: string;
  script: string;
  region: string;
  status: TranslationStatus;
  statusLabel: string;
  ttsVoiceCode?: string;
  fallbackVoiceCode?: string;
  culturalNote: string;
}

export interface TranslationEntry {
  text: string;
  status: TranslationStatus;
  note?: string;
}

export interface SampleSentence {
  id: number;
  english: string;
  subject: string;
  gradeLevel: string;
  translations: Record<LanguageId, TranslationEntry>;
}

export interface TeamMember {
  name: string;
  role: string;
  department: string;
  linkedinUrl?: string;
  initials: string;
}
