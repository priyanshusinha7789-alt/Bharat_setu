import React, { useState, useEffect, useId } from 'react';
import { LanguageId } from '../types';
import { LANGUAGES } from '../data/languages';
import { SAMPLE_SENTENCES, findTranslation } from '../data/translations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
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
  SparklesIcon
} from './Icons';

export const ClassroomConsole: React.FC = () => {
  const teacherInputId = useId();
  const targetLanguageId = useId();

  // State
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('hindi');
  const [inputText, setInputText] = useState<string>(SAMPLE_SENTENCES[0].english);
  const [activeSampleId, setActiveSampleId] = useState<number | null>(1);
  const [copied, setCopied] = useState<boolean>(false);

  // Custom hooks
  const {
    isListening,
    isSupported: isMicSupported,
    errorMessage: micError,
    startListening,
    stopListening,
    clearError: clearMicError
  } = useSpeechRecognition((transcript) => {
    setInputText(transcript);
    // When spoken text arrives, check if it matches one of our samples
    const match = SAMPLE_SENTENCES.find(
      s => s.english.toLowerCase().trim() === transcript.toLowerCase().trim()
    );
    setActiveSampleId(match ? match.id : null);
  });

  const {
    speak,
    stop: stopAudio,
    isSpeaking,
    ttsNotice,
    clearNotice: clearTtsNotice
  } = useSpeechSynthesis();

  // Translation result computation
  const translationResult = findTranslation(inputText, selectedLanguage);
  const currentLangMeta = LANGUAGES.find(l => l.id === selectedLanguage)!;

  // Handle sample click
  const handleSelectSample = (sentence: typeof SAMPLE_SENTENCES[0]) => {
    stopAudio();
    setInputText(sentence.english);
    setActiveSampleId(sentence.id);
    clearMicError();
    clearTtsNotice();
  };

  // Handle language change
  const handleLanguageChange = (newLang: LanguageId) => {
    stopAudio();
    setSelectedLanguage(newLang);
    clearTtsNotice();
  };

  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    const match = SAMPLE_SENTENCES.find(
      s => s.english.toLowerCase().trim() === val.toLowerCase().trim()
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
      startListening();
    }
  };

  // Text-to-speech Play handler
  const handlePlayAudio = () => {
    if (!translationResult.translationText) return;
    if (translationResult.status === 'no_sample') return;

    const voiceCode = currentLangMeta.ttsVoiceCode || 'hi-IN';
    speak(translationResult.translationText, voiceCode, currentLangMeta.name);
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!translationResult.translationText) return;
    navigator.clipboard.writeText(translationResult.translationText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Reset console
  const handleReset = () => {
    stopAudio();
    stopListening();
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
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
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
            <SparklesIcon size={16} /> Interactive Classroom Console
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem' }}>
            Live Mother Tongue Translation Demo
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Demonstrating classroom speech-to-vernacular translation flow. Click any curricular sample sentence below or use the microphone to test live speech recognition in Indian English (<code style={{ color: '#38bdf8' }}>en-IN</code>).
          </p>
        </div>

        {/* 3 Clickable Sample Sentence Cards */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#cbd5e1' }}>
              Select a Primary Curriculum Lesson Sample:
            </span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Click to load instantly
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
                    {isSelected ? '✓ Currently Loaded in Console' : 'Click to test in vernacular →'}
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
              {/* Header with Source Lang and Mic Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.74rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: '#94a3b8',
                    fontWeight: 600
                  }}>
                    Source Language (Teacher)
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    English <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500 }}>(India, en-IN)</span>
                  </div>
                </div>

                {/* Microphone Toggle Button */}
                <button
                  onClick={toggleListening}
                  aria-label={isListening ? 'Stop listening to teacher speech' : 'Start listening to teacher speech'}
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
                    transition: 'all 0.2s ease'
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
                          Use Verified Sample 1 Fallback
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
                  Browser Web Speech API is not enabled in this environment. Please click one of the 3 verified sample cards above.
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
                Teacher's lesson explanation (type or speak):
              </label>
              <textarea
                id={teacherInputId}
                rows={4}
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type lesson explanation or click a sample card above..."
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
                {inputText.length} characters • {activeSampleId ? `Sample #${activeSampleId} active` : 'Manual input'}
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
                        {lang.name} ({lang.nativeName}) {lang.status === 'verified' ? '✓' : '⚠️'}
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
                    backgroundColor: currentLangMeta.status === 'verified'
                      ? 'rgba(52, 211, 153, 0.15)'
                      : 'rgba(253, 224, 71, 0.15)',
                    color: currentLangMeta.status === 'verified' ? '#34d399' : '#fde047',
                    border: `1px solid ${currentLangMeta.status === 'verified' ? '#059669' : '#ca8a04'}`
                  }}>
                    {currentLangMeta.status === 'verified' ? (
                      <CheckCircleIcon size={14} />
                    ) : (
                      <AlertCircleIcon size={14} />
                    )}
                    {currentLangMeta.statusLabel}
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
                padding: '16px',
                minHeight: '135px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {translationResult.status === 'no_sample' ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '10px' }}>
                    <AlertCircleIcon size={24} style={{ color: '#eab308', marginBottom: '6px' }} />
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.94rem' }}>
                      No Offline Sample Available
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                      To prevent hallucinated translations in classroom settings, arbitrary text requires future cloud AI models. Click any sample card above to see verified offline entries.
                    </p>
                  </div>
                ) : translationResult.status === 'pending_validation' ? (
                  <div style={{
                    backgroundColor: 'rgba(234, 179, 8, 0.08)',
                    border: '1px dashed #ca8a04',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#fef08a',
                      marginBottom: '6px'
                    }}>
                      “{translationResult.translationText}”
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      lineHeight: 1.5,
                      marginTop: '4px'
                    }}>
                      Language: <strong>{currentLangMeta.name}</strong> • Status: <em>Awaiting field validation with native speakers</em>.
                    </div>
                    {translationResult.note && (
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '6px' }}>
                        Note: {translationResult.note}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div style={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      lineHeight: 1.6,
                      color: '#38bdf8',
                      fontFamily: currentLangMeta.id === 'bengali' ? "'Plus Jakarta Sans', sans-serif" : 'inherit'
                    }}>
                      {translationResult.translationText}
                    </div>
                    <div style={{
                      marginTop: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.76rem',
                      color: '#34d399'
                    }}>
                      <CheckCircleIcon size={14} /> Verified pedagogical translation for {currentLangMeta.name} primary instruction.
                    </div>
                  </div>
                )}
              </div>
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
                  disabled={translationResult.status === 'no_sample' || isSpeaking}
                  aria-label="Play translated audio output"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: translationResult.status === 'no_sample' ? '#1e293b' : '#0284c7',
                    color: translationResult.status === 'no_sample' ? '#64748b' : '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.86rem',
                    cursor: translationResult.status === 'no_sample' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isSpeaking ? 0.7 : 1
                  }}
                >
                  <Volume2Icon size={18} />
                  <span>{isSpeaking ? 'Playing...' : 'Play Audio'}</span>
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
                disabled={!translationResult.translationText || translationResult.status === 'no_sample'}
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
                  cursor: !translationResult.translationText ? 'not-allowed' : 'pointer'
                }}
              >
                {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Output'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
