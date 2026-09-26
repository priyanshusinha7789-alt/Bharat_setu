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
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Supported Regional & Tribal Mother Tongues
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            Jharkhand is home to rich Austroasiatic, Dravidian, and Indo-Aryan linguistic heritage. BHASHA SETU is structured to support native primary education across both constitutional and indigenous languages.
          </p>
        </div>

        {/* 6 Language Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {LANGUAGES.map((lang) => {
            const isVerified = lang.status === 'verified';
            return (
              <div
                key={lang.id}
                className="bhasha-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderLeft: `4px solid ${isVerified ? '#10b981' : '#eab308'}`
                }}
              >
                <div>
                  {/* Card Title & Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
                        {lang.name}
                      </h3>
                      <div style={{ fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600 }}>
                        {lang.nativeName}
                      </div>
                    </div>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                      color: isVerified ? '#34d399' : '#fde047',
                      border: `1px solid ${isVerified ? '#059669' : '#ca8a04'}`
                    }}>
                      {isVerified ? <CheckCircleIcon size={12} /> : <AlertCircleIcon size={12} />}
                      {lang.statusLabel}
                    </span>
                  </div>

                  {/* Metadata fields */}
                  <div style={{
                    backgroundColor: '#0a0f1d',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '14px',
                    fontSize: '0.82rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Traditional Script: </strong>
                      <span style={{ color: '#94a3b8' }}>{lang.script}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#cbd5e1' }}>Primary Districts: </strong>
                      <span style={{ color: '#94a3b8' }}>{lang.region}</span>
                    </div>
                  </div>

                  {/* Cultural note */}
                  <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    {lang.culturalNote}
                  </p>
                </div>

                {/* Bottom status note */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #1e293b',
                  fontSize: '0.75rem',
                  color: isVerified ? '#34d399' : '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
