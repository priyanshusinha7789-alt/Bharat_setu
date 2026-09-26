import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    setIsSpeaking(false);
    setTtsNotice(null);
  }, []);

  const speak = useCallback(
    (text: string, voiceCode: string = 'hi-IN', languageName: string = 'Hindi') => {
      setTtsNotice(null);

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setIsSupported(false);
        setTtsNotice('Speech synthesis is not supported on this browser device.');
        return;
      }

      if (!text || text.trim() === '') {
        setTtsNotice('No translated text available to read aloud.');
        return;
      }

      try {
        // Cancel any ongoing speech first as required
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        currentUtteranceRef.current = utterance;

        // Try to match available voices
        const availableVoices = window.speechSynthesis.getVoices();
        let selectedVoice = availableVoices.find(
          v => v.lang.toLowerCase() === voiceCode.toLowerCase()
        );

        if (!selectedVoice) {
          // Try matching language prefix e.g. 'hi' or 'bn'
          const prefix = voiceCode.split('-')[0].toLowerCase();
          selectedVoice = availableVoices.find(v =>
            v.lang.toLowerCase().startsWith(prefix)
          );
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          // If no specific localized voice is found
          utterance.lang = voiceCode;
          if (voiceCode !== 'hi-IN' && voiceCode !== 'bn-IN') {
            setTtsNotice(
              `Standard Web TTS voice for ${languageName} is not pre-installed on this OS. Attempting phoneme fallback playback.`
            );
          }
        }

        utterance.rate = 0.9; // Slightly slower for primary school clarity
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
        };

        utterance.onerror = (e) => {
          setIsSpeaking(false);
          currentUtteranceRef.current = null;
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            setTtsNotice(`Audio playback notice: ${e.error || 'Voice synthesis unavailable on this device.'}`);
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch (err: any) {
        setIsSpeaking(false);
        setTtsNotice('Unable to play audio utterance. Browser audio subsystem error.');
      }
    },
    []
  );

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    ttsNotice,
    clearNotice: () => setTtsNotice(null)
  };
}
