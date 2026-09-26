import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRightIcon, SparklesIcon, Volume2Icon } from './Icons';
import { TEAM_MEMBERS } from '../data/team';

interface WelcomeLandingProps {
  onEnter: () => void;
}

interface FloatingMemberData {
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
  pos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  mobilePos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animation: string;
  duration: string;
  delay: string;
  depth: number;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Smooth exit transition handler
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

  // Mouse move handler for gentle interactive parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  // Define the 6 floating team members placed in a balanced orbital perimeter around the center
  const floatingMembers: FloatingMemberData[] = [
    {
      id: 'priyanshu',
      name: TEAM_MEMBERS[0].name,
      shortName: 'Priyanshu',
      roleShort: 'Team Lead',
      roleFull: TEAM_MEMBERS[0].role,
      department: TEAM_MEMBERS[0].department,
      image: TEAM_MEMBERS[0].image,
      initials: TEAM_MEMBERS[0].initials,
      size: 84,
      mobileSize: 52,
      pos: { top: '8%', left: '7%' },
      mobilePos: { top: '3%', left: '3%' },
      animation: 'floatPhoto1',
      duration: '7.8s',
      delay: '0s',
      depth: 1.1
    },
    {
      id: 'rommaan',
      name: TEAM_MEMBERS[1].name,
      shortName: 'Rommaan',
      roleShort: 'Frontend',
      roleFull: TEAM_MEMBERS[1].role,
      department: TEAM_MEMBERS[1].department,
      image: TEAM_MEMBERS[1].image,
      initials: TEAM_MEMBERS[1].initials,
      size: 78,
      mobileSize: 50,
      pos: { top: '9%', right: '8%' },
      mobilePos: { top: '3%', right: '3%' },
      animation: 'floatPhoto2',
      duration: '8.4s',
      delay: '0.6s',
      depth: 0.9
    },
    {
      id: 'aditya',
      name: TEAM_MEMBERS[2].name,
      shortName: 'Aditya',
      roleShort: 'AI / ML',
      roleFull: TEAM_MEMBERS[2].role,
      department: TEAM_MEMBERS[2].department,
      image: TEAM_MEMBERS[2].image,
      initials: TEAM_MEMBERS[2].initials,
      size: 86,
      mobileSize: 54,
      pos: { top: '48%', left: '4%' },
      mobilePos: { top: '33%', left: '2%' },
      animation: 'floatPhoto3',
      duration: '9.2s',
      delay: '1.2s',
      depth: 1.2
    },
    {
      id: 'snehal',
      name: TEAM_MEMBERS[3].name,
      shortName: 'Snehal',
      roleShort: 'Voice AI',
      roleFull: TEAM_MEMBERS[3].role,
      department: TEAM_MEMBERS[3].department,
      image: TEAM_MEMBERS[3].image,
      initials: TEAM_MEMBERS[3].initials,
      size: 80,
      mobileSize: 52,
      pos: { top: '46%', right: '4%' },
      mobilePos: { top: '33%', right: '2%' },
      animation: 'floatPhoto4',
      duration: '7.4s',
      delay: '0.4s',
      depth: 0.95
    },
    {
      id: 'ishan',
      name: TEAM_MEMBERS[4].name,
      shortName: 'Ishan',
      roleShort: 'Backend',
      roleFull: TEAM_MEMBERS[4].role,
      department: TEAM_MEMBERS[4].department,
      image: TEAM_MEMBERS[4].image,
      initials: TEAM_MEMBERS[4].initials,
      size: 76,
      mobileSize: 48,
      pos: { bottom: '9%', left: '8%' },
      mobilePos: { bottom: '5%', left: '3%' },
      animation: 'floatPhoto5',
      duration: '8.1s',
      delay: '1.5s',
      depth: 1.05
    },
    {
      id: 'shayantan',
      name: TEAM_MEMBERS[5].name,
      shortName: 'Shayantan',
      roleShort: 'Research & QA',
      roleFull: TEAM_MEMBERS[5].role,
      department: TEAM_MEMBERS[5].department,
      image: TEAM_MEMBERS[5].image,
      initials: TEAM_MEMBERS[5].initials,
      size: 78,
      mobileSize: 50,
      pos: { bottom: '8%', right: '8%' },
      mobilePos: { bottom: '5%', right: '3%' },
      animation: 'floatPhoto6',
      duration: '8.7s',
      delay: '0.8s',
      depth: 0.88
    }
  ];

  // Floating multilingual education speech bubbles & language symbols
  const speechBubbles = [
    { text: 'A ⇄ 文', script: 'Translation', top: '24%', left: '16%', delay: '0.5s', dur: '6.5s' },
    { text: 'ज्ञान', script: 'Devanagari (Knowledge)', top: '22%', right: '18%', delay: '1.4s', dur: '7.2s' },
    { text: 'ᱥᱮᱪᱮᱫ', script: 'Ol Chiki (Learning)', bottom: '24%', left: '17%', delay: '2.1s', dur: '6.8s' },
    { text: 'শিখুন', script: 'Bengali (Learn)', bottom: '22%', right: '17%', delay: '1.0s', dur: '7.6s' }
  ];

  // Subtle floating background vernacular glyphs
  const floatingChars = [
    { char: 'अ', top: '15%', left: '32%', delay: '0.2s', size: '2.2rem' },
    { char: 'আ', top: '16%', right: '32%', delay: '1.6s', size: '2.4rem' },
    { char: 'ᱚ', bottom: '16%', left: '34%', delay: '1.1s', size: '2rem' },
    { char: 'म', bottom: '15%', right: '33%', delay: '2.4s', size: '2.2rem' }
  ];

  const titleLetters = 'BHASHA SETU'.split('');

  return (
    <div
      onClick={handleTransition}
      onMouseMove={handleMouseMove}
      role="region"
      aria-label="BHASHA SETU Floating Team & Brand Welcome Screen. Click anywhere or press Enter to continue to website."
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
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out'
      }}
    >
      {/* Background ambient radial gradients */}
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
          opacity: 0.18
        }}
      >
        <line x1="8%" y1="12%" x2="16%" y2="28%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="16%" y1="28%" x2="50%" y2="22%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="22%" x2="84%" y2="14%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="84%" y1="14%" x2="92%" y2="48%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="92%" y1="48%" x2="84%" y2="84%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="84%" y1="84%" x2="50%" y2="78%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="50%" y1="78%" x2="14%" y2="82%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="14%" y1="82%" x2="6%" y2="48%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="6%" y1="48%" x2="8%" y2="12%" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="8%" cy="12%" r="4" fill="#38bdf8" />
        <circle cx="84%" cy="14%" r="4" fill="#60a5fa" />
        <circle cx="92%" cy="48%" r="4" fill="#2dd4bf" />
        <circle cx="84%" cy="84%" r="4" fill="#a78bfa" />
        <circle cx="14%" cy="82%" r="4" fill="#38bdf8" />
        <circle cx="6%" cy="48%" r="4" fill="#2dd4bf" />
      </svg>

      {/* Top Header Controls: Skip Button */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          zIndex: 30
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTransition();
          }}
          aria-label="Skip to website directly"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            padding: '7px 16px',
            borderRadius: '999px',
            fontSize: '0.8rem',
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
            e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.75)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          }}
        >
          <span>Enter Directly</span>
          <span style={{ color: '#38bdf8' }}>⏭</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* FLOATING TEAM MEMBER PHOTOS (Orbits Around Center)       */}
      {/* ======================================================== */}
      {floatingMembers.map((member) => {
        // Calculate interactive parallax offset
        const parallaxX = mousePos.x * member.depth * 14;
        const parallaxY = mousePos.y * member.depth * 14;

        return (
          <div
            key={member.id}
            className={`floating-member-wrapper ${member.id}`}
            style={{
              position: 'absolute',
              ...member.pos,
              zIndex: 15,
              animation: `${member.animation} ${member.duration} ease-in-out infinite`,
              animationDelay: member.delay,
              transform: `translate(${parallaxX}px, ${parallaxY}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <div
              className="photo-bubble"
              title={`${member.name} (${member.roleFull} - ${member.department})`}
              style={{
                position: 'relative',
                width: `${member.size}px`,
                height: `${member.size}px`,
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9) 0%, rgba(99, 102, 241, 0.4) 100%)',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.4), 0 10px 28px rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer'
              }}
            >
              {/* Actual Member Image */}
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

              {/* Fallback initials if needed */}
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
                  fontSize: '1.1rem'
                }}
              >
                {member.initials}
              </div>

              {/* Green online / verified dot */}
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
                  boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
                }}
              />

              {/* Name & Role Badge Pill Attached to Frame */}
              <div
                className="member-tag-pill"
                style={{
                  position: 'absolute',
                  bottom: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(7, 11, 20, 0.92)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '999px',
                  padding: '2px 9px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.55)',
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
        );
      })}

      {/* ======================================================== */}
      {/* FLOATING MULTILINGUAL SPEECH BUBBLES                     */}
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
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '5px 13px',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#38bdf8',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
            pointerEvents: 'none',
            animation: `floatBubble ${bubble.dur} ease-in-out infinite`,
            animationDelay: bubble.delay
          }}
          title={bubble.script}
        >
          <span>{bubble.text}</span>
        </div>
      ))}

      {/* Subtle Floating Vernacular Glyphs */}
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
            color: 'rgba(56, 189, 248, 0.16)',
            animation: `floatSlow 6s ease-in-out infinite`,
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
          maxWidth: '720px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 20,
          padding: '10px 16px'
        }}
      >
        {/* Glowing SIH Badge */}
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

        {/* Brand Name with Letter-Reveal Animation */}
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

        {/* Supporting Text */}
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
      {/* CSS KEYFRAMES FOR FLOATING MOVEMENTS & RESPONSIVENESS    */}
      {/* ======================================================== */}
      <style>{`
        /* Independent floating movements for each of the 6 photos */
        @keyframes floatPhoto1 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(8px, -15px) rotate(2deg);
          }
          66% {
            transform: translate(-10px, 9px) rotate(-1.5deg);
          }
        }

        @keyframes floatPhoto2 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(-12px, -9px) rotate(-2deg);
          }
          66% {
            transform: translate(7px, 12px) rotate(1.8deg);
          }
        }

        @keyframes floatPhoto3 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(11px, 10px) rotate(1.6deg);
          }
          66% {
            transform: translate(-9px, -12px) rotate(-2deg);
          }
        }

        @keyframes floatPhoto4 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(-10px, 12px) rotate(-1.8deg);
          }
          66% {
            transform: translate(12px, -8px) rotate(1.5deg);
          }
        }

        @keyframes floatPhoto5 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(12px, -11px) rotate(2deg);
          }
          66% {
            transform: translate(-7px, 10px) rotate(-1.6deg);
          }
        }

        @keyframes floatPhoto6 {
          0%, 100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(-11px, 11px) rotate(-2deg);
          }
          66% {
            transform: translate(9px, -9px) rotate(1.6deg);
          }
        }

        /* Hover interaction on photos */
        .photo-bubble:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.8), 0 14px 35px rgba(0, 0, 0, 0.7) !important;
        }

        /* Floating speech bubbles animation */
        @keyframes floatBubble {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(-1.5deg);
          }
        }

        /* Ambient characters floating */
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

        /* Mobile Responsive adjustments: scale photos and reposition */
        @media (max-width: 768px) {
          .floating-member-wrapper.priyanshu { top: 3% !important; left: 3% !important; }
          .floating-member-wrapper.rommaan { top: 3% !important; right: 3% !important; }
          .floating-member-wrapper.aditya { top: 30% !important; left: 2% !important; }
          .floating-member-wrapper.snehal { top: 30% !important; right: 2% !important; }
          .floating-member-wrapper.ishan { bottom: 5% !important; left: 3% !important; }
          .floating-member-wrapper.shayantan { bottom: 5% !important; right: 3% !important; }

          .photo-bubble {
            width: 52px !important;
            height: 52px !important;
          }

          .member-tag-pill {
            display: none !important; /* Hide tiny text on mobile to keep view clean */
          }

          .floating-speech-bubble {
            display: none !important; /* Prevent clutter on small screens */
          }
        }

        /* Accessibility: Support reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .floating-member-wrapper,
          .photo-bubble,
          .reveal-letter,
          .fade-in-delayed,
          .floating-char,
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
