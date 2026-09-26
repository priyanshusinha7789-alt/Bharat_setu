import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightIcon, SparklesIcon, Volume2Icon } from './Icons';
import { TEAM_MEMBERS } from '../data/team';

interface WelcomeLandingProps {
  onEnter: () => void;
}

interface FloatingMember {
  id: string;
  name: string;
  shortName: string;
  roleShort: string;
  roleFull: string;
  department: string;
  image?: string;
  initials: string;
  size: number;
  mobileSize: number;
  // Position around center: top, bottom, left, right, and corners
  positionStyle: React.CSSProperties;
  mobilePositionClass: string;
  animationClass: string;
  duration: string;
  delay: string;
  depth: number;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Transition handler when entering website
  const handleTransition = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 450);
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

  // Mouse move handler for gentle depth parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to +1
    const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to +1
    setMousePos({ x, y });
  };

  // Six existing team members positioned around center: Top, Bottom, Left, Right, and Corners
  const floatingMembers: FloatingMember[] = [
    {
      id: 'top-priyanshu',
      name: TEAM_MEMBERS[0].name,
      shortName: 'Priyanshu',
      roleShort: 'Team Lead',
      roleFull: TEAM_MEMBERS[0].role,
      department: TEAM_MEMBERS[0].department,
      image: TEAM_MEMBERS[0].image,
      initials: TEAM_MEMBERS[0].initials,
      size: 90,
      mobileSize: 52,
      // TOP: centered horizontally above the central box
      positionStyle: { top: '5%', left: '50%' },
      mobilePositionClass: 'pos-top',
      animationClass: 'animate-float-top',
      duration: '7.8s',
      delay: '0s',
      depth: 1.15
    },
    {
      id: 'bottom-aditya',
      name: TEAM_MEMBERS[2].name,
      shortName: 'Aditya',
      roleShort: 'AI / ML Engineer',
      roleFull: TEAM_MEMBERS[2].role,
      department: TEAM_MEMBERS[2].department,
      image: TEAM_MEMBERS[2].image,
      initials: TEAM_MEMBERS[2].initials,
      size: 88,
      mobileSize: 52,
      // BOTTOM: centered horizontally below the central box
      positionStyle: { bottom: '5%', left: '50%' },
      mobilePositionClass: 'pos-bottom',
      animationClass: 'animate-float-bottom',
      duration: '8.4s',
      delay: '0.8s',
      depth: 1.2
    },
    {
      id: 'left-rommaan',
      name: TEAM_MEMBERS[1].name,
      shortName: 'Rommaan',
      roleShort: 'Frontend Dev',
      roleFull: TEAM_MEMBERS[1].role,
      department: TEAM_MEMBERS[1].department,
      image: TEAM_MEMBERS[1].image,
      initials: TEAM_MEMBERS[1].initials,
      size: 86,
      mobileSize: 50,
      // LEFT: centered vertically to the left of the central box
      positionStyle: { top: '50%', left: '5%' },
      mobilePositionClass: 'pos-left',
      animationClass: 'animate-float-left',
      duration: '8.8s',
      delay: '0.4s',
      depth: 0.95
    },
    {
      id: 'right-snehal',
      name: TEAM_MEMBERS[3].name,
      shortName: 'Snehal',
      roleShort: 'Voice Module AI',
      roleFull: TEAM_MEMBERS[3].role,
      department: TEAM_MEMBERS[3].department,
      image: TEAM_MEMBERS[3].image,
      initials: TEAM_MEMBERS[3].initials,
      size: 84,
      mobileSize: 50,
      // RIGHT: centered vertically to the right of the central box
      positionStyle: { top: '50%', right: '5%' },
      mobilePositionClass: 'pos-right',
      animationClass: 'animate-float-right',
      duration: '7.4s',
      delay: '1.2s',
      depth: 1.05
    },
    {
      id: 'corner-tr-ishan',
      name: TEAM_MEMBERS[4].name,
      shortName: 'Ishan',
      roleShort: 'Backend Developer',
      roleFull: TEAM_MEMBERS[4].role,
      department: TEAM_MEMBERS[4].department,
      image: TEAM_MEMBERS[4].image,
      initials: TEAM_MEMBERS[4].initials,
      size: 82,
      mobileSize: 48,
      // TOP-RIGHT CORNER
      positionStyle: { top: '12%', right: '9%' },
      mobilePositionClass: 'pos-corner-tr',
      animationClass: 'animate-float-corner-tr',
      duration: '8.2s',
      delay: '0.6s',
      depth: 0.9
    },
    {
      id: 'corner-bl-shayantan',
      name: TEAM_MEMBERS[5].name,
      shortName: 'Shayantan',
      roleShort: 'Research & QA',
      roleFull: TEAM_MEMBERS[5].role,
      department: TEAM_MEMBERS[5].department,
      image: TEAM_MEMBERS[5].image,
      initials: TEAM_MEMBERS[5].initials,
      size: 82,
      mobileSize: 48,
      // BOTTOM-LEFT CORNER
      positionStyle: { bottom: '12%', left: '9%' },
      mobilePositionClass: 'pos-corner-bl',
      animationClass: 'animate-float-corner-bl',
      duration: '9.2s',
      delay: '1.5s',
      depth: 1.0
    }
  ];

  // Multilingual education & pedagogy floating elements
  const speechBubbles = [
    { text: 'A ⇄ 文', script: 'Translation', top: '24%', left: '16%', dur: '6.8s', delay: '0.3s' },
    { text: 'ज्ञान', script: 'Devanagari (Knowledge)', top: '22%', right: '17%', dur: '7.5s', delay: '1.2s' },
    { text: 'ᱥᱮᱪᱮᱫ', script: 'Ol Chiki (Learning)', bottom: '24%', left: '17%', dur: '7.1s', delay: '2.0s' },
    { text: 'শিখুন', script: 'Bengali (Learn)', bottom: '22%', right: '16%', dur: '8.0s', delay: '0.9s' }
  ];

  // Floating vernacular characters
  const floatingChars = [
    { char: 'अ', top: '16%', left: '33%', delay: '0.2s', size: '2.4rem' },
    { char: 'আ', top: '16%', right: '33%', delay: '1.4s', size: '2.5rem' },
    { char: 'ᱚ', bottom: '18%', left: '32%', delay: '0.8s', size: '2.2rem' },
    { char: 'म', bottom: '18%', right: '32%', delay: '2.2s', size: '2.3rem' }
  ];

  const titleLetters = 'BHASHA SETU'.split('');

  return (
    <div
      onClick={handleTransition}
      onMouseMove={handleMouseMove}
      role="region"
      aria-label="BHASHA SETU Welcome Screen with Floating Team. Click anywhere or press Enter to continue."
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#070b14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out'
      }}
    >
      {/* Background ambient radial glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '15%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '12%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, rgba(37, 99, 235, 0.04) 50%, transparent 70%)',
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
        <line x1="50%" y1="12%" x2="91%" y2="18%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="91%" y1="18%" x2="95%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="95%" y1="50%" x2="50%" y2="88%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="88%" x2="9%" y2="82%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="9%" y1="82%" x2="5%" y2="50%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="5%" y1="50%" x2="50%" y2="12%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50%" cy="12%" r="4" fill="#38bdf8" />
        <circle cx="91%" cy="18%" r="4" fill="#60a5fa" />
        <circle cx="95%" cy="50%" r="4" fill="#2dd4bf" />
        <circle cx="50%" cy="88%" r="4" fill="#a78bfa" />
        <circle cx="9%" cy="82%" r="4" fill="#60a5fa" />
        <circle cx="5%" cy="50%" r="4" fill="#38bdf8" />
      </svg>

      {/* Top Header Controls: Skip / Enter Directly Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 35
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTransition();
          }}
          aria-label="Enter website directly"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#e2e8f0',
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
          <span>Enter Directly</span>
          <span style={{ color: '#38bdf8' }}>⏭</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* FLOATING TEAM MEMBERS (Top, Bottom, Left, Right, Corners)*/}
      {/* ======================================================== */}
      {floatingMembers.map((member) => {
        // Multi-layered interactive mouse parallax offset
        const parallaxX = mousePos.x * member.depth * 15;
        const parallaxY = mousePos.y * member.depth * 15;

        return (
          <div
            key={member.id}
            className={`floating-member-positioner ${member.mobilePositionClass}`}
            style={{
              position: 'absolute',
              ...member.positionStyle,
              zIndex: 15
            }}
          >
            {/* Parallax layer */}
            <div
              style={{
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.18s ease-out'
              }}
            >
              {/* Continuous floating animation layer with independent rotation */}
              <div
                className={member.animationClass}
                style={{
                  animationDuration: member.duration,
                  animationDelay: member.delay
                }}
              >
                {/* Photo Frame Container */}
                <div
                  className="photo-frame-bubble"
                  title={`${member.name} — ${member.roleFull} (${member.department})`}
                  style={{
                    position: 'relative',
                    width: `${member.size}px`,
                    height: `${member.size}px`,
                    borderRadius: '50%',
                    padding: '3px',
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.95) 0%, rgba(99, 102, 241, 0.5) 100%)',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.45), 0 0 50px rgba(14, 165, 233, 0.2), 0 12px 30px rgba(0, 0, 0, 0.65)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer'
                  }}
                >
                  {/* Subtle soft cyan aura glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '-8px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
                      filter: 'blur(8px)',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Member Photo */}
                  <img
                    src={member.image || ''}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />

                  {/* Fallback initials if image fails */}
                  <div
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: '#0f172a',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      fontWeight: 700,
                      fontSize: '1.15rem'
                    }}
                  >
                    {member.initials}
                  </div>

                  {/* Online / Active Indicator Dot */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '14px',
                      height: '14px',
                      backgroundColor: '#22c55e',
                      borderRadius: '50%',
                      border: '2px solid #070b14',
                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.7)'
                    }}
                    title="Verified Team Contributor"
                  />

                  {/* Floating Identity Pill Tag Below Frame */}
                  <div
                    className="member-tag-pill"
                    style={{
                      position: 'absolute',
                      bottom: '-15px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'rgba(7, 11, 20, 0.94)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '999px',
                      padding: '2.5px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: '#e2e8f0',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(8px)',
                      pointerEvents: 'none',
                      letterSpacing: '0.01em'
                    }}
                  >
                    <span style={{ color: '#38bdf8' }}>{member.shortName}</span>
                    <span style={{ color: '#64748b', margin: '0 4px' }}>•</span>
                    <span style={{ color: '#cbd5e1' }}>{member.roleShort}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ======================================================== */}
      {/* FLOATING MULTILINGUAL & PEDAGOGY ELEMENTS                */}
      {/* ======================================================== */}
      {speechBubbles.map((bubble, i) => (
        <div
          key={i}
          className="floating-speech-bubble"
          style={{
            position: 'absolute',
            top: bubble.top,
            bottom: bubble.bottom,
            left: bubble.left,
            right: bubble.right,
            zIndex: 12,
            backgroundColor: 'rgba(15, 23, 42, 0.68)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            padding: '5px 14px',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#38bdf8',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
            pointerEvents: 'none',
            animation: `floatBubble ${bubble.dur} ease-in-out infinite`,
            animationDelay: bubble.delay
          }}
          title={bubble.script}
        >
          <span>{bubble.text}</span>
        </div>
      ))}

      {/* Ambient Vernacular Glyphs */}
      {floatingChars.map((item, index) => (
        <div
          key={index}
          className="floating-glyph"
          style={{
            position: 'absolute',
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            fontSize: item.size,
            fontWeight: 700,
            color: 'rgba(56, 189, 248, 0.16)',
            animation: `floatSlow 6.5s ease-in-out infinite`,
            animationDelay: item.delay,
            pointerEvents: 'none',
            textShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
            zIndex: 8
          }}
        >
          {item.char}
        </div>
      ))}

      {/* ======================================================== */}
      {/* CENTRAL BRANDING & CALL-TO-ACTION                        */}
      {/* ======================================================== */}
      <div
        style={{
          maxWidth: '680px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 25,
          padding: '12px 18px'
        }}
      >
        {/* SIH Hackathon Glowing Badge */}
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
            marginBottom: '1.25rem',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)'
          }}
        >
          <SparklesIcon size={16} />
          <span>Smart India Hackathon • Vernacular Pedagogy</span>
        </div>

        {/* Brand Name with Staggered Letter-Reveal Animation */}
        <h1
          style={{
            fontSize: 'clamp(2.6rem, 7.5vw, 5.2rem)',
            fontWeight: 800,
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            marginBottom: '1rem',
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
            fontSize: 'clamp(1.15rem, 3vw, 1.85rem)',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '0.65rem',
            letterSpacing: '-0.01em',
            animationDelay: '0.7s',
            textShadow: '0 0 30px rgba(56, 189, 248, 0.3)'
          }}
        >
          “We Don’t Translate Words, We Translate Learnings.”
        </div>

        {/* Supporting Line */}
        <p
          className="fade-in-delayed"
          style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            fontWeight: 500,
            marginBottom: '1.85rem',
            animationDelay: '0.9s'
          }}
        >
          Bridging Languages, Empowering Learning.
        </p>

        {/* Audio / Voicewave Badge */}
        <div
          className="fade-in-delayed"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid #1e293b',
            borderRadius: '999px',
            padding: '7px 18px',
            marginBottom: '2.2rem',
            animationDelay: '1.1s'
          }}
        >
          <Volume2Icon size={18} style={{ color: '#38bdf8' }} />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
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
              padding: '15px 36px',
              borderRadius: '12px',
              fontSize: '1.08rem',
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
            marginTop: '1.25rem',
            fontSize: '0.8rem',
            color: '#64748b',
            letterSpacing: '0.04em',
            animationDelay: '1.5s'
          }}
        >
          Click anywhere or press Enter to continue
        </div>
      </div>

      {/* ======================================================== */}
      {/* CSS KEYFRAMES & STYLING FOR FLOATING MOVEMENTS           */}
      {/* ======================================================== */}
      <style>{`
        /* Independent floating movements for TOP, BOTTOM, LEFT, RIGHT, and CORNERS */
        
        /* 1. TOP (Priyanshu): Centered horizontally, undulating vertically with gentle tilt */
        @keyframes floatTopKeyframe {
          0%, 100% {
            transform: translate(-50%, 0px) rotate(0deg);
          }
          33% {
            transform: translate(calc(-50% + 8px), -14px) rotate(2deg);
          }
          66% {
            transform: translate(calc(-50% - 9px), 8px) rotate(-1.5deg);
          }
        }
        .animate-float-top {
          animation: floatTopKeyframe infinite ease-in-out;
        }

        /* 2. BOTTOM (Aditya): Centered horizontally, swaying vertically and horizontally */
        @keyframes floatBottomKeyframe {
          0%, 100% {
            transform: translate(-50%, 0px) rotate(0deg);
          }
          33% {
            transform: translate(calc(-50% - 10px), 12px) rotate(-2deg);
          }
          66% {
            transform: translate(calc(-50% + 9px), -9px) rotate(1.8deg);
          }
        }
        .animate-float-bottom {
          animation: floatBottomKeyframe infinite ease-in-out;
        }

        /* 3. LEFT (Rommaan): Centered vertically, drifting horizontally with tilt */
        @keyframes floatLeftKeyframe {
          0%, 100% {
            transform: translate(0px, -50%) rotate(0deg);
          }
          33% {
            transform: translate(11px, calc(-50% + 10px)) rotate(1.8deg);
          }
          66% {
            transform: translate(-7px, calc(-50% - 12px)) rotate(-2deg);
          }
        }
        .animate-float-left {
          animation: floatLeftKeyframe infinite ease-in-out;
        }

        /* 4. RIGHT (Snehal): Centered vertically, counter-drifting horizontally with tilt */
        @keyframes floatRightKeyframe {
          0%, 100% {
            transform: translate(0px, -50%) rotate(0deg);
          }
          33% {
            transform: translate(-10px, calc(-50% - 11px)) rotate(-1.8deg);
          }
          66% {
            transform: translate(12px, calc(-50% + 9px)) rotate(2deg);
          }
        }
        .animate-float-right {
          animation: floatRightKeyframe infinite ease-in-out;
        }

        /* 5. TOP-RIGHT CORNER (Ishan): Orbiting diagonally */
        @keyframes floatCornerTRKeyframe {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(-12px, 11px) rotate(-2deg);
          }
          66% {
            transform: translate(10px, -11px) rotate(1.8deg);
          }
        }
        .animate-float-corner-tr {
          animation: floatCornerTRKeyframe infinite ease-in-out;
        }

        /* 6. BOTTOM-LEFT CORNER (Shayantan): Counter-orbiting diagonally */
        @keyframes floatCornerBLKeyframe {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(12px, -10px) rotate(2deg);
          }
          66% {
            transform: translate(-9px, 12px) rotate(-1.8deg);
          }
        }
        .animate-float-corner-bl {
          animation: floatCornerBLKeyframe infinite ease-in-out;
        }

        /* Hover interactions on photo bubbles */
        .photo-frame-bubble:hover {
          transform: scale(1.12) !important;
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.8), 0 0 65px rgba(14, 165, 233, 0.4), 0 16px 36px rgba(0, 0, 0, 0.75) !important;
        }

        /* Speech bubbles float animation */
        @keyframes floatBubble {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(-1.5deg);
          }
        }

        /* Ambient characters float */
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
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

        /* Soundwave animation */
        @keyframes wavePulse {
          0%, 100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1);
          }
        }

        .soundwave-bar {
          width: 3px;
          border-radius: 999px;
          display: inline-block;
          animation: wavePulse 1.2s ease-in-out infinite;
        }
        .soundwave-bar:nth-child(2) {
          animation-delay: 0.2s;
        }
        .soundwave-bar:nth-child(3) {
          animation-delay: 0.4s;
        }

        /* Responsive adjustments for Mobile screens */
        @media (max-width: 768px) {
          .floating-member-positioner.pos-top {
            top: 2% !important;
            left: 50% !important;
          }
          .floating-member-positioner.pos-bottom {
            bottom: 2% !important;
            left: 50% !important;
          }
          .floating-member-positioner.pos-left {
            top: 28% !important;
            left: 2% !important;
          }
          .floating-member-positioner.pos-right {
            top: 28% !important;
            right: 2% !important;
          }
          .floating-member-positioner.pos-corner-tr {
            top: 72% !important;
            right: 4% !important;
          }
          .floating-member-positioner.pos-corner-bl {
            bottom: 12% !important;
            left: 4% !important;
          }

          .photo-frame-bubble {
            width: 50px !important;
            height: 50px !important;
          }

          .member-tag-pill {
            display: none !important;
          }

          .floating-speech-bubble {
            display: none !important;
          }
        }

        /* Accessibility: Support reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-float-top,
          .animate-float-bottom,
          .animate-float-left,
          .animate-float-right,
          .animate-float-corner-tr,
          .animate-float-corner-bl,
          .photo-frame-bubble,
          .reveal-letter,
          .fade-in-delayed,
          .floating-glyph,
          .floating-speech-bubble,
          .enter-btn-glow,
          .soundwave-bar {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};
