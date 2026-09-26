import React, { useState } from 'react';
import { SparklesIcon } from './Icons';

interface NavbarProps {
  onReplayIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReplayIntro }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Live Demo', href: '#demo' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Languages', href: '#languages' },
    { name: 'Impact', href: '#impact' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(10, 15, 29, 0.85)',
      borderBottom: '1px solid #1b2845'
    }}>
      <div className="container-custom" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px',
      }}>
        {/* Brand */}
        <a href="#home" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: '#ffffff'
        }} aria-label="BHASHA SETU Homepage">
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.3)'
          }}>
            <SparklesIcon size={20} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(90deg, #ffffff 0%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              BHASHA SETU
            </div>
            <div style={{
              fontSize: '0.68rem',
              color: '#94a3b8',
              letterSpacing: '0.04em',
              fontWeight: 500,
              textTransform: 'uppercase'
            }}>
              SIH 2024 • Vernacular Pedagogy
            </div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '24px'
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#cbd5e1',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                padding: '6px 4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
            >
              {link.name}
            </a>
          ))}

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#38bdf8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Show Animated Team Intro"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
              }}
            >
              <SparklesIcon size={14} />
              <span>Intro</span>
            </button>
          )}

          <a
            href="#demo"
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#38bdf8',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 12px rgba(56, 189, 248, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7dd3fc';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#38bdf8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Launch Demo
          </a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          style={{
            background: 'none',
            border: '1px solid #20314d',
            borderRadius: '8px',
            padding: '8px 10px',
            color: '#cbd5e1',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="mobile-nav-toggle"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #20314d',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#e2e8f0',
                textDecoration: 'none',
                padding: '8px 0'
              }}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#38bdf8',
              padding: '10px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              textDecoration: 'none',
              marginTop: '8px'
            }}
          >
            Launch Demo
          </a>
        </div>
      )}

      {/* Media query helper styles */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
