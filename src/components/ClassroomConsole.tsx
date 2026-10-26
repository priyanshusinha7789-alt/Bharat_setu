import React, { useState, useEffect, useId, useCallback } from 'react';
import { LanguageId } from '../types';
import { LANGUAGES } from '../data/languages';
import { SAMPLE_SENTENCES } from '../data/translations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useGeminiTranslation } from '../hooks/useGeminiTranslation';
import {
  MicIcon,
  MicOffIcon,
  Volume2Icon,
  SquareIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  BookOpenIcon,
  SparklesIcon,
  ExternalLinkIcon
} from './Icons';
import { VisualLearningPanel } from './VisualLearningPanel';

const SOURCE_LANGUAGES = [
  { code: 'en-IN', label: 'English (India / Hinglish)' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
  { code: 'mr-IN', label: 'Marathi (मराठी)' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)' },
  { code: 'auto', label: 'Multilingual / Mixed Speech' }
];

export const ClassroomConsole: React.FC = () => {
  const teacherInputId = useId();
  const targetLanguageId = useId();
  const sourceLanguageId = useId();

  // State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('hindi');
  const [selectedSourceLang, setSelectedSourceLang] = useState<string>('en-IN');
  const [inputText, setInputText] = useState<string>(SAMPLE_SENTENCES[0].english);
  const [activeSampleId, setActiveSampleId] = useState<number | null>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<{ hasApiKey: boolean; status: string } | null>(null);

  // Gemini AI Translation Hook
  const {
    translate: translateWithAi,
    isLoading: isTranslating,
    result: aiResult,
    errorMessage: aiError,
    errorCode: aiErrorCode,
    retryAfterSeconds: aiRetryAfterSeconds,
    quotaType: aiQuotaType,
    clearTranslation
  } = useGeminiTranslation();

  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (aiRetryAfterSeconds && aiRetryAfterSeconds > 0 && aiQuotaType !== 'daily') {
      setRetryCountdown(aiRetryAfterSeconds);
    } else {
      setRetryCountdown(null);
    }
  }, [aiRetryAfterSeconds, aiQuotaType]);

  useEffect(() => {
    if (retryCountdown === null || retryCountdown <= 0) return;
    const interval = setInterval(() => {
      setRetryCountdown((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [retryCountdown]);

  // Custom hooks
  const {
    speak,
    stop: stopAudio,
    isSpeaking,
    ttsNotice,
    clearNotice: clearTtsNotice
  } = useSpeechSynthesis();

  // Trigger AI translation callback
  const executeTranslation = useCallback(
    (text: string, targetLang: LanguageId, sourceHint: string) => {
      stopAudio();
      translateWithAi(text, targetLang, sourceHint);
    },
    [stopAudio, translateWithAi]
  );

  // Multilingual Speech Recognition
  const {
    isListening,
    isSupported: isMicSupported,
    errorMessage: micError,
    startListening,
    stopListening,
    clearError: clearMicError
  } = useSpeechRecognition((transcript) => {
    setInputText(transcript);
    setActiveSampleId(null);
    clearMicError();
    clearTtsNotice();
    // Connect Speech Recognition -> Translation immediately
    executeTranslation(transcript, selectedLanguage, selectedSourceLang);
  });

  // Check server API status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch(() => setServerStatus({ hasApiKey: false, status: 'offline' }));
  }, []);

  // Initial translation of sample 1 on load
  useEffect(() => {
    if (SAMPLE_SENTENCES[0]?.english) {
      executeTranslation(SAMPLE_SENTENCES[0].english, selectedLanguage, selectedSourceLang);
    }
  }, []); // Run once on mount

  const currentLangMeta = LANGUAGES.find((l) => l.id === selectedLanguage)!;

  // Handle sample click
  const handleSelectSample = (sentence: typeof SAMPLE_SENTENCES[0]) => {
    stopAudio();
    setInputText(sentence.english);
    setActiveSampleId(sentence.id);
    clearMicError();
    clearTtsNotice();
    executeTranslation(sentence.english, selectedLanguage, selectedSourceLang);
  };

  // Handle language change
  const handleLanguageChange = (newLang: LanguageId) => {
    stopAudio();
    setSelectedLanguage(newLang);
    clearTtsNotice();
    if (inputText.trim()) {
      executeTranslation(inputText, newLang, selectedSourceLang);
    }
  };

  // Handle source speech language change
  const handleSourceLangChange = (newSource: string) => {
    setSelectedSourceLang(newSource);
  };

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    const match = SAMPLE_SENTENCES.find(
      (s) => s.english.toLowerCase().trim() === val.toLowerCase().trim()
    );
    setActiveSampleId(match ? match.id : null);
    clearMicError();
    clearTtsNotice();
  };

  // Microphone toggle
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      stopAudio();
      // Pass selected language to speech recognition engine
      const micLangCode = selectedSourceLang === 'auto' ? 'en-IN' : selectedSourceLang;
      startListening(micLangCode);
    }
  };

  // Manual trigger for typed translation
  const handleManualTranslate = () => {
    if (!inputText.trim() || isTranslating || (retryCountdown !== null && retryCountdown > 0)) return;
    executeTranslation(inputText, selectedLanguage, selectedSourceLang);
  };

  // Text-to-speech Play handler
  const handlePlayAudio = () => {
    const textToSpeak = aiResult?.translation;
    if (!textToSpeak) return;

    const voiceCode = currentLangMeta.ttsVoiceCode || 'hi-IN';
    speak(textToSpeak, voiceCode, currentLangMeta.name);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const textToCopy = aiResult?.translation;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Reset console
  const handleReset = () => {
    stopAudio();
    stopListening();
    clearTranslation();
    setInputText('');
    setActiveSampleId(null);
    clearMicError();
    clearTtsNotice();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopListening();
    };
  }, [stopAudio, stopListening]);

  return (
    <section id="demo" style={{
      padding: '4rem 0',
      backgroundColor: '#0c1322',
      borderTop: '1px solid #1e293b',
      borderBottom: '1px solid #1e293b',
      position: 'relative'
    }}>
      <div className="container-custom">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem'
          }}>
            <SparklesIcon size={16} /> AI-Powered Vernacular Classroom Console
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Live Mother Tongue Translation Demo
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Powered by Google Gemini AI for contextual translation of arbitrary English, Hindi, Marathi, Hinglish, and classroom speech into Jharkhand vernaculars (Hindi, Bengali, Santali, Mundari, Ho, Kurukh).
          </p>
        </div>

        {/* Server Status Badge / API Key Notice */}
        {serverStatus && !serverStatus.hasApiKey && (
          <div style={{
            backgroundColor: 'rgba(234, 179, 8, 0.1)',
            border: '1px solid #ca8a04',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <AlertCircleIcon size={22} style={{ color: '#facc15', flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.86rem', color: '#fef08a', lineHeight: 1.5 }}>
              <strong>Gemini API Key Setup Required:</strong> To enable real-time AI translation for arbitrary sentences and tribal languages, add your <code style={{ backgroundColor: '#1e293b', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>GEMINI_API_KEY</code> in the <code style={{ backgroundColor: '#1e293b', padding: '2px 6px', borderRadius: '4px', color: '#38bdf8' }}>.env</code> file. Get a free API key at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'underline' }}>Google AI Studio</a>.
            </div>
          </div>
        )}

        {/* 3 Clickable Sample Sentence Cards */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
              Select a Primary Curriculum Lesson Prompt:
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Click to translate dynamically via Gemini AI
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {SAMPLE_SENTENCES.map((sample) => {
              const isSelected = activeSampleId === sample.id;
              return (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  aria-pressed={isSelected}
                  className={`bhasha-card ${isSelected ? 'bhasha-card-active' : ''}`}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '125px',
                    color: 'inherit',
                    outline: 'none'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: isSelected ? '#38bdf8' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <BookOpenIcon size={14} /> Sample {sample.id} • {sample.gradeLevel}
                      </span>
                      <span style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.2)' : '#1e293b',
                        color: isSelected ? '#38bdf8' : '#94a3b8'
                      }}>
                        {sample.subject.split('/')[0].trim()}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.92rem',
                      fontWeight: 500,
                      lineHeight: 1.45,
                      color: isSelected ? '#ffffff' : '#e2e8f0'
                    }}>
                      “{sample.english}”
                    </p>
                  </div>
                  <div style={{
                    marginTop: '10px',
                    fontSize: '0.76rem',
                    color: isSelected ? '#38bdf8' : '#64748b',
                    fontWeight: 600
                  }}>
                    {isSelected ? '✓ Loaded & Sent to Gemini AI' : 'Click to translate with AI →'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Classroom Console Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          alignItems: 'stretch'
        }}>

          {/* LEFT: Teacher Speech & Input Card */}
          <div className="bhasha-card" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Header with Source Lang Selector and Mic Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '14px'
              }}>
                <div>
                  <label htmlFor={sourceLanguageId} style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#94a3b8',
                    fontWeight: 600,
                    display: 'block'
                  }}>
                    Source Speech / Input Language
                  </label>
                  <select
                    id={sourceLanguageId}
                    value={selectedSourceLang}
                    onChange={(e) => handleSourceLangChange(e.target.value)}
                    style={{
                      backgroundColor: '#141e33',
                      color: '#ffffff',
                      border: '1px solid #20314d',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginTop: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {SOURCE_LANGUAGES.map((sl) => (
                      <option key={sl.code} value={sl.code} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                        {sl.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Microphone Toggle Button */}
                <button
                  onClick={toggleListening}
                  aria-label={isListening ? 'Stop listening to speech' : 'Start microphone speech recognition'}
                  title={isListening ? 'Click to stop listening' : 'Click to speak using microphone'}
                  className={isListening ? 'animate-pulse-mic' : ''}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isListening ? '#dc2626' : '#1e293b',
                    color: isListening ? '#ffffff' : '#38bdf8',
                    border: `1px solid ${isListening ? '#ef4444' : '#2e4469'}`,
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginTop: 'auto'
                  }}
                >
                  {isListening ? (
                    <>
                      <MicOffIcon size={18} />
                      <span>Listening...</span>
                      <span className="soundwave-bar" />
                      <span className="soundwave-bar" />
                      <span className="soundwave-bar" />
                    </>
                  ) : (
                    <>
                      <MicIcon size={18} />
                      <span>Record Speech</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mic notice / error banner with fallback button */}
              {micError && (
                <div style={{
                  backgroundColor: 'rgba(127, 29, 29, 0.4)',
                  border: '1px solid #991b1b',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                  fontSize: '0.82rem',
                  color: '#fecaca',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <AlertCircleIcon size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <span>{micError}</span>
                      <div style={{ marginTop: '6px' }}>
                        <button
                          onClick={() => handleSelectSample(SAMPLE_SENTENCES[0])}
                          style={{
                            backgroundColor: '#38bdf8',
                            color: '#0f172a',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Use Curriculum Sample Fallback
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={clearMicError}
                    aria-label="Dismiss error notification"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fecaca',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      lineHeight: 1
                    }}
                  >
                    ×
                  </button>
                </div>
              )}

              {!isMicSupported && (
                <div style={{
                  backgroundColor: 'rgba(217, 119, 6, 0.15)',
                  border: '1px solid #d97706',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  marginBottom: '12px',
                  fontSize: '0.8rem',
                  color: '#fde68a'
                }}>
                  Browser Web Speech API is restricted in this environment. Type any sentence below or use Chrome/Edge on localhost/HTTPS.
                </div>
              )}

              {/* Text Input Area */}
              <label htmlFor={teacherInputId} style={{
                display: 'block',
                fontSize: '0.82rem',
                color: '#94a3b8',
                marginBottom: '6px',
                fontWeight: 500
              }}>
                Teacher's lesson explanation (English, Hindi, Marathi, Hinglish, slang):
              </label>
              <textarea
                id={teacherInputId}
                rows={4}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type or speak any classroom explanation (e.g. 'Plants use photosynthesis to make food', or 'Triangle la teen sides astat')..."
                style={{
                  width: '100%',
                  backgroundColor: '#0a0f1d',
                  color: '#ffffff',
                  border: '1px solid #20314d',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '0.98rem',
                  resize: 'vertical',
                  lineHeight: 1.5,
                  minHeight: '110px'
                }}
              />

              {/* Translate Action Button */}
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={handleManualTranslate}
                  disabled={isTranslating || !inputText.trim() || (retryCountdown !== null && retryCountdown > 0)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isTranslating || !inputText.trim() || (retryCountdown !== null && retryCountdown > 0) ? '#1e293b' : '#38bdf8',
                    color: isTranslating || !inputText.trim() || (retryCountdown !== null && retryCountdown > 0) ? '#64748b' : '#0a0f1d',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isTranslating || !inputText.trim() || (retryCountdown !== null && retryCountdown > 0) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <SparklesIcon size={16} />
                  <span>
                    {isTranslating
                      ? 'Translating with Gemini...'
                      : retryCountdown !== null && retryCountdown > 0
                      ? `Rate Limited (Wait ${retryCountdown}s)`
                      : 'Translate with Gemini AI'}
                  </span>
                </button>
              </div>
            </div>

            {/* Input Controls Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '14px',
              paddingTop: '12px',
              borderTop: '1px solid #1e293b'
            }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                {inputText.length} characters • {activeSampleId ? `Curriculum Sample #${activeSampleId}` : 'Arbitrary input'}
              </span>
              <button
                onClick={handleReset}
                aria-label="Clear input and reset console"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  textDecoration: 'underline'
                }}
              >
                Clear Input
              </button>
            </div>
          </div>


          {/* RIGHT: Vernacular Target & Translation Output Card */}
          <div className="bhasha-card" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              {/* Header with Target Language Dropdown */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '14px'
              }}>
                <div>
                  <label htmlFor={targetLanguageId} style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#94a3b8',
                    fontWeight: 600,
                    display: 'block'
                  }}>
                    Target Mother Tongue
                  </label>
                  <select
                    id={targetLanguageId}
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value as LanguageId)}
                    style={{
                      backgroundColor: '#1b2845',
                      color: '#ffffff',
                      border: '1px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '4px',
                      minWidth: '200px'
                    }}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.id} style={{ backgroundColor: '#0f172a', color: '#fff' }}>
                        {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Badge */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid #0284c7'
                  }}>
                    <SparklesIcon size={14} /> Gemini 2.5 Flash AI
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    Script: {currentLangMeta.script}
                  </div>
                </div>
              </div>

              {/* TTS Notice if any */}
              {ttsNotice && (
                <div style={{
                  backgroundColor: 'rgba(2, 132, 199, 0.15)',
                  border: '1px solid #0284c7',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  marginBottom: '10px',
                  fontSize: '0.8rem',
                  color: '#bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{ttsNotice}</span>
                  <button
                    onClick={clearTtsNotice}
                    aria-label="Dismiss speech notice"
                    style={{ background: 'none', border: 'none', color: '#bae6fd', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Output Display Box */}
              <div style={{
                position: 'relative',
                backgroundColor: '#0a0f1d',
                border: '1px solid #20314d',
                borderRadius: '10px',
                padding: '18px',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {isTranslating ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{
                      display: 'inline-block',
                      width: '32px',
                      height: '32px',
                      border: '3px solid rgba(56, 189, 248, 0.2)',
                      borderTopColor: '#38bdf8',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      marginBottom: '12px'
                    }} />
                    <div style={{ fontSize: '0.94rem', fontWeight: 600, color: '#38bdf8' }}>
                      Translating with Gemini AI...
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                      Contextualizing for primary-school learners in {currentLangMeta.name}
                    </div>
                  </div>
                ) : aiError ? (
                  <div style={{
                    backgroundColor: aiErrorCode === 'MISSING_API_KEY' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                    border: `1px solid ${aiErrorCode === 'MISSING_API_KEY' ? '#ca8a04' : '#ef4444'}`,
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: aiErrorCode === 'MISSING_API_KEY' ? '#fde047' : '#f87171',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      marginBottom: '6px'
                    }}>
                      <AlertCircleIcon size={18} />
                      <span>
                        {aiErrorCode === 'MISSING_API_KEY'
                          ? 'Gemini API Key Required'
                          : aiQuotaType === 'daily'
                          ? 'Daily Gemini API Quota Exhausted'
                          : aiErrorCode === 'QUOTA_EXCEEDED'
                          ? 'Gemini API Rate Limit Reached'
                          : 'Translation Request Notice'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '8px' }}>
                      {aiError}
                    </p>
                    {aiErrorCode === 'MISSING_API_KEY' && (
                      <div style={{
                        backgroundColor: '#0a0f1d',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        fontSize: '0.78rem',
                        color: '#94a3b8'
                      }}>
                        <div>1. Get an API key: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>Google AI Studio</a></div>
                        <div>2. Set in <code style={{ color: '#38bdf8' }}>.env</code>: <code style={{ color: '#34d399' }}>GEMINI_API_KEY=your_key_here</code></div>
                        <div style={{ marginTop: '4px' }}>3. Click Translate or select a sample sentence.</div>
                      </div>
                    )}
                    {aiErrorCode !== 'MISSING_API_KEY' && (
                      aiQuotaType === 'daily' ? (
                        <div style={{
                          marginTop: '8px',
                          padding: '8px 10px',
                          backgroundColor: 'rgba(15, 23, 42, 0.6)',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                          lineHeight: 1.4
                        }}>
                          💡 <strong>How to resolve:</strong> Check your project plan at <a href="https://ai.dev/rate-limit" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>Google AI Studio Quota Monitor</a>. The free tier for this model resets at midnight Pacific Time. To expand capacity, configure an API key from an independent Google Cloud project.
                        </div>
                      ) : (
                        <button
                          onClick={handleManualTranslate}
                          disabled={isTranslating || (retryCountdown !== null && retryCountdown > 0)}
                          style={{
                            backgroundColor: (retryCountdown !== null && retryCountdown > 0) || isTranslating ? '#1e293b' : '#38bdf8',
                            color: (retryCountdown !== null && retryCountdown > 0) || isTranslating ? '#64748b' : '#0a0f1d',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: (retryCountdown !== null && retryCountdown > 0) || isTranslating ? 'not-allowed' : 'pointer',
                            marginTop: '6px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {retryCountdown !== null && retryCountdown > 0
                            ? `Retry Available in ${retryCountdown}s`
                            : 'Retry Translation'}
                        </button>
                      )
                    )}
                  </div>
                ) : aiResult ? (
                  <div>
                    {/* Detected Source & Meta Badge */}
                    {aiResult.detectedSource && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#1b2845',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        color: '#94a3b8',
                        marginBottom: '10px'
                      }}>
                        <span>Source: <strong style={{ color: '#38bdf8' }}>{aiResult.detectedSource}</strong></span>
                      </div>
                    )}

                    {/* Translated Text */}
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      lineHeight: 1.6,
                      color: '#38bdf8',
                      marginBottom: '8px'
                    }}>
                      {aiResult.translation}
                    </div>

                    {/* Phonetic Pronunciation Guide if provided */}
                    {aiResult.phonetic && (
                      <div style={{
                        fontSize: '0.84rem',
                        color: '#cbd5e1',
                        backgroundColor: '#141e33',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        marginBottom: '8px'
                      }}>
                        <strong style={{ color: '#94a3b8' }}>Phonetic Reading: </strong>
                        <span>{aiResult.phonetic}</span>
                      </div>
                    )}

                    {/* Pedagogical Note */}
                    {aiResult.pedagogicalNote && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        fontSize: '0.76rem',
                        color: '#34d399',
                        marginTop: '6px'
                      }}>
                        <CheckCircleIcon size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{aiResult.pedagogicalNote}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
                    <SparklesIcon size={24} style={{ color: '#38bdf8', marginBottom: '8px' }} />
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.94rem' }}>
                      Ready for Live AI Translation
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                      Enter or speak any sentence in English, Hindi, Marathi, Hinglish, or slang to see the vernacular pedagogical translation.
                    </p>
                  </div>
                )}
              </div>

              {/* Animated Visual Learning Panel */}
              <VisualLearningPanel
                visual={aiResult?.visual}
                sourceText={inputText}
                targetLangName={currentLangMeta.name}
                isLoading={isTranslating}
              />
            </div>

            {/* Audio & Action Controls Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #1e293b'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Play Button */}
                <button
                  onClick={handlePlayAudio}
                  disabled={!aiResult?.translation || isSpeaking}
                  aria-label="Play translated audio output"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: !aiResult?.translation ? '#1e293b' : '#0284c7',
                    color: !aiResult?.translation ? '#64748b' : '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: !aiResult?.translation ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isSpeaking ? 0.7 : 1
                  }}
                >
                  <Volume2Icon size={18} />
                  <span>{isSpeaking ? 'Playing Audio...' : 'Play Audio'}</span>
                </button>

                {/* Stop Button */}
                <button
                  onClick={stopAudio}
                  aria-label="Stop audio playback"
                  disabled={!isSpeaking}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: isSpeaking ? '#475569' : '#1e293b',
                    color: isSpeaking ? '#ffffff' : '#64748b',
                    border: '1px solid #334155',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: isSpeaking ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <SquareIcon size={16} />
                  <span>Stop</span>
                </button>
              </div>

              {/* Copy Translation Output */}
              <button
                onClick={handleCopy}
                disabled={!aiResult?.translation}
                aria-label="Copy translated text to clipboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: '1px solid #2e4469',
                  color: copied ? '#34d399' : '#94a3b8',
                  padding: '7px 12px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  cursor: !aiResult?.translation ? 'not-allowed' : 'pointer'
                }}
              >
                {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Output'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* Live Video Demo */}
        <div id="video-demo" style={{
          marginTop: '3rem',
          backgroundColor: '#0a0f1d',
          border: '1px solid #20314d',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.45)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#38bdf8',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '4px'
              }}>
                <SparklesIcon size={14} /> Classroom Walkthrough
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
                Live Video Demo
              </h3>
            </div>
            <a
              href="https://youtu.be/SrssraZoRGo?si=6a9bINTnXxfiLZ-p"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch live video demo on YouTube (opens in new tab)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#38bdf8',
                fontSize: '0.84rem',
                fontWeight: 600,
                textDecoration: 'none',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                padding: '7px 14px',
                borderRadius: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Watch on YouTube</span>
              <ExternalLinkIcon size={14} />
            </a>
          </div>

          {/* Responsive 16:9 Video Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '10px',
            backgroundColor: '#000000',
            border: '1px solid #1e293b'
          }}>
            <iframe
              src="https://www.youtube.com/embed/SrssraZoRGo"
              title="BHASHA SETU Live Video Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};
