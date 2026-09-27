import React from 'react';
import { LANGUAGES } from '../data/languages';
import { GlobeIcon, CheckCircleIcon, AlertCircleIcon } from './Icons';

export const LanguageShowcase: React.FC = () => {
  return (
    <section id="languages" style={{
      padding: '4.5rem 0',
      backgroundColor: '#0c1322',
      borderTop: '1px solid #1e293b',
      borderBottom: '1px solid #1e293b'
    }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#2dd4bf',
            marginBottom: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <GlobeIcon size={16} /> Jharkhand Linguistic Landscape
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem', color: '#ffffff' }}>
            Supported Regional & Tribal Mother Tongues
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            Jharkhand is home to rich Austroasiatic, Dravidian, and Indo-Aryan linguistic heritage. BHASHA SETU is structured to support native primary education across both constitutional and indigenous languages.
          </p>
        </div>

        {/* 6 Language Cards: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="languages-grid">
          {LANGUAGES.map((lang) => {
            const isVerified = lang.status === 'verified';
            const classification = (lang.id === 'hindi' || lang.id === 'bengali')
              ? 'Constitutional'
              : 'Indigenous Mother Tongue';

            return (
              <div
                key={lang.id}
                className="bhasha-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${isVerified ? '#10b981' : '#eab308'}`,
                  height: '100%',
                  borderRadius: '14px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div>
                  {/* Top Metadata Row: Classification Tag & Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '14px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#38bdf8',
                      backgroundColor: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {classification}
                    </span>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.14)' : 'rgba(234, 179, 8, 0.14)',
                      color: isVerified ? '#34d399' : '#fde047',
                      border: `1px solid ${isVerified ? '#059669' : '#ca8a04'}`,
                      whiteSpace: 'nowrap'
                    }}>
                      {isVerified ? <CheckCircleIcon size={12} /> : <AlertCircleIcon size={12} />}
                      {lang.statusLabel}
                    </span>
                  </div>

                  {/* Primary Language Name & Native Script Display */}
                  <div style={{ marginBottom: '14px' }}>
                    <h3 style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '4px',
                      lineHeight: 1.2
                    }}>
                      {lang.name}
                    </h3>
                    <div
                      className="vernacular-text"
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: '#38bdf8',
                        lineHeight: 1.45,
                        wordBreak: 'break-word'
                      }}
                    >
                      {lang.nativeName}
                    </div>
                  </div>

                  {/* Metadata Fields: Traditional Script & Primary Districts */}
                  <div style={{
                    backgroundColor: '#0a0f1d',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '14px',
                    fontSize: '0.84rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Traditional Script
                      </span>
                      <span className="vernacular-text" style={{ color: '#e2e8f0', lineHeight: 1.4, fontSize: '0.88rem' }}>
                        {lang.script}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Primary Districts
                      </span>
                      <span style={{ color: '#94a3b8', lineHeight: 1.45, fontSize: '0.84rem' }}>
                        {lang.region}
                      </span>
                    </div>
                  </div>

                  {/* Cultural and Pedagogical Note */}
                  <p style={{
                    fontSize: '0.86rem',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
                    {lang.culturalNote}
                  </p>
                </div>

                {/* Bottom Verification Footer */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #1e293b',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: isVerified ? '#34d399' : '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  lineHeight: 1.4
                }}>
                  {isVerified ? (
                    <>✓ Active in prototype dictionary with TTS synthesis</>
                  ) : (
                    <>⏳ Awaiting community linguistic review before offline inclusion</>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
