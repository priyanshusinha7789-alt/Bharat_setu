import { useState, useCallback, useRef } from 'react';
import { findTranslation } from '../data/translations';
import { detectVisualFallback, VisualMetadata } from '../data/visualDetector';
import { LanguageId } from '../types';

export type { VisualMetadata };

export interface TranslationResult {
  translation: string;
  phonetic?: string;
  detectedSource?: string;
  pedagogicalNote?: string;
  targetLanguage: string;
  visual?: VisualMetadata;
  modelUsed?: string;
  keyId?: string;
}

export function useGeminiTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);
  const [quotaType, setQuotaType] = useState<'daily' | 'rpm' | 'tpm' | 'unknown' | null>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  const translate = useCallback(
    async (text: string, targetLanguage: string, sourceLanguageHint?: string) => {
      if (!text || !text.trim()) {
        setResult(null);
        setErrorMessage(null);
        setErrorCode(null);
        setRetryAfterSeconds(null);
        setQuotaType(null);
        return;
      }

      // Check offline verified curriculum sample fallback first for immediate resilience
      const offlineSample = findTranslation(text, targetLanguage as LanguageId);

      // Cancel any ongoing fetch
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      const abortController = new AbortController();
      activeRequestRef.current = abortController;

      setIsLoading(true);
      setErrorMessage(null);
      setErrorCode(null);
      setRetryAfterSeconds(null);
      setQuotaType(null);

      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            targetLanguage,
            sourceLanguageHint
          }),
          signal: abortController.signal
        });

        // If response is not JSON (e.g. HTML 404 on static deployment)
        const contentType = response.headers.get('content-type') || '';
        let data: any = null;
        if (contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // If non-JSON received (e.g. 404 from host without serverless functions)
          if (offlineSample.found) {
            const visual = detectVisualFallback(text, offlineSample.translationText);
            setResult({
              translation: offlineSample.translationText,
              phonetic: undefined,
              detectedSource: 'Curriculum Sample',
              pedagogicalNote: offlineSample.note || 'Verified primary curriculum translation from Bhasha Setu pedagogy database.',
              targetLanguage,
              visual,
              modelUsed: 'Curriculum Sample (Verified Offline)'
            });
            setErrorMessage(null);
            setErrorCode(null);
            return;
          }

          setErrorCode('API_ERROR');
          setErrorMessage('API endpoint /api/translate is not configured on this host. Please verify serverless API deployment and GEMINI_API_KEY.');
          setResult(null);
          return;
        }

        if (!response.ok || !data.success) {
          // If API call failed, but text is a curriculum sample sentence, fall back to offline sample
          if (offlineSample.found) {
            const visual = detectVisualFallback(text, offlineSample.translationText);
            setResult({
              translation: offlineSample.translationText,
              phonetic: undefined,
              detectedSource: 'Curriculum Sample',
              pedagogicalNote: offlineSample.note || 'Verified primary curriculum translation from Bhasha Setu pedagogy database.',
              targetLanguage,
              visual,
              modelUsed: 'Curriculum Sample (Verified Offline)'
            });
            setErrorMessage(null);
            setErrorCode(null);
            return;
          }

          setErrorCode(data.errorCode || 'API_ERROR');
          setErrorMessage(
            data.error || 'Translation request failed. Please check backend service and API key.'
          );
          setRetryAfterSeconds(data.retryAfterSeconds || null);
          setQuotaType(data.quotaType || null);
          setResult(null);
        } else {
          setResult({
            translation: data.translation,
            phonetic: data.phonetic,
            detectedSource: data.detectedSource,
            pedagogicalNote: data.pedagogicalNote,
            targetLanguage: data.targetLanguage,
            visual: data.visual,
            modelUsed: data.modelUsed,
            keyId: data.keyId
          });
          setErrorMessage(null);
          setErrorCode(null);
          setRetryAfterSeconds(null);
          setQuotaType(null);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;

        // If network error occurred, but text is a curriculum sample sentence, fall back to offline sample
        if (offlineSample.found) {
          const visual = detectVisualFallback(text, offlineSample.translationText);
          setResult({
            translation: offlineSample.translationText,
            phonetic: undefined,
            detectedSource: 'Curriculum Sample',
            pedagogicalNote: offlineSample.note || 'Verified primary curriculum translation from Bhasha Setu pedagogy database.',
            targetLanguage,
            visual,
            modelUsed: 'Curriculum Sample (Verified Offline)'
          });
          setErrorMessage(null);
          setErrorCode(null);
          return;
        }

        setErrorCode('NETWORK_ERROR');
        setErrorMessage('Could not connect to translation backend. Please ensure the server is running.');
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearTranslation = useCallback(() => {
    setResult(null);
    setErrorMessage(null);
    setErrorCode(null);
    setRetryAfterSeconds(null);
    setQuotaType(null);
  }, []);

  return {
    translate,
    isLoading,
    result,
    errorMessage,
    errorCode,
    retryAfterSeconds,
    quotaType,
    clearTranslation
  };
}
