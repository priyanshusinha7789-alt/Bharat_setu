import React from 'react';
import { SparklesIcon } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#070b14',
      borderTop: '1px solid #1a2538',
      padding: '3.5rem 0 2rem',
      color: '#94a3b8'
    }}>
      <div className="container-custom">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '2.5rem'
        }}>
          {/* Brand & Taglines */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <SparklesIcon size={18} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                BHASHA SETU
              </span>
            </div>

            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#38bdf8',
              marginBottom: '4px'
            }}>
              “We Don’t Translate Words, We Translate Learnings.”
            </div>
            <div style={{
              fontSize: '0.88rem',
              color: '#cbd5e1',
              marginBottom: '12px'
            }}>
              Bridging Languages, Empowering Learning.
            </div>

            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748b' }}>
              A dedicated vernacular classroom translation prototype designed to support foundational learning in Jharkhand's multilingual primary schools.
            </p>
          </div>

          {/* SIH Problem Statement */}
          <div>
            <h4 style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#cbd5e1',
              marginBottom: '12px'
            }}>
              SIH Problem Statement
            </h4>
            <div style={{
              backgroundColor: '#0d1527',
              border: '1px solid #1c2b45',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '0.84rem',
              lineHeight: 1.5,
              color: '#cbd5e1'
            }}>
              <strong style={{ color: '#38bdf8' }}>AI-Powered Vernacular Pedagogy and Real-Time Translation Tool for Mother Tongue-Based Primary Education.</strong>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                Objective: Facilitate primary-school educators in teaching fundamental concepts in children's mother tongues across multi-ethnic regional environments.
              </div>
            </div>
          </div>

          {/* Prototype Disclosure & Quick Links */}
          <div>
            <h4 style={{
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#cbd5e1',
              marginBottom: '12px'
            }}>
              Prototype Disclosure
            </h4>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: '#64748b', marginBottom: '14px' }}>
              This web application is a frontend demonstration prototype built for Smart India Hackathon evaluation. It operates using an in-memory curricular dictionary and browser-native speech modules without external paid APIs, cloud databases, or unauthorized user data collection.
            </p>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.84rem' }}>
              <a href="#home" style={{ color: '#38bdf8', textDecoration: 'none' }}>Home</a>
              <a href="#demo" style={{ color: '#38bdf8', textDecoration: 'none' }}>Demo</a>
              <a href="#how-it-works" style={{ color: '#38bdf8', textDecoration: 'none' }}>Workflow</a>
              <a href="#languages" style={{ color: '#38bdf8', textDecoration: 'none' }}>Languages</a>
              <a href="#team" style={{ color: '#38bdf8', textDecoration: 'none' }}>Team</a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          borderTop: '1px solid #141e33',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} BHASHA SETU • Smart India Hackathon Prototype
          </div>
          <div>
            Developed with React + TypeScript + Vite • Lightweight & Offline-Ready
          </div>
        </div>
      </div>
    </footer>
  );
};
