import { LanguageInfo } from '../types';

export const LANGUAGES: LanguageInfo[] = [
  {
    id: 'hindi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    region: 'Statewide Lingua Franca, Jharkhand',
    status: 'verified',
    statusLabel: 'Verified Offline Sample',
    ttsVoiceCode: 'hi-IN',
    culturalNote: 'Common instructional medium used in primary schools alongside local tribal dialects.'
  },
  {
    id: 'bengali',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Eastern Nagari (Bangla)',
    region: 'Santhal Pargana & East Singhbhum border belt',
    status: 'verified',
    statusLabel: 'Verified Offline Sample',
    ttsVoiceCode: 'bn-IN',
    culturalNote: 'Extensively spoken by bilingual tribal and non-tribal primary students across eastern Jharkhand.'
  },
  {
    id: 'santali',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki (8th Schedule of Indian Constitution)',
    region: 'Dumka, Jamtara, Deoghar, Godda, Pakur, Sahibganj',
    status: 'pending_validation',
    statusLabel: 'Awaiting Community Validation',
    ttsVoiceCode: 'sat-IN',
    fallbackVoiceCode: 'hi-IN',
    culturalNote: 'Largest indigenous linguistic population in Jharkhand; constitutional recognized mother tongue.'
  },
  {
    id: 'mundari',
    name: 'Mundari',
    nativeName: 'ᱢᱩᱱᱰᱟᱨᱤ / मुंडारी',
    script: 'Mundari Bani / Devanagari',
    region: 'Khunti, Ranchi, Gumla, Simdega',
    status: 'pending_validation',
    statusLabel: 'Awaiting Community Validation',
    ttsVoiceCode: 'unr-IN',
    fallbackVoiceCode: 'hi-IN',
    culturalNote: 'Austroasiatic language central to Munda heritage, forest pedagogical pedagogy and oral traditions.'
  },
  {
    id: 'ho',
    name: 'Ho',
    nativeName: 'Warang Citi / ᱦᱳ',
    script: 'Warang Citi',
    region: 'Kolhan division: West Singhbhum, Chaibasa',
    status: 'pending_validation',
    statusLabel: 'Awaiting Community Validation',
    ttsVoiceCode: 'hoc-IN',
    fallbackVoiceCode: 'hi-IN',
    culturalNote: 'Distinct indigenous mother tongue of the Ho adivasi people, preserving ancestral ecological knowledge.'
  },
  {
    id: 'kurukh',
    name: 'Kurukh',
    nativeName: 'कुड़ुख़ / ᱬᱳᱞᱳᱝ ᱥᱤᱠᱤ',
    script: 'Tolong Siki / Devanagari',
    region: 'Lohardaga, Gumla, Latehar, Ranchi',
    status: 'pending_validation',
    statusLabel: 'Awaiting Community Validation',
    ttsVoiceCode: 'kru-IN',
    fallbackVoiceCode: 'hi-IN',
    culturalNote: 'Northern Dravidian tongue spoken by the Oraon community, recognized as an endangered heritage language.'
  }
];
