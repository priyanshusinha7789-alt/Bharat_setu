import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightIcon, SparklesIcon, Volume2Icon } from './Icons';

interface WelcomeLandingProps {
  onEnter: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  // Transition handler with debounce/guard against duplicate calls
  const handleTransition = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 450); // Matches transition duration
  }, [isExiting, onEnter]);

  // Global keydown handler (Enter, Space, Escape to enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        e.preventDefault();
        handleTransition();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTransition]);

  // Vernacular character badges to float in background
  const floatingChars = [
    { char: 'अ', script: 'Devanagari', top: '15%', left: '10%', delay: '0s', size: '2.5rem' },
    { char: 'আ', script: 'Bengali', top: '22%', right: '14%', delay: '1.2s', size: '2.8rem' },
    { char: 'ᱥ', script: 'Ol Chiki (Santali)', bottom: '24%', left: '12%', delay: '2.4s', size: '2.4rem' },
    { char: 'ᱚ', script: 'Ol Chiki', top: '38%', left: '22%', delay: '0.8s', size: '2.2rem' },
    { char: 'म', script: 'Devanagari', bottom: '28%', right: '18%', delay: '1.8s', size: '2.6rem' },
    { char: 'হ', script: 'Bengali', top: '18%', left: '46%', delay: '3.1s', size: '2.2rem' },
    { char: 'क', script: 'Devanagari', bottom: '16%', right: '35%', delay: '2.1s', size: '2.3rem' },
    { char: 'A', script: 'Latin', bottom: '35%', left: '38%', delay: '1.5s', size: '2.1rem' }
  ];

  const titleLetters = 'BHASHA SETU'.split('');

  return (
    <div
      onClick={handleTransition}
      role="region"
      aria-label="BHASHA SETU Welcome Screen. Press Enter or click anywhere to continue to website."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#070b14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out'
      }}
    >
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '20%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 70%)',
        filter: 'blur(70px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '15%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* Connected Constellation SVG Network */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.22
        }}
      >
        <line x1="12%" y1="18%" x2="24%" y2="40%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="24%" y1="40%" x2="50%" y2="30%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="30%" x2="84%" y2="24%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="84%" y1="24%" x2="80%" y2="70%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="80%" y1="70%" x2="62%" y2="82%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="62%" y1="82%" x2="38%" y2="65%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="38%" y1="65%" x2="14%" y2="76%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="12%" cy="18%" r="4" fill="#38bdf8" />
        <circle cx="24%" cy="40%" r="3" fill="#2dd4bf" />
        <circle cx="50%" cy="30%" r="5" fill="#38bdf8" />
        <circle cx="84%" cy="24%" r="4" fill="#60a5fa" />
        <circle cx="80%" cy="70%" r="4" fill="#a78bfa" />
        <circle cx="62%" cy="82%" r="3" fill="#2dd4bf" />
        <circle cx="38%" cy="65%" r="4" fill="#38bdf8" />
        <circle cx="14%" cy="76%" r="3" fill="#60a5fa" />
      </svg>

      {/* Floating Animated Vernacular Characters */}
      {floatingChars.map((item, index) => (
        <div
          key={index}
          className="floating-char"
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            fontSize: item.size,
            fontWeight: 700,
            color: 'rgba(56, 189, 248, 0.22)',
            animation: `floatSlow 6s ease-in-out infinite`,
            animationDelay: item.delay,
            pointerEvents: 'none',
            textShadow: '0 0 20px rgba(56, 189, 248, 0.2)'
          }}
          title={item.script}
        >
          {item.char}
        </div>
      ))}

      {/* Central Content Box */}
      <div style={{
        maxWidth: '840px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        
        {/* Glowing Badge */}
        <div
          className="landing-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: '#38bdf8',
            marginBottom: '1.75rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
          }}
        >
          <SparklesIcon size={16} />
          <span>Smart India Hackathon • Vernacular Pedagogy</span>
        </div>

        {/* Brand Name with Letter-Reveal Animation */}
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {titleLetters.map((char, i) => (
            <span
              key={i}
              className="reveal-letter"
              style={{
                display: 'inline-block',
                minWidth: char === ' ' ? '0.6em' : 'auto',
                background: 'linear-gradient(135deg, #ffffff 30%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animationDelay: `${0.1 + i * 0.05}s`
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <div
          className="fade-in-delayed"
          style={{
            fontSize: 'clamp(1.2rem, 3.2vw, 1.95rem)',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '0.75rem',
            letterSpacing: '-0.01em',
            animationDelay: '0.7s',
            textShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
          }}
        >
          “We Don’t Translate Words, We Translate Learnings.”
        </div>

        {/* Supporting Text */}
        <p
          className="fade-in-delayed"
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            color: '#cbd5e1',
            fontWeight: 500,
            marginBottom: '2.5rem',
            animationDelay: '0.9s'
          }}
        >
          Bridging Languages, Empowering Learning.
        </p>

        {/* Audio / Voicewave Pill */}
        <div
          className="fade-in-delayed"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid #1e293b',
            borderRadius: '999px',
            padding: '8px 18px',
            marginBottom: '2.75rem',
            animationDelay: '1.1s'
          }}
        >
          <Volume2Icon size={18} style={{ color: '#38bdf8' }} />
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Hindi • Bengali • Santali • Mundari • Ho • Kurukh
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span className="soundwave-bar" style={{ height: '14px', backgroundColor: '#38bdf8' }} />
            <span className="soundwave-bar" style={{ height: '18px', backgroundColor: '#2dd4bf' }} />
            <span className="soundwave-bar" style={{ height: '12px', backgroundColor: '#38bdf8' }} />
          </div>
        </div>

        {/* Glowing "Enter Website" Button */}
        <div className="fade-in-delayed" style={{ animationDelay: '1.3s' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTransition();
            }}
            aria-label="Enter BHASHA SETU Website"
            className="enter-btn-glow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#38bdf8',
              color: '#070b14',
              padding: '16px 36px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.45)',
              transition: 'all 0.25s ease'
            }}
          >
            <span>Enter Website</span>
            <ArrowRightIcon size={20} />
          </button>
        </div>

        {/* Click anywhere instruction */}
        <div
          className="fade-in-delayed"
          style={{
            marginTop: '1.5rem',
            fontSize: '0.82rem',
            color: '#64748b',
            letterSpacing: '0.04em',
            animationDelay: '1.5s'
          }}
        >
          Click anywhere or press Enter to continue
        </div>

      </div>

      {/* Keyframe animations and reduced motion styles */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(4deg);
          }
        }

        @keyframes letterReveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .reveal-letter {
          animation: letterReveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes fadeInSlow {
          0% {
            opacity: 0;
            transform: translateY(14px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-delayed {
          animation: fadeInSlow 0.8s ease-out both;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(56, 189, 248, 0.4);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 45px rgba(56, 189, 248, 0.65);
            transform: translateY(-2px);
          }
        }

        .enter-btn-glow {
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        .enter-btn-glow:hover {
          background-color: #7dd3fc !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 0 50px rgba(56, 189, 248, 0.8) !important;
        }

        /* Accessibility: Support reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .reveal-letter,
          .fade-in-delayed,
          .floating-char,
          .enter-btn-glow {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
