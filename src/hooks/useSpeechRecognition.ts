import { useState, useEffect, useRef, useCallback } from 'react';

// Declaration for SpeechRecognition if not in DOM typings
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeechRecognition(onResultCallback?: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const callbackRef = useRef(onResultCallback);

  useEffect(() => {
    callbackRef.current = onResultCallback;
  }, [onResultCallback]);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN'; // default

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript && callbackRef.current) {
          callbackRef.current(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        let message = 'Speech recognition error occurred.';
        if (event.error === 'not-allowed') {
          message = 'Microphone access denied. Please allow microphone permissions in your browser address bar.';
        } else if (event.error === 'no-speech') {
          message = 'No speech detected. Please speak closer to your microphone or check microphone volume.';
        } else if (event.error === 'audio-capture') {
          message = 'No microphone device was found. Please ensure a microphone is connected.';
        } else if (event.error === 'network') {
          message = 'Network error during voice recognition. Browser speech service requires an active internet connection.';
        } else {
          message = `Voice input error (${event.error || 'unknown'}). Please try again or type in the box.`;
        }
        setErrorMessage(message);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
      setErrorMessage('Speech recognition initialization failed in this browser environment.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const startListening = useCallback((langCode: string = 'en-IN') => {
    setErrorMessage(null);
    if (!isSupported) {
      setErrorMessage('Voice recognition is not supported in this browser. Please use Chrome, Edge, or enter text manually.');
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.lang = langCode;
        recognitionRef.current.start();
      } catch {
        // If already started, restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.lang = langCode;
              recognitionRef.current?.start();
            } catch {
              // Ignore
            }
          }, 100);
        } catch {
          setErrorMessage('Could not restart microphone. Please try again.');
        }
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsListening(false);
  }, []);

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    isListening,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    clearError
  };
}
