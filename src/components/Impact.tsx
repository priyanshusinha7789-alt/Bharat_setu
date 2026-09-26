import React from 'react';
import { SchoolIcon, BookOpenIcon, CheckCircleIcon, UsersIcon } from './Icons';

export const Impact: React.FC = () => {
  const pillars = [
    {
      title: 'Alignment with NEP 2020 Guidelines',
      description: 'The National Education Policy (NEP 2020) explicitly mandates mother tongue and local vernacular instruction up to Grade 5 to establish foundational numeracy and literacy.',
      icon: <SchoolIcon size={22} style={{ color: '#38bdf8' }} />
    },
    {
      title: 'Eliminating the Dual Cognitive Burden',
      description: 'Children from indigenous tribal homes often spend cognitive effort decoding an unfamiliar medium of instruction (Standard Hindi or English) instead of understanding the scientific or mathematical concept itself.',
      icon: <BookOpenIcon size={22} style={{ color: '#2dd4bf' }} />
    },
    {
      title: 'Mitigating Early Elementary Disengagement',
      description: 'When tribal children cannot follow classroom discourse, communication anxiety rises, frequently leading to silent disengagement and early school attrition in remote primary pockets.',
      icon: <UsersIcon size={22} style={{ color: '#a78bfa' }} />
    },
    {
      title: 'Preserving Adivasi Heritage & Oral Culture',
      description: 'Validating indigenous dialects like Santali, Mundari, Ho, and Kurukh within primary schools reinforces community pride, linguistic diversity, and intergenerational knowledge continuity.',
      icon: <CheckCircleIcon size={22} style={{ color: '#34d399' }} />
    }
  ];

  return (
    <section id="impact" style={{
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
            Pedagogical Rationale
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Why Mother Tongue-Based Primary Pedagogy Matters
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            Educational research worldwide consistently demonstrates that foundational concepts learned in one's first language foster lifetime academic resilience and creative inquiry.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '3rem'
        }}>
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bhasha-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid #20314d'
              }}>
                {pillar.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', lineHeight: 1.4 }}>
                {pillar.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Ethical commitment banner */}
        <div style={{
          border: '1px solid #1e293b',
          borderRadius: '12px',
          backgroundColor: '#0f172a',
          padding: '20px 24px',
          textAlign: 'center',
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: '#38bdf8' }}>Ethical Translation Principle:</strong> In accordance with our SIH prototype charter, BHASHA SETU refuses to generate unvetted machine hallucination for vulnerable indigenous tongues. Every translation presented in classrooms must undergo participatory verification with fluent mother tongue educators.
          </p>
        </div>
      </div>
    </section>
  );
};
