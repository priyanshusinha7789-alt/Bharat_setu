import { SAMPLE_SENTENCES, findTranslation, PENDING_VALIDATION_MESSAGE } from './src/data/translations.ts';
import { LANGUAGES } from './src/data/languages.ts';
import { TEAM_MEMBERS } from './src/data/team.ts';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- Testing Bhasha Setu Data & Logic ---');

// 1. Check languages
assert(LANGUAGES.length === 6, 'Contains exactly 6 languages');
const langIds = LANGUAGES.map(l => l.id);
assert(langIds.includes('hindi') && langIds.includes('bengali') && langIds.includes('santali') &&
       langIds.includes('mundari') && langIds.includes('ho') && langIds.includes('kurukh'),
       'All 6 required languages present');

// 2. Check 3 verified sample sentences
assert(SAMPLE_SENTENCES.length === 3, 'Contains exactly 3 sample sentences');

// Sample 1: Plants
const s1Hindi = findTranslation('Plants need sunlight, water and carbon dioxide to prepare their food.', 'hindi');
assert(s1Hindi.found === true, 'S1 Hindi found');
assert(s1Hindi.translationText === 'पौधों को अपना भोजन बनाने के लिए सूर्य का प्रकाश, पानी और कार्बन डाइऑक्साइड की आवश्यकता होती है।',
       'S1 Hindi verified exact text matches');

const s1Bengali = findTranslation('Plants need sunlight, water and carbon dioxide to prepare their food.', 'bengali');
assert(s1Bengali.found === true, 'S1 Bengali found');
assert(s1Bengali.translationText === 'উদ্ভিদের খাদ্য তৈরি করার জন্য সূর্যের আলো, জল এবং কার্বন ডাইঅক্সাইডের প্রয়োজন হয়।',
       'S1 Bengali verified exact text matches');

const s1Santali = findTranslation('Plants need sunlight, water and carbon dioxide to prepare their food.', 'santali');
assert(s1Santali.found === true, 'S1 Santali found');
assert(s1Santali.translationText === PENDING_VALIDATION_MESSAGE, 'S1 Santali shows validation message');

// Sample 2: Triangle
const s2Hindi = findTranslation('A triangle has three sides.', 'hindi');
assert(s2Hindi.found === true, 'S2 Hindi found');
assert(s2Hindi.translationText === 'एक त्रिभुज की तीन भुजाएँ होती हैं।', 'S2 Hindi exact text matches');

const s2Bengali = findTranslation('A triangle has three sides.', 'bengali');
assert(s2Bengali.found === true, 'S2 Bengali found');
assert(s2Bengali.translationText === 'একটি ত্রিভুজের তিনটি বাহু আছে।', 'S2 Bengali exact text matches');

const s2Mundari = findTranslation('A triangle has three sides.', 'mundari');
assert(s2Mundari.translationText === PENDING_VALIDATION_MESSAGE, 'S2 Mundari shows validation message');

// Sample 3: Water vapour
const s3Hindi = findTranslation('Water changes into vapour when heated.', 'hindi');
assert(s3Hindi.found === true, 'S3 Hindi found');
assert(s3Hindi.translationText === 'गर्म करने पर पानी वाष्प में बदल जाता है।', 'S3 Hindi exact text matches');

const s3Bengali = findTranslation('Water changes into vapour when heated.', 'bengali');
assert(s3Bengali.found === true, 'S3 Bengali found');
assert(s3Bengali.translationText === 'গরম করলে জল বাষ্পে পরিণত হয়।', 'S3 Bengali exact text matches');

const s3Ho = findTranslation('Water changes into vapour when heated.', 'ho');
assert(s3Ho.translationText === PENDING_VALIDATION_MESSAGE, 'S3 Ho shows validation message');

const s3Kurukh = findTranslation('Water changes into vapour when heated.', 'kurukh');
assert(s3Kurukh.translationText === PENDING_VALIDATION_MESSAGE, 'S3 Kurukh shows validation message');

// 3. Check arbitrary unmatched input
const arbitrary = findTranslation('Today is a rainy day in Ranchi.', 'hindi');
assert(arbitrary.found === false, 'Arbitrary text marked as not found');
assert(arbitrary.status === 'no_sample', 'Arbitrary text status is no_sample');
assert(arbitrary.translationText.includes('No offline sample available'), 'Shows no offline sample available message');

// 4. Check Team
assert(TEAM_MEMBERS.length === 6, 'Contains exactly 6 team members');
const shayantan = TEAM_MEMBERS.find(m => m.name.includes('Shayantan'));
assert(shayantan && shayantan.linkedinUrl === undefined, 'Shayantan Mondal has no invented LinkedIn URL');
const priyanshu = TEAM_MEMBERS.find(m => m.name.includes('Priyanshu'));
assert(priyanshu && priyanshu.linkedinUrl.includes('priyanshu-kumar-sinha'), 'Priyanshu has verified LinkedIn URL');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
