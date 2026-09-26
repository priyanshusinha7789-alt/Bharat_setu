import React from 'react';
import { MicIcon, SparklesIcon, BookOpenIcon, Volume2Icon, UsersIcon } from './Icons';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Teacher Speaks',
      description: 'The educator dictates key lesson concepts naturally in English using a connected classroom mic or phone.',
      icon: <MicIcon size={24} style={{ color: '#38bdf8' }} />
    },
    {
      step: '02',
      title: 'Speech Recognition',
      description: 'The browser Web Speech API converts acoustic input into textual tokens formatted with Indian English (en-IN) recognition.',
      icon: <SparklesIcon size={24} style={{ color: '#2dd4bf' }} />
    },
    {
      step: '03',
      title: 'Pedagogical Translation',
      description: 'The in-memory curriculum dictionary maps core science and math concepts into vetted vernacular explanations.',
      icon: <BookOpenIcon size={24} style={{ color: '#a78bfa' }} />
    },
    {
      step: '04',
      title: 'Local-Language Output',
      description: 'The console renders contextual translations in Hindi, Bengali, or indigenous scripts with explicit validation badges.',
      icon: <Volume2Icon size={24} style={{ color: '#f59e0b' }} />
    },
    {
      step: '05',
      title: 'Student Listens & Learns',
      description: 'Primary children grasp abstract concepts through audio synthesis in their familiar mother tongue without cognitive friction.',
      icon: <UsersIcon size={24} style={{ color: '#34d399' }} />
    }
  ];

  return (
    <section id="how-it-works" style={{
      padding: '4.5rem 0',
      backgroundColor: '#0a0f1d',
      position: 'relative'
    }}>
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#38bdf8',
            marginBottom: '0.5rem'
          }}>
            Pedagogical Architecture
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            How BHASHA SETU Works in the Classroom
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            A lightweight, child-centric workflow engineered to remove language barriers during foundational primary education.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '3rem'
        }}>
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="bhasha-card"
              style={{
                padding: '24px 20px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #20314d'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: '#334155'
                  }}>
                    {item.step}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div style={{
                  marginTop: '16px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #38bdf8 0%, transparent 100%)',
                  opacity: 0.3
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Prototype Scope & Future AI Notice */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e3a5f',
          borderRadius: '12px',
          padding: '20px 24px',
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px'
        }}>
          <div style={{
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            color: '#38bdf8',
            flexShrink: 0
          }}>
            <SparklesIcon size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.98rem', color: '#ffffff', marginBottom: '6px' }}>
              Prototype Architecture & Roadmap Disclosure
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              This working SIH prototype demonstrates the <strong>frontend pedagogical workflow, reactive state engine, and native browser speech interfaces</strong>. Offline sample translations are curated from primary grade standards. Full production deployment will integrate fine-tuned, community-validated tribal language models (e.g. AI4Bharat IndicTrans2 and dedicated Adivasi linguistic corpora) with field evaluation across district schools in Jharkhand.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
