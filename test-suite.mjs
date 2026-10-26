import { SAMPLE_SENTENCES, findTranslation, PENDING_VALIDATION_MESSAGE } from './src/data/translations.ts';
import { LANGUAGES } from './src/data/languages.ts';
import { TEAM_MEMBERS } from './src/data/team.ts';
import { translateWithGemini, detectVisualFallback } from './src/server/translateService.ts';
import { GeminiKeyManager } from './src/server/geminiKeyManager.ts';
import { RequestQueue, requestQueue } from './src/server/requestQueue.ts';

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
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

  // 3. Check arbitrary unmatched input in local data
  const arbitrary = findTranslation('Today is a rainy day in Ranchi.', 'hindi');
  assert(arbitrary.found === false, 'Arbitrary text marked as not found');
  assert(arbitrary.status === 'no_sample', 'Arbitrary text status is no_sample');
  assert(arbitrary.translationText.includes('No offline sample available'), 'Shows no offline sample available message');

  // 4. Check Team
  assert(TEAM_MEMBERS.length === 6, 'Contains exactly 6 team members');
  const shayantan = TEAM_MEMBERS.find(m => m.name.includes('Shayantan'));
  assert(shayantan && shayantan.linkedinUrl === undefined, 'Shayantan Mondal has no invented LinkedIn URL');
  assert(shayantan && shayantan.image === '/team/shayantan.jpg', 'Shayantan Mondal has photo');
  const ishan = TEAM_MEMBERS.find(m => m.name.includes('Ishan'));
  assert(ishan && ishan.image === '/team/ishan.jpg', 'Ishan Saha has photo');
  const priyanshu = TEAM_MEMBERS.find(m => m.name.includes('Priyanshu'));
  assert(priyanshu && priyanshu.linkedinUrl.includes('priyanshu-kumar-sinha'), 'Priyanshu has verified LinkedIn URL');

  // 5. Basic Validation & Error Handling
  console.log('\n--- Testing Gemini Backend Translation Service ---');

  // 5.1 Empty text check
  const emptyRes = await translateWithGemini({ text: '  ', targetLanguage: 'hindi' }, { skipQueue: true });
  assert(emptyRes.success === false && emptyRes.errorCode === 'INVALID_INPUT', 'Rejects empty text with INVALID_INPUT');

  // 5.2 Missing API key check (when keyManager has no keys)
  const emptyKm = new GeminiKeyManager([]);
  const noKeyRes = await translateWithGemini(
    { text: 'Plants need sunlight', targetLanguage: 'hindi' },
    { keyManager: emptyKm, skipQueue: true }
  );
  assert(noKeyRes.success === false && noKeyRes.errorCode === 'MISSING_API_KEY', 'Handles empty key pool with MISSING_API_KEY');

  // 5.3 Unsupported language check
  const dummyKm = new GeminiKeyManager(['mock_key_dummy_12345']);
  const badLangRes = await translateWithGemini(
    { text: 'Plants need sunlight', targetLanguage: 'klingon' },
    { keyManager: dummyKm, skipQueue: true }
  );
  assert(badLangRes.success === false && badLangRes.errorCode === 'UNSUPPORTED_LANGUAGE', 'Rejects unsupported language');

  // 6. Visual Learning Fallback Classifier
  console.log('\n--- Testing Visual Learning Classifier ---');
  const vPlant = detectVisualFallback('Plants need sunlight, water and carbon dioxide');
  assert(vPlant.visualType === 'plant_growth', 'Correctly classifies plant growth concept');

  const vWater = detectVisualFallback('Water changes into vapour when heated');
  assert(vWater.visualType === 'water_cycle', 'Correctly classifies water cycle & evaporation concept');

  const vTri = detectVisualFallback('A triangle has three sides');
  assert(vTri.visualType === 'triangle_geometry', 'Correctly classifies triangle geometry concept');

  const vTriMarathi = detectVisualFallback('triangle la teen baaju astat poranno');
  assert(vTriMarathi.visualType === 'triangle_geometry', 'Correctly classifies Marathi triangle concept');

  const vChat = detectVisualFallback('Hello kaise ho bhai, listen to me');
  assert(vChat.visualType === 'classroom_chat', 'Correctly classifies classroom dialogue / chat');

  // 7. Multi-Key Failover & Recovery Automated Unit Tests
  console.log('\n--- Testing Multi-Key Failover & Recovery (Mocked) ---');

  // Scenario 1: First-key rate limit (429) followed by second-key success
  {
    console.log('\n[Scenario 1] First-key rate limit -> second-key success');
    const km = new GeminiKeyManager(['key_first_rate_limit_111', 'key_second_success_222']);
    const callLog = [];

    const mockExecutor = async (apiKey, model) => {
      callLog.push({ apiKey, model });
      if (apiKey === 'key_first_rate_limit_111') {
        const err = new Error('RESOURCE_EXHAUSTED: Quota exceeded. retryDelay: 2s');
        err.status = 429;
        throw err;
      }
      return JSON.stringify({
        translation: 'উদ্ভিদের সূর্যালোক ও জল প্রয়োজন',
        visual: { visualType: 'plant_growth', conceptTitle: 'Photosynthesis', keyElements: ['Sunlight', 'Water'] }
      });
    };

    const res = await translateWithGemini(
      { text: 'Plants need sunlight and water', targetLanguage: 'bengali' },
      { keyManager: km, mockExecutor, skipQueue: true }
    );

    assert(res.success === true, 'Scenario 1: Request succeeded');
    assert(res.keyId === 'key_2', 'Scenario 1: Used key_2 after key_1 failover');
    assert(res.translation === 'উদ্ভিদের সূর্যালোক ও জল প্রয়োজন', 'Scenario 1: Correct translation output');

    const diag = km.getDiagnostics();
    assert(diag.pool[0].state === 'rate_limited', 'Scenario 1: key_1 marked as rate_limited');
    assert(diag.pool[1].state === 'active' && diag.pool[1].successCount === 1, 'Scenario 1: key_2 active with success count 1');
  }

  // Scenario 2: All keys exhausted with short-term RPM rate limit
  {
    console.log('\n[Scenario 2] All keys exhausted (429 / RPM)');
    const km = new GeminiKeyManager(['exhausted_key_111', 'exhausted_key_222']);

    const mockExecutor = async () => {
      const err = new Error('RESOURCE_EXHAUSTED: Rate limit exceeded (requests per minute). Please retry in 15s');
      err.status = 429;
      throw err;
    };

    const res = await translateWithGemini(
      { text: 'Water changes into vapour', targetLanguage: 'hindi' },
      { keyManager: km, mockExecutor, skipQueue: true }
    );

    assert(res.success === false, 'Scenario 2: Request gracefully reported failure');
    assert(res.errorCode === 'QUOTA_EXCEEDED', 'Scenario 2: Error code is QUOTA_EXCEEDED');
    assert(res.quotaType === 'rpm', 'Scenario 2: Quota type identified as rpm');
    assert(res.retryAfterSeconds !== undefined && res.retryAfterSeconds > 0, 'Scenario 2: Returns valid retryAfterSeconds');

    const diag = km.getDiagnostics();
    assert(diag.status === 'unhealthy', 'Scenario 2: Diagnostics status is unhealthy when all keys exhausted');
    assert(diag.keys.active === 0 && diag.keys.coolingDown === 2, 'Scenario 2: Zero active keys, 2 cooling down');
  }

  // Scenario 3: Invalid key handling (quarantine, no redundant retries)
  {
    console.log('\n[Scenario 3] Invalid key (401) quarantined with no redundant retries');
    const km = new GeminiKeyManager(['invalid_bad_key_000', 'healthy_good_key_999']);
    let badKeyAttempts = 0;

    const mockExecutor = async (apiKey) => {
      if (apiKey === 'invalid_bad_key_000') {
        badKeyAttempts++;
        const err = new Error('API_KEY_INVALID: API key not valid. Please pass a valid API key.');
        err.status = 401;
        throw err;
      }
      return JSON.stringify({
        translation: 'एक त्रिभुज की तीन भुजाएँ होती हैं',
        visual: { visualType: 'triangle_geometry', conceptTitle: 'Triangle', keyElements: ['3 sides'] }
      });
    };

    const res = await translateWithGemini(
      { text: 'A triangle has three sides', targetLanguage: 'hindi' },
      { keyManager: km, mockExecutor, skipQueue: true }
    );

    assert(res.success === true, 'Scenario 3: Request succeeded with valid key');
    assert(res.keyId === 'key_2', 'Scenario 3: Used key_2');
    assert(badKeyAttempts === 1, `Scenario 3: Bad key was queried exactly 1 time without redundant retries (actual: ${badKeyAttempts})`);

    const diag = km.getDiagnostics();
    assert(diag.pool[0].state === 'invalid', 'Scenario 3: Bad key state is permanently invalid');
    const availableAfter = km.getAvailableKeys();
    assert(availableAfter.length === 1 && availableAfter[0].id === 'key_2', 'Scenario 3: Invalid key excluded from available pool');
  }

  // Scenario 4: Temporary server failure (5xx) with bounded retry, jitter, and recovery
  {
    console.log('\n[Scenario 4] Temporary server failure (503/500) with bounded retries and jitter');
    const km = new GeminiKeyManager(['transient_server_key_777']);
    let attempts = 0;

    const mockExecutor = async () => {
      attempts++;
      if (attempts === 1) {
        const err = new Error('UNAVAILABLE: The service is temporarily overloaded');
        err.status = 503;
        throw err;
      }
      if (attempts === 2) {
        const err = new Error('INTERNAL: An internal error occurred');
        err.status = 500;
        throw err;
      }
      return JSON.stringify({
        translation: 'উদ্ভিদ সূর্যের আলো পায়',
        visual: { visualType: 'plant_growth', conceptTitle: 'Plant', keyElements: ['Light'] }
      });
    };

    const res = await translateWithGemini(
      { text: 'Plants receive sunlight', targetLanguage: 'bengali' },
      { keyManager: km, mockExecutor, maxTransientRetries: 2, initialBackoffMs: 15, skipQueue: true }
    );

    assert(res.success === true, 'Scenario 4: Request recovered and succeeded');
    assert(attempts === 3, `Scenario 4: Succeeded on attempt 3 after 2 transient backoff retries (actual: ${attempts})`);
    assert(res.translation === 'উদ্ভিদ সূর্যের আলো পায়', 'Scenario 4: Translation matches output');
  }

  // Scenario 5: Key restoration after cooldown expiry
  {
    console.log('\n[Scenario 5] Key restoration after cooldown expiry');
    const km = new GeminiKeyManager(['recovering_key_888']);
    
    km.markRateLimited('key_1', 50, { quotaType: 'rpm' });

    let availableNow = km.getAvailableKeys();
    assert(availableNow.length === 0, 'Scenario 5: Key is not available during active cooldown');

    await sleep(70);

    let availableAfter = km.getAvailableKeys();
    assert(availableAfter.length === 1, 'Scenario 5: Key automatically restored to available pool after cooldown elapsed');

    const mockExecutor = async () => {
      return JSON.stringify({
        translation: 'গরম করলে জল বাষ্প হয়',
        visual: { visualType: 'water_cycle', conceptTitle: 'Vapour', keyElements: ['Vapour'] }
      });
    };

    const res = await translateWithGemini(
      { text: 'Water boils into vapour', targetLanguage: 'bengali' },
      { keyManager: km, mockExecutor, skipQueue: true }
    );

    assert(res.success === true, 'Scenario 5: Recovered key successfully translated request');
    assert(res.keyId === 'key_1', 'Scenario 5: Used key_1');
  }

  // Scenario 6: Google Daily Quota Exhaustion (20 requests/day per project)
  {
    console.log('\n[Scenario 6] Google Daily Quota Exhaustion (GenerateRequestsPerDayPerProjectPerModel-FreeTier)');
    const km = new GeminiKeyManager(['daily_exhausted_key_333']);

    const googleDailyErrorPayload = {
      error: {
        code: 429,
        message: 'You exceeded your current quota. Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 20, model: gemini-3.8-flash',
        status: 'RESOURCE_EXHAUSTED',
        details: [
          {
            '@type': 'type.googleapis.com/google.rpc.QuotaFailure',
            violations: [
              {
                quotaMetric: 'generativelanguage.googleapis.com/generate_content_free_tier_requests',
                quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier',
                quotaDimensions: { model: 'gemini-3.8-flash', location: 'global' },
                quotaValue: '20'
              }
            ]
          },
          {
            '@type': 'type.googleapis.com/google.rpc.RetryInfo',
            retryDelay: '6s'
          },
          {
            '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
            metadata: { consumer: 'projects/987654321' }
          }
        ]
      }
    };

    const mockExecutor = async () => {
      const err = new Error(JSON.stringify(googleDailyErrorPayload));
      err.status = 429;
      err.error = googleDailyErrorPayload.error;
      throw err;
    };

    const res = await translateWithGemini(
      { text: 'Water evaporates into vapour', targetLanguage: 'hindi' },
      { keyManager: km, mockExecutor, skipQueue: true }
    );

    assert(res.success === false, 'Scenario 6: Correctly rejected when daily quota exhausted');
    assert(res.errorCode === 'QUOTA_EXCEEDED', 'Scenario 6: Error code is QUOTA_EXCEEDED');
    assert(res.quotaType === 'daily', 'Scenario 6: Correctly identified as quotaType daily');
    assert(res.error.includes('Daily Gemini API request quota exhausted'), 'Scenario 6: Explains daily quota exhaustion');
    assert(!res.error.includes('retry in ~6 seconds') && !res.error.includes('retry in ~50 seconds'),
           'Scenario 6: Does NOT falsely promise recovery in 6 or 50 seconds');

    const diag = km.getDiagnostics();
    assert(diag.pool[0].state === 'daily_quota_exhausted', 'Scenario 6: Key marked as daily_quota_exhausted');
    assert(diag.keys.dailyExhausted === 1, 'Scenario 6: Diagnostic count reflects 1 dailyExhausted key');
    assert(diag.notes.some(n => n.includes('Daily quota exhausted')), 'Scenario 6: Diagnostic notes record daily quota reset at midnight PT');
  }

  // Scenario 7: Server-Side Request Queue, Deduplication & Cache
  {
    console.log('\n[Scenario 7] Server-Side Request Queue & Duplicate Deduplication');
    const queue = new RequestQueue({ maxConcurrency: 1, minSpacingMs: 20 });
    let upstreamCallCount = 0;

    const mockTask = async () => {
      upstreamCallCount++;
      await sleep(30);
      return { success: true, translation: 'Deduplicated Translation' };
    };

    const key = RequestQueue.makeKey('Hello children', 'hindi');

    // Launch two simultaneous identical calls (simulating rapid double clicks)
    const [callA, callB] = await Promise.all([
      queue.execute(key, mockTask),
      queue.execute(key, mockTask)
    ]);

    assert(callA.translation === 'Deduplicated Translation', 'Scenario 7: First call returned valid translation');
    assert(callB.translation === 'Deduplicated Translation', 'Scenario 7: Second simultaneous call joined and received same result');
    assert(upstreamCallCount === 1, `Scenario 7: Upstream task called exactly 1 time for simultaneous duplicate clicks (actual: ${upstreamCallCount})`);

    // Third call right after should hit TTL cache
    const callC = await queue.execute(key, mockTask);
    assert(callC.translation === 'Deduplicated Translation', 'Scenario 7: Third sequential call hit cache');
    assert(upstreamCallCount === 1, 'Scenario 7: Upstream task still only called 1 time due to cache hit');
    assert(queue.cacheHits >= 1, 'Scenario 7: Cache hits counter incremented');
  }

  // Scenario 8: Shared Google Cloud Project Detection
  {
    console.log('\n[Scenario 8] Shared Project Quota Detection');
    const km = new GeminiKeyManager(['key_proj_a_1', 'key_proj_a_2']);
    
    // Simulate both keys failing with the same project metadata
    km.markRateLimited('key_1', undefined, {
      quotaType: 'daily',
      quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier',
      projectId: 'projects/my-shared-project-123'
    });
    km.markRateLimited('key_2', undefined, {
      quotaType: 'daily',
      quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier',
      projectId: 'projects/my-shared-project-123'
    });

    const diag = km.getDiagnostics();
    assert(diag.sharedProjectDetected === true, 'Scenario 8: Detected that both keys share the same project');
    assert(diag.notes.some(n => n.includes('share the same Google Cloud Project')),
           'Scenario 8: Reports note that keys under same project draw from same quota');
  }

  // 9. Security Check: Masking
  console.log('\n--- Testing Security & Masking ---');
  const secretKey = 'mock_secret_test_key_for_masking_verification_7890';
  const masked = GeminiKeyManager.maskKey(secretKey);
  assert(masked === '...7890', `Key is securely masked as ...7890 (actual: ${masked})`);
  assert(!masked.includes('mock_secret_test_key'), 'Masked key never exposes secret prefix or body');

  const singleKm = new GeminiKeyManager([secretKey]);
  const diagSecret = singleKm.getDiagnostics();
  const diagJson = JSON.stringify(diagSecret);
  assert(!diagJson.includes(secretKey), 'Diagnostics endpoint JSON does not contain unmasked secret key');

  console.log(`\n========================================`);
  console.log(`Final Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
}

runTests();
