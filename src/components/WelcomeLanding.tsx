import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRightIcon, SparklesIcon, Volume2Icon } from './Icons';
import { TEAM_MEMBERS } from '../data/team';

interface WelcomeLandingProps {
  onEnter: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<'team' | 'brand'>('team');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const stageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoEnterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Transition directly to the main website
  const handleFinish = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 400);
  }, [isExiting, onEnter]);

  // Transition from Stage 1 (Team) to Stage 2 (Brand)
  const advanceToBrand = useCallback(() => {
    if (stage === 'brand' || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStage('brand');
      setIsTransitioning(false);
    }, 350);
  }, [stage, isTransitioning]);

  // Timer: Auto-advance from Stage 1 to Stage 2 after 4.2 seconds
  useEffect(() => {
    if (stage === 'team') {
      stageTimeoutRef.current = setTimeout(() => {
        advanceToBrand();
      }, 4200);
    }
    return () => {
      if (stageTimeoutRef.current) clearTimeout(stageTimeoutRef.current);
    };
  }, [stage, advanceToBrand]);

  // Timer: In Stage 2, auto-enter website after ~4.5 seconds (total ~8.7s) if user doesn't click
  useEffect(() => {
    if (stage === 'brand') {
      autoEnterTimeoutRef.current = setTimeout(() => {
        handleFinish();
      }, 4500);
    }
    return () => {
      if (autoEnterTimeoutRef.current) clearTimeout(autoEnterTimeoutRef.current);
    };
  }, [stage, handleFinish]);

  // Global keydown handler:
  // - Escape: Skips intro entirely
  // - Space or Enter: In stage 1 advances to brand, in stage 2 enters website
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleFinish();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (stage === 'team') {
          advanceToBrand();
        } else {
          handleFinish();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, advanceToBrand, handleFinish]);

  // Floating vernacular characters for Stage 2
  const floatingChars = [
    { char: 'अ', script: 'Devanagari', top: '14%', left: '8%', delay: '0s', size: '2.5rem' },
    { char: 'আ', script: 'Bengali', top: '20%', right: '10%', delay: '1.2s', size: '2.8rem' },
    { char: 'ᱥ', script: 'Ol Chiki (Santali)', bottom: '22%', left: '10%', delay: '2.4s', size: '2.4rem' },
    { char: 'ᱚ', script: 'Ol Chiki', top: '36%', left: '18%', delay: '0.8s', size: '2.2rem' },
    { char: 'म', script: 'Devanagari', bottom: '26%', right: '14%', delay: '1.8s', size: '2.6rem' },
    { char: 'হ', script: 'Bengali', top: '16%', left: '44%', delay: '3.1s', size: '2.2rem' },
    { char: 'क', script: 'Devanagari', bottom: '16%', right: '32%', delay: '2.1s', size: '2.3rem' },
    { char: 'A', script: 'Latin', bottom: '32%', left: '34%', delay: '1.5s', size: '2.1rem' }
  ];

  const titleLetters = 'BHASHA SETU'.split('');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="BHASHA SETU Interactive Introduction"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#070b14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out'
      }}
      onClick={() => {
        if (stage === 'team') {
          advanceToBrand();
        } else {
          handleFinish();
        }
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      {/* Connected Constellation SVG Network */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.2
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

      {/* Top Header Bar: Stage Tracker & Skip Intro Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20
        }}
      >
        {/* Stage progress pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            color: '#94a3b8',
            backdropFilter: 'blur(8px)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#38bdf8',
              boxShadow: '0 0 8px #38bdf8'
            }}
          />
          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
            {stage === 'team' ? 'Stage 1 of 2: Team Intro' : 'Stage 2 of 2: Brand Showcase'}
          </span>
        </div>

        {/* Skip Intro button for evaluators / judges */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFinish();
          }}
          aria-label="Skip intro and go straight to website"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#f1f5f9',
            padding: '7px 16px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
            e.currentTarget.style.borderColor = '#38bdf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <span>Skip Intro</span>
          <span style={{ color: '#38bdf8' }}>⏭</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* STAGE 1: TEAM INTRO                                      */}
      {/* ======================================================== */}
      {stage === 'team' && (
        <div
          style={{
            maxWidth: '1040px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            paddingTop: '20px'
          }}
        >
          {/* SIH Innovation Badge */}
          <div
            className="intro-badge-animate"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#38bdf8',
              marginBottom: '1rem',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
            }}
          >
            <SparklesIcon size={16} />
            <span>Smart India Hackathon • Student Innovators</span>
          </div>

          {/* Heading */}
          <h2
            className="intro-heading-animate"
            style={{
              fontSize: 'clamp(1.8rem, 4.5vw, 2.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.4rem',
              lineHeight: 1.2
            }}
          >
            Meet the Team Behind{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              BHASHA SETU
            </span>
          </h2>

          <p
            className="intro-heading-animate"
            style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
              color: '#94a3b8',
              marginBottom: '2rem'
            }}
          >
            Six student engineers developing AI-powered vernacular pedagogy for primary education
          </p>

          {/* 6 Team Members Grid: Staggered animated cascade */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              marginBottom: '2rem',
              width: '100%'
            }}
          >
            {TEAM_MEMBERS.map((member, index) => (
              <div
                key={member.name}
                className="member-card-in"
                style={{
                  animationDelay: `${0.12 + index * 0.18}s`,
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Glow accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '3px',
                    height: '100%',
                    backgroundColor: '#38bdf8'
                  }}
                />

                {/* Member Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: '62px',
                      height: '62px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #38bdf8',
                      boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)'
                    }}
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    style={{
                      display: 'none',
                      width: '62px',
                      height: '62px',
                      borderRadius: '50%',
                      backgroundColor: '#1e293b',
                      border: '2px solid #38bdf8',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontSize: '1.1rem'
                    }}
                  >
                    {member.initials}
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#22c55e',
                      borderRadius: '50%',
                      border: '2px solid #0f172a'
                    }}
                    title="Verified contributor"
                  />
                </div>

                {/* Member Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '0.96rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      marginBottom: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#38bdf8',
                      marginBottom: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {member.role}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      color: '#94a3b8',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {member.department}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row & Auto-Advance Progress */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                advanceToBrand();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#38bdf8';
                e.currentTarget.style.color = '#070b14';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.color = '#38bdf8';
              }}
            >
              <span>Continue to Brand Intro</span>
              <ArrowRightIcon size={16} />
            </button>

            {/* Auto advance timer indicator bar */}
            <div
              style={{
                width: '180px',
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                overflow: 'hidden',
                marginTop: '4px'
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#38bdf8',
                  animation: 'progressBar 4.2s linear forwards'
                }}
              />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Auto-advancing in a few seconds • Click anywhere or press Enter to advance
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STAGE 2: BRAND LANDING PAGE                              */}
      {/* ======================================================== */}
      {stage === 'brand' && (
        <>
          {/* Floating Vernacular Characters */}
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

          {/* Central Brand Box */}
          <div
            style={{
              maxWidth: '860px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 10,
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
              transition: 'opacity 0.35s ease, transform 0.35s ease'
            }}
          >
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
                marginBottom: '2.2rem',
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
                marginBottom: '2.5rem',
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
                  handleFinish();
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
        </>
      )}

      {/* Embedded Styles for Smooth Cinematic Keyframes */}
      <style>{`
        @keyframes memberCardIn {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .member-card-in {
          animation: memberCardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .member-card-in:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: #38bdf8;
          box-shadow: 0 12px 28px rgba(56, 189, 248, 0.25);
        }

        @keyframes introBadgeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intro-badge-animate {
          animation: introBadgeIn 0.5s ease-out both;
        }

        @keyframes introHeadingIn {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intro-heading-animate {
          animation: introHeadingIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes progressBar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

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
          .enter-btn-glow,
          .member-card-in,
          .intro-badge-animate,
          .intro-heading-animate {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};
