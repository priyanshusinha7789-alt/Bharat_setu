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
      recognition.lang = 'en-IN'; // As specified: en-IN

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        if (transcript) {
          if (onResultCallback) {
            onResultCallback(transcript);
          }
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        let message = 'Speech recognition error occurred.';
        if (event.error === 'not-allowed') {
          message = 'Microphone access denied. Please grant microphone permission in your browser settings.';
        } else if (event.error === 'no-speech') {
          message = 'No speech was detected. Please try speaking closer to your microphone or click a sample card.';
        } else if (event.error === 'network') {
          message = 'Network error during voice recognition. Please check connection or use the sample cards.';
        } else {
          message = `Voice error: ${event.error || 'recognition interrupted'}. Please try again or use sample cards.`;
        }
        setErrorMessage(message);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
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
  }, [onResultCallback]);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    if (!isSupported) {
      setErrorMessage('Voice recognition is not supported in this browser. Please use Chrome, Edge, or select a sample card.');
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        // If already started, restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => recognitionRef.current?.start(), 100);
        } catch {
          setErrorMessage('Could not restart microphone. Please try again or click a sample card.');
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
