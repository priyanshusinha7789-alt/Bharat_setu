import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export type KeyState = 'active' | 'rate_limited' | 'daily_quota_exhausted' | 'invalid' | 'permission_denied';

export interface KeyEntry {
  id: string; // e.g. "key_1", "key_2"
  key: string; // Actual key in server memory
  masked: string; // e.g. "...5RNg"
  state: KeyState;
  quotaType?: 'daily' | 'rpm' | 'tpm' | 'unknown';
  projectId?: string;
  quotaId?: string;
  cooldownUntil: number; // Unix timestamp in ms
  consecutiveFailures: number;
  successCount: number;
  failureCount: number;
  lastUsedAt: number | null;
  lastError: string | null;
}

export interface KeyPoolDiagnostics {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptimeSeconds: number;
  keys: {
    total: number;
    active: number;
    coolingDown: number;
    dailyExhausted: number;
    quarantined: number;
  };
  pool: Array<{
    id: string;
    state: KeyState;
    quotaType?: 'daily' | 'rpm' | 'tpm' | 'unknown';
    projectId?: string;
    consecutiveFailures: number;
    successCount: number;
    cooldownRemainingSeconds?: number;
    lastUsedAgoSeconds?: number;
    lastError?: string | null;
  }>;
  supportedModels: string[];
  sharedProjectDetected: boolean;
  notes: string[];
}

export interface CategorizedError {
  type: 'rate_limit' | 'daily_quota' | 'invalid_key' | 'permission_denied' | 'transient_server' | 'other';
  quotaType?: 'daily' | 'rpm' | 'tpm' | 'unknown';
  retryAfterMs?: number;
  quotaMetric?: string;
  quotaId?: string;
  quotaLimit?: string;
  projectId?: string;
  message: string;
}

export class GeminiKeyManager {
  private keys: Map<string, KeyEntry> = new Map();
  private defaultRpmCooldownMs = 30000; // 30 seconds default for RPM
  private dailyCooldownMs = 12 * 3600 * 1000; // 12 hours for daily exhaustion
  private modelsHierarchy = [
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite'
  ];

  constructor(customKeys?: string[]) {
    if (customKeys !== undefined) {
      this.initKeys(customKeys);
    } else {
      this.reloadFromEnv();
    }
  }

  /**
   * Safe mask of an API key for logs and diagnostics (e.g. "...5RNg").
   * Never prints or leaks full key.
   */
  public static maskKey(key: string): string {
    if (!key || key.length < 8) return '***';
    return `...${key.slice(-4)}`;
  }

  /**
   * Initializes keys into the pool
   */
  public initKeys(keysList: string[]): void {
    this.keys.clear();
    const seen = new Set<string>();
    let index = 1;

    for (const raw of keysList) {
      const trimmed = (raw || '').trim();
      if (
        !trimmed ||
        trimmed.startsWith('your_') ||
        trimmed.includes('api_key_here') ||
        seen.has(trimmed)
      ) {
        continue;
      }

      seen.add(trimmed);
      const id = `key_${index}`;
      this.keys.set(id, {
        id,
        key: trimmed,
        masked: GeminiKeyManager.maskKey(trimmed),
        state: 'active',
        cooldownUntil: 0,
        consecutiveFailures: 0,
        successCount: 0,
        failureCount: 0,
        lastUsedAt: null,
        lastError: null
      });
      index++;
    }
  }

  /**
   * Reload keys from process.env (supporting GEMINI_API_KEY_1, GEMINI_API_KEY_2, ..., GEMINI_API_KEY)
   */
  public reloadFromEnv(env: Record<string, string | undefined> = process.env): void {
    const collected: string[] = [];

    // 1. Scan for indexed keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, GEMINI_API_KEY_3...
    const indexedEntries: Array<{ num: number; key: string }> = [];
    for (const [name, val] of Object.entries(env)) {
      if (!val) continue;
      const match = name.match(/^GEMINI_API_KEY_(\d+)$/i);
      if (match) {
        indexedEntries.push({ num: parseInt(match[1], 10), key: val });
      }
    }
    indexedEntries.sort((a, b) => a.num - b.num);
    for (const item of indexedEntries) {
      collected.push(item.key);
    }

    // 2. Scan standard legacy GEMINI_API_KEY
    if (env.GEMINI_API_KEY) {
      collected.push(env.GEMINI_API_KEY);
    }

    // 3. Scan comma-separated GEMINI_API_KEYS if present
    if (env.GEMINI_API_KEYS) {
      const parts = env.GEMINI_API_KEYS.split(',');
      for (const p of parts) {
        collected.push(p);
      }
    }

    this.initKeys(collected);
  }

  public hasKeys(): boolean {
    return this.keys.size > 0;
  }

  public getKeyCount(): number {
    return this.keys.size;
  }

  public getModels(): string[] {
    return [...this.modelsHierarchy];
  }

  /**
   * Returns list of currently available keys for execution.
   * Auto-recovers any rate-limited keys whose cooldown timer has expired.
   */
  public getAvailableKeys(): KeyEntry[] {
    const now = Date.now();
    const available: KeyEntry[] = [];

    for (const entry of this.keys.values()) {
      if (entry.state === 'invalid' || entry.state === 'permission_denied') {
        continue;
      }

      if (entry.state === 'rate_limited' || entry.state === 'daily_quota_exhausted') {
        if (now >= entry.cooldownUntil) {
          entry.state = 'active';
          entry.cooldownUntil = 0;
          entry.quotaType = undefined;
          available.push(entry);
        }
      } else if (entry.state === 'active') {
        available.push(entry);
      }
    }

    return available;
  }

  public getRemainingCooldownSeconds(entry: KeyEntry): number {
    if (entry.state !== 'rate_limited' && entry.state !== 'daily_quota_exhausted') return 0;
    const diff = entry.cooldownUntil - Date.now();
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  }

  public getShortestRemainingCooldownSeconds(): number {
    let minSeconds = Infinity;
    const now = Date.now();
    for (const entry of this.keys.values()) {
      if (
        (entry.state === 'rate_limited' || entry.state === 'daily_quota_exhausted') &&
        entry.cooldownUntil > now
      ) {
        const remaining = Math.ceil((entry.cooldownUntil - now) / 1000);
        if (remaining < minSeconds) minSeconds = remaining;
      }
    }
    return minSeconds === Infinity ? 0 : minSeconds;
  }

  /**
   * Checks if all rate-limited/exhausted keys are due to daily quota exhaustion
   */
  public isDailyQuotaExhaustedPool(): boolean {
    let dailyCount = 0;
    let totalLimited = 0;
    for (const entry of this.keys.values()) {
      if (entry.state === 'daily_quota_exhausted' || entry.quotaType === 'daily') {
        dailyCount++;
        totalLimited++;
      } else if (entry.state === 'rate_limited') {
        totalLimited++;
      }
    }
    return totalLimited > 0 && dailyCount === totalLimited;
  }

  /**
   * Marks a key as rate-limited (HTTP 429 / RESOURCE_EXHAUSTED).
   */
  public markRateLimited(
    id: string,
    customDelayMs?: number,
    quotaInfo?: { quotaType?: 'daily' | 'rpm' | 'tpm' | 'unknown'; quotaId?: string; projectId?: string }
  ): void {
    const entry = this.keys.get(id);
    if (!entry) return;

    entry.consecutiveFailures += 1;
    entry.failureCount += 1;

    if (quotaInfo?.projectId) entry.projectId = quotaInfo.projectId;
    if (quotaInfo?.quotaId) entry.quotaId = quotaInfo.quotaId;

    if (quotaInfo?.quotaType === 'daily') {
      entry.state = 'daily_quota_exhausted';
      entry.quotaType = 'daily';
      entry.cooldownUntil = Date.now() + this.dailyCooldownMs;
      entry.lastError = `Daily quota exhausted (${quotaInfo.quotaId || 'PerDay'}). Resets at midnight Pacific Time.`;
      console.warn(
        `[BHASHA SETU Auth] ${entry.id} (${entry.masked}) daily quota exhausted. Marked daily_quota_exhausted.`
      );
      return;
    }

    entry.state = 'rate_limited';
    entry.quotaType = quotaInfo?.quotaType || 'rpm';

    let delayMs = customDelayMs;
    if (!delayMs || delayMs <= 0) {
      delayMs = Math.min(
        this.defaultRpmCooldownMs * Math.pow(1.5, Math.max(0, entry.consecutiveFailures - 1)),
        300000 // 5 minutes max for RPM
      );
    }

    entry.cooldownUntil = Date.now() + delayMs;
    entry.lastError = `Rate limit (429 / RPM). Cooldown: ${Math.ceil(delayMs / 1000)}s`;

    console.warn(
      `[BHASHA SETU Auth] Failover: ${entry.id} (${entry.masked}) rate-limited (429). Cooldown: ${Math.ceil(
        delayMs / 1000
      )}s.`
    );
  }

  public markInvalid(id: string, errorMsg: string): void {
    const entry = this.keys.get(id);
    if (!entry) return;

    entry.state = 'invalid';
    entry.failureCount += 1;
    entry.lastError = `Invalid API key (401): ${errorMsg}`;
    console.error(`[BHASHA SETU Auth] Quarantined ${entry.id} (${entry.masked}): Invalid API key.`);
  }

  public markPermissionDenied(id: string, errorMsg: string): void {
    const entry = this.keys.get(id);
    if (!entry) return;

    entry.state = 'permission_denied';
    entry.failureCount += 1;
    entry.lastError = `Permission denied (403): ${errorMsg}`;
    console.error(`[BHASHA SETU Auth] Quarantined ${entry.id} (${entry.masked}): Permission denied.`);
  }

  public markSuccess(id: string): void {
    const entry = this.keys.get(id);
    if (!entry) return;

    entry.consecutiveFailures = 0;
    entry.successCount += 1;
    entry.lastUsedAt = Date.now();
    entry.lastError = null;
    entry.state = 'active';
    entry.quotaType = undefined;
  }

  /**
   * Categorizes errors to decide retry / failover / quarantine actions and extracts detailed quota info
   */
  public static categorizeError(err: any): CategorizedError {
    const msg = String(err?.message || err?.error?.message || err || '');
    const status = err?.status || err?.statusCode || (err?.error && err.error.code);

    let parsedPayload: any = null;
    try {
      if (err?.error?.details) parsedPayload = err.error;
      else if (err?.details) parsedPayload = err;
      else {
        const jsonStart = msg.indexOf('{');
        if (jsonStart !== -1) {
          const parsed = JSON.parse(msg.slice(jsonStart));
          parsedPayload = parsed.error || parsed;
        }
      }
    } catch {}

    const details: any[] = parsedPayload?.details || [];
    const quotaFailure = details.find((d: any) => d['@type']?.includes('QuotaFailure'));
    const violation = quotaFailure?.violations?.[0];
    const retryInfo = details.find((d: any) => d['@type']?.includes('RetryInfo'));
    const errorInfo = details.find((d: any) => d['@type']?.includes('ErrorInfo'));

    const quotaId: string | undefined = violation?.quotaId;
    const quotaMetric: string | undefined = violation?.quotaMetric;
    const quotaLimit: string | undefined = violation?.quotaValue;
    const projectId: string | undefined = errorInfo?.metadata?.consumer;

    let retryAfterMs: number | undefined;
    if (retryInfo?.retryDelay) {
      const match = String(retryInfo.retryDelay).match(/([\d.]+)s?/i);
      if (match) retryAfterMs = Math.ceil(parseFloat(match[1]) * 1000);
    }
    if (!retryAfterMs) {
      const matchText = msg.match(/retry in\s+([\d.]+)s/i);
      if (matchText) retryAfterMs = Math.ceil(parseFloat(matchText[1]) * 1000);
    }

    if (
      status === 429 ||
      msg.includes('RESOURCE_EXHAUSTED') ||
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('Rate limit')
    ) {
      const isDaily = Boolean(
        quotaId?.includes('PerDay') ||
        quotaMetric?.includes('free_tier_requests') ||
        msg.includes('requests per day') ||
        msg.includes('PerDayPerProject') ||
        msg.includes('daily')
      );

      const isRpm = Boolean(
        quotaId?.includes('PerMinute') ||
        quotaMetric?.includes('requests_per_minute') ||
        msg.includes('requests per minute')
      );

      const isTpm = Boolean(
        quotaId?.includes('TokensPerMinute') ||
        quotaMetric?.includes('tokens_per_minute') ||
        msg.includes('tokens')
      );

      const quotaType: 'daily' | 'rpm' | 'tpm' | 'unknown' = isDaily
        ? 'daily'
        : isRpm
        ? 'rpm'
        : isTpm
        ? 'tpm'
        : 'unknown';

      return {
        type: isDaily ? 'daily_quota' : 'rate_limit',
        quotaType,
        retryAfterMs,
        quotaId,
        quotaMetric,
        quotaLimit,
        projectId,
        message: msg
      };
    }

    if (
      status === 401 ||
      msg.includes('API_KEY_INVALID') ||
      msg.includes('invalid api key') ||
      msg.includes('API key not valid')
    ) {
      return {
        type: 'invalid_key',
        message: msg
      };
    }

    if (status === 403 || msg.includes('PERMISSION_DENIED') || msg.includes('forbidden')) {
      return {
        type: 'permission_denied',
        message: msg
      };
    }

    if (
      status === 500 ||
      status === 503 ||
      status === 502 ||
      status === 504 ||
      msg.includes('INTERNAL') ||
      msg.includes('UNAVAILABLE') ||
      msg.includes('timeout') ||
      msg.includes('ETIMEDOUT') ||
      msg.includes('ECONNRESET') ||
      msg.includes('FETCH_ERROR') ||
      msg.includes('ENOTFOUND')
    ) {
      return {
        type: 'transient_server',
        message: msg
      };
    }

    return {
      type: 'other',
      message: msg
    };
  }

  /**
   * Detects if multiple configured keys share the same Google Cloud project
   */
  public checkSharedProjects(): { shared: boolean; notes: string[] } {
    const notes: string[] = [];
    const projectIds = new Set<string>();
    let dailyExhaustedCount = 0;

    for (const entry of this.keys.values()) {
      if (entry.projectId) projectIds.add(entry.projectId);
      if (entry.state === 'daily_quota_exhausted') dailyExhaustedCount++;
    }

    let shared = false;
    if (projectIds.size > 0 && this.keys.size > 1 && projectIds.size === 1) {
      shared = true;
      notes.push('All configured keys share the same Google Cloud Project ID. Multiple keys under the same project draw from the same quota.');
    }

    if (dailyExhaustedCount > 1 && this.keys.size > 1) {
      shared = true;
      notes.push('Multiple keys failed simultaneously with project-level daily quota exhaustion (GenerateRequestsPerDayPerProjectPerModel-FreeTier).');
    }

    return { shared, notes };
  }

  /**
   * Generates public health and diagnostics report without exposing secret keys
   */
  public getDiagnostics(): KeyPoolDiagnostics {
    const now = Date.now();
    let active = 0;
    let coolingDown = 0;
    let dailyExhausted = 0;
    let quarantined = 0;

    const pool = Array.from(this.keys.values()).map((entry) => {
      let currentState = entry.state;
      let remainingSec: number | undefined;

      if (currentState === 'rate_limited' || currentState === 'daily_quota_exhausted') {
        if (now >= entry.cooldownUntil) {
          currentState = 'active';
        } else {
          remainingSec = Math.ceil((entry.cooldownUntil - now) / 1000);
        }
      }

      if (currentState === 'active') active++;
      else if (currentState === 'daily_quota_exhausted') dailyExhausted++;
      else if (currentState === 'rate_limited') coolingDown++;
      else quarantined++;

      return {
        id: entry.id,
        state: currentState,
        quotaType: entry.quotaType,
        projectId: entry.projectId,
        consecutiveFailures: entry.consecutiveFailures,
        successCount: entry.successCount,
        cooldownRemainingSeconds: remainingSec,
        lastUsedAgoSeconds: entry.lastUsedAt ? Math.round((now - entry.lastUsedAt) / 1000) : undefined,
        lastError: entry.lastError
      };
    });

    const sharedCheck = this.checkSharedProjects();
    const notes = [...sharedCheck.notes];

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (this.keys.size === 0 || active === 0) {
      status = 'unhealthy';
    } else if (coolingDown > 0 || dailyExhausted > 0 || quarantined > 0) {
      status = 'degraded';
    }

    if (dailyExhausted > 0) {
      notes.push('Daily quota exhausted for free-tier project (limit: 20 requests/day for gemini-3.8-flash). Quota resets at midnight Pacific Time.');
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      keys: {
        total: this.keys.size,
        active,
        coolingDown,
        dailyExhausted,
        quarantined
      },
      pool,
      supportedModels: this.modelsHierarchy,
      sharedProjectDetected: sharedCheck.shared,
      notes
    };
  }
}

// Export singleton instance initialized from process.env
export const geminiKeyManager = new GeminiKeyManager();
