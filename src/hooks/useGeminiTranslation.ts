import { useState, useCallback, useRef } from 'react';

export interface TranslationResult {
  translation: string;
  phonetic?: string;
  detectedSource?: string;
  pedagogicalNote?: string;
  targetLanguage: string;
}

export function useGeminiTranslation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const activeRequestRef = useRef<AbortController | null>(null);

  const translate = useCallback(
    async (text: string, targetLanguage: string, sourceLanguageHint?: string) => {
      if (!text || !text.trim()) {
        setResult(null);
        setErrorMessage(null);
        setErrorCode(null);
        return;
      }

      // Cancel any ongoing fetch
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      const abortController = new AbortController();
      activeRequestRef.current = abortController;

      setIsLoading(true);
      setErrorMessage(null);
      setErrorCode(null);

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

        const data = await response.json();

        if (!response.ok || !data.success) {
          setErrorCode(data.errorCode || 'API_ERROR');
          setErrorMessage(
            data.error || 'Translation request failed. Please check backend service and API key.'
          );
          setResult(null);
        } else {
          setResult({
            translation: data.translation,
            phonetic: data.phonetic,
            detectedSource: data.detectedSource,
            pedagogicalNote: data.pedagogicalNote,
            targetLanguage: data.targetLanguage
          });
          setErrorMessage(null);
          setErrorCode(null);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
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
  }, []);

  return {
    translate,
    isLoading,
    result,
    errorMessage,
    errorCode,
    clearTranslation
  };
}
