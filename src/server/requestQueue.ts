export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface QueueItem<T> {
  task: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
  addedAt: number;
}

export class RequestQueue {
  private inFlightRequests: Map<string, Promise<any>> = new Map();
  private responseCache: Map<string, CacheEntry<any>> = new Map();
  private queue: Array<QueueItem<any>> = [];
  private activeCount = 0;
  private maxConcurrency: number;
  private minSpacingMs: number;
  private lastRequestEndTime = 0;
  private cacheTtlMs: number;
  private maxCacheSize: number;

  // Diagnostics counters
  public cacheHits = 0;
  public totalRequests = 0;
  public deduplicatedRequests = 0;

  constructor(options?: {
    maxConcurrency?: number;
    minSpacingMs?: number;
    cacheTtlMs?: number;
    maxCacheSize?: number;
  }) {
    this.maxConcurrency = options?.maxConcurrency ?? 1;
    this.minSpacingMs = options?.minSpacingMs ?? 400; // minimum spacing between upstream calls
    this.cacheTtlMs = options?.cacheTtlMs ?? 5 * 60 * 1000; // 5 minutes cache
    this.maxCacheSize = options?.maxCacheSize ?? 200;
  }

  /**
   * Generates a normalized cache & deduplication key for a translation request
   */
  public static makeKey(text: string, targetLanguage: string, sourceHint?: string): string {
    const normText = (text || '').trim().toLowerCase().replace(/\s+/g, ' ');
    const normLang = (targetLanguage || '').trim().toLowerCase();
    const normHint = (sourceHint || '').trim().toLowerCase();
    return `${normLang}::${normHint}::${normText}`;
  }

  /**
   * Executes a task with deduplication, caching, and concurrency queueing
   */
  public async execute<T>(
    cacheKey: string,
    task: () => Promise<T>,
    options?: { skipCache?: boolean }
  ): Promise<T> {
    this.totalRequests++;

    // 1. Check in-memory TTL cache if not skipped
    if (!options?.skipCache) {
      const cached = this.responseCache.get(cacheKey);
      if (cached) {
        if (Date.now() < cached.expiresAt) {
          this.cacheHits++;
          return cached.data;
        } else {
          this.responseCache.delete(cacheKey);
        }
      }
    }

    // 2. Check if an identical request is already actively in-flight
    const existingInFlight = this.inFlightRequests.get(cacheKey);
    if (existingInFlight) {
      this.deduplicatedRequests++;
      return existingInFlight;
    }

    // 3. Create managed in-flight promise and enqueue
    const promise = new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        addedAt: Date.now()
      });
      this.processQueue();
    });

    this.inFlightRequests.set(cacheKey, promise);

    try {
      const result = await promise;
      // Cache successful responses only (if has valid translation)
      if (result && (result as any).success !== false) {
        this.setCache(cacheKey, result);
      }
      return result;
    } finally {
      this.inFlightRequests.delete(cacheKey);
    }
  }

  private setCache<T>(key: string, data: T): void {
    if (this.responseCache.size >= this.maxCacheSize) {
      // Evict oldest entry
      const firstKey = this.responseCache.keys().next().value;
      if (firstKey) this.responseCache.delete(firstKey);
    }
    this.responseCache.set(key, {
      data,
      expiresAt: Date.now() + this.cacheTtlMs
    });
  }

  private async processQueue(): Promise<void> {
    if (this.activeCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    // Enforce minimum spacing between consecutive upstream API calls to prevent RPM bursts
    const now = Date.now();
    const timeSinceLast = now - this.lastRequestEndTime;
    if (timeSinceLast < this.minSpacingMs) {
      const waitTime = this.minSpacingMs - timeSinceLast;
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.activeCount++;

    try {
      const result = await item.task();
      item.resolve(result);
    } catch (err) {
      item.reject(err);
    } finally {
      this.activeCount--;
      this.lastRequestEndTime = Date.now();
      // Schedule next item in queue
      setTimeout(() => this.processQueue(), this.minSpacingMs);
    }
  }

  public clearCache(): void {
    this.responseCache.clear();
  }

  public getStats() {
    return {
      activeConcurrency: this.activeCount,
      queuedRequests: this.queue.length,
      inFlightDeduplicated: this.inFlightRequests.size,
      cachedEntries: this.responseCache.size,
      cacheHits: this.cacheHits,
      totalRequests: this.totalRequests,
      deduplicatedCount: this.deduplicatedRequests
    };
  }
}

export const requestQueue = new RequestQueue();
