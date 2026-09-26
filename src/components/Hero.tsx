import React from 'react';
import { ArrowRightIcon, SchoolIcon, BookOpenIcon, GlobeIcon } from './Icons';

export const Hero: React.FC = () => {
  return (
    <section id="home" style={{
      position: 'relative',
      padding: '4.5rem 0 3.5rem',
      overflow: 'hidden'
    }}>
      {/* Background ambient lighting */}
      <div className="glow-navy" style={{
        top: '-10%',
        left: '20%',
        width: '500px',
        height: '500px',
        backgroundColor: '#0369a1'
      }} />
      <div className="glow-navy" style={{
        bottom: '0%',
        right: '15%',
        width: '450px',
        height: '450px',
        backgroundColor: '#1d4ed8'
      }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '6px 14px',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#38bdf8'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8'
            }} />
            Smart India Hackathon • Primary Classroom Prototype
          </div>

          {/* Project Title */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            lineHeight: 1.15
          }}>
            BHASHA SETU
          </h1>

          {/* Exact Tagline */}
          <div style={{
            fontSize: 'clamp(1.25rem, 2.8vw, 1.85rem)',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '0.75rem',
            lineHeight: 1.3
          }}>
            “We Don’t Translate Words, We Translate Learnings.”
          </div>

          {/* Supporting Line */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            fontWeight: 500,
            marginBottom: '1.75rem'
          }}>
            Bridging Languages, Empowering Learning.
          </p>

          {/* Concise Problem & Solution Summary */}
          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7
          }}>
            <strong style={{ color: '#e2e8f0' }}>AI-Powered Vernacular Pedagogy & Real-Time Translation:</strong> Built specifically to empower primary-school teachers in explaining curriculum concepts to children in their native mother tongue—fostering comprehension and retention across multilingual tribal communities in Jharkhand.
          </p>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            marginBottom: '3.5rem'
          }}>
            <a
              href="#demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#38bdf8',
                color: '#0a0f1d',
                padding: '13px 26px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.98rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#7dd3fc';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#38bdf8';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Try Live Demo <ArrowRightIcon size={18} />
            </a>

            <a
              href="#how-it-works"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#141e33',
                color: '#e2e8f0',
                border: '1px solid #20314d',
                padding: '13px 24px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.98rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.backgroundColor = '#1b2845';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#20314d';
                e.currentTarget.style.backgroundColor = '#141e33';
              }}
            >
              How It Works
            </a>
          </div>

          {/* Three Feature Highlight Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            <div className="bhasha-card" style={{ padding: '20px' }}>
              <div style={{
                color: '#38bdf8',
                marginBottom: '12px',
                display: 'inline-flex',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)'
              }}>
                <SchoolIcon size={22} />
              </div>
              <h2 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Classroom Pedagogy First</h2>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Translates conceptual explanations rather than literal word-to-word text, keeping science and math accessible for primary students.
              </p>
            </div>

            <div className="bhasha-card" style={{ padding: '20px' }}>
              <div style={{
                color: '#2dd4bf',
                marginBottom: '12px',
                display: 'inline-flex',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(45, 212, 191, 0.1)'
              }}>
                <GlobeIcon size={22} />
              </div>
              <h2 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Jharkhand Mother Tongues</h2>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Targets local vernaculars: Hindi, Bengali, Santali, Mundari, Ho, and Kurukh to bridge linguistic divides in early childhood.
              </p>
            </div>

            <div className="bhasha-card" style={{ padding: '20px' }}>
              <div style={{
                color: '#a78bfa',
                marginBottom: '12px',
                display: 'inline-flex',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: 'rgba(167, 139, 250, 0.1)'
              }}>
                <BookOpenIcon size={22} />
              </div>
              <h2 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>Lightweight & Browser-Native</h2>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Built without expensive paid APIs, server lock-ins, or logins—demonstrating real browser speech recognition and client synthesis.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
