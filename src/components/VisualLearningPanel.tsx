import React, { useState } from 'react';
import { VisualMetadata } from '../hooks/useGeminiTranslation';
import { SparklesIcon } from './Icons';

interface VisualLearningPanelProps {
  visual?: VisualMetadata;
  sourceText?: string;
  targetLangName?: string;
  isLoading?: boolean;
}

export const VisualLearningPanel: React.FC<VisualLearningPanelProps> = ({
  visual,
  sourceText = '',
  targetLangName = 'Vernacular',
  isLoading = false
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // If no visual is passed, fallback to semantic detection
  const visualType = visual?.visualType || 'pedagogy_concept';
  const conceptTitle = visual?.conceptTitle || 'Visual Pedagogical Explanation';
  const keyElements = visual?.keyElements || ['Curricular Concept', 'Mother Tongue', 'Comprehension'];

  const handleReplay = () => {
    setIsPaused(false);
    setReplayKey((prev) => prev + 1);
  };

  const renderScene = () => {
    switch (visualType) {
      case 'plant_growth':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#082f49" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="soilGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3f2e18" />
                <stop offset="100%" stopColor="#221708" />
              </linearGradient>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
              </radialGradient>
            </defs>

            {/* Sky Background */}
            <rect width="400" height="190" fill="url(#skyGrad)" rx="8" />

            {/* Glowing Animated Sun */}
            <g className={isPaused ? '' : 'anim-sun'}>
              <circle cx="80" cy="55" r="32" fill="url(#sunGlow)" opacity="0.4" />
              <circle cx="80" cy="55" r="20" fill="#facc15" />
              {/* Sun Rays */}
              <line x1="80" y1="24" x2="80" y2="12" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="80" y1="86" x2="80" y2="98" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="49" y1="55" x2="37" y2="55" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="111" y1="55" x2="123" y2="55" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="58" y1="33" x2="50" y2="25" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="102" y1="77" x2="110" y2="85" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="102" y1="33" x2="110" y2="25" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="58" y1="77" x2="50" y2="85" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Sunlight Streaming Beam towards plant */}
            <path
              d="M95 70 L 190 140 L 220 145 Z"
              fill="rgba(250, 204, 21, 0.12)"
              className={isPaused ? '' : 'anim-sunbeam'}
            />
            <text x="120" y="80" fill="#fef08a" fontSize="11" fontWeight="600">☀️ Sunlight</text>

            {/* Falling Animated Rain / Water Droplets */}
            <g className={isPaused ? '' : 'anim-raindrops'}>
              <circle cx="280" cy="45" r="4" fill="#38bdf8" />
              <circle cx="310" cy="70" r="3.5" fill="#38bdf8" />
              <circle cx="290" cy="95" r="4" fill="#38bdf8" />
              <text x="300" y="50" fill="#7dd3fc" fontSize="11" fontWeight="600">💧 Water</text>
            </g>

            {/* Soil & Ground */}
            <rect x="0" y="185" width="400" height="55" fill="url(#soilGrad)" rx="4" />
            <line x1="0" y1="185" x2="400" y2="185" stroke="#654a24" strokeWidth="3" />

            {/* Plant Roots underground */}
            <path d="M200 185 Q195 205 185 220" stroke="#854d0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M200 185 Q205 210 215 225" stroke="#854d0e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M200 195 Q202 215 200 230" stroke="#854d0e" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Plant Stem & Foliage */}
            <g className={isPaused ? '' : 'anim-sprout'}>
              <path d="M200 185 Q202 140 200 115" stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" />
              
              {/* Left Leaf */}
              <path d="M198 145 C160 145 155 125 198 135 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
              
              {/* Right Leaf */}
              <path d="M202 135 C240 135 245 115 202 125 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />

              {/* Top Fresh Shoot */}
              <path d="M200 115 C185 95 215 95 200 115 Z" fill="#4ade80" />
              <circle cx="200" cy="100" r="5" fill="#facc15" />
            </g>

            {/* Photosynthesis Glucose/Energy Sparkle */}
            <g className={isPaused ? '' : 'anim-sparkle'} transform="translate(200, 105)">
              <circle cx="0" cy="0" r="14" fill="rgba(74, 222, 128, 0.25)" />
              <text x="18" y="4" fill="#86efac" fontSize="11" fontWeight="700">🌱 Food Prepared</text>
            </g>
          </svg>
        );

      case 'water_cycle':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            <defs>
              <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Background container */}
            <rect width="400" height="240" fill="#081020" rx="8" />

            {/* Ascending Animated Vapour Particles */}
            <g className={isPaused ? '' : 'anim-vapour'} opacity="0.85">
              <path d="M170 100 Q160 70 175 40 Q185 20 175 10" stroke="#bae6fd" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
              <path d="M200 95 Q215 65 195 35 Q185 15 200 5" stroke="#e0f2fe" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="7 5" />
              <path d="M230 100 Q240 70 225 40 Q215 20 225 10" stroke="#bae6fd" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray="6 4" />
              {/* Vapour Cloud Label */}
              <rect x="250" y="25" width="125" height="26" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <text x="258" y="42" fill="#7dd3fc" fontSize="11" fontWeight="700">💨 Vapour (वाष्प)</text>
            </g>

            {/* Beaker / Glass Vessel */}
            <path
              d="M140 85 L140 180 Q140 195 155 195 L245 195 Q260 195 260 180 L260 85"
              fill="rgba(56, 189, 248, 0.05)"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Beaker Rim */}
            <ellipse cx="200" cy="85" rx="60" ry="8" fill="none" stroke="#94a3b8" strokeWidth="3" />

            {/* Boiling Water Level */}
            <path
              d="M144 135 Q172 130 200 135 Q228 140 256 135 L256 182 Q256 191 247 191 L153 191 Q144 191 144 182 Z"
              fill="url(#waterGrad)"
              opacity="0.8"
            />
            {/* Boiling Bubbles */}
            <g className={isPaused ? '' : 'anim-bubbles'} fill="#ffffff" opacity="0.75">
              <circle cx="170" cy="165" r="4" />
              <circle cx="195" cy="150" r="5" />
              <circle cx="225" cy="160" r="3.5" />
              <circle cx="180" cy="140" r="3" />
              <circle cx="215" cy="142" r="4.5" />
            </g>

            {/* Heating Stove / Flame */}
            <g className={isPaused ? '' : 'anim-flame'}>
              <path d="M165 220 Q180 198 185 210 Q195 195 200 205 Q205 195 215 210 Q220 198 235 220 Z" fill="url(#flameGrad)" />
              <line x1="130" y1="225" x2="270" y2="225" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <text x="20" y="215" fill="#f97316" fontSize="12" fontWeight="700">🔥 Heat (ताप)</text>
            </g>
          </svg>
        );

      case 'triangle_geometry':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            {/* Dark background */}
            <rect width="400" height="240" fill="#090f1d" rx="8" />

            {/* Triangle Shape with Sequential Animated Sides */}
            <g transform="translate(100, 30)">
              {/* Vertex A (Top) */}
              <circle cx="100" cy="20" r="7" fill="#38bdf8" />
              <text x="94" y="10" fill="#ffffff" fontSize="12" fontWeight="bold">A</text>

              {/* Vertex B (Bottom Left) */}
              <circle cx="20" cy="160" r="7" fill="#38bdf8" />
              <text x="4" y="175" fill="#ffffff" fontSize="12" fontWeight="bold">B</text>

              {/* Vertex C (Bottom Right) */}
              <circle cx="180" cy="160" r="7" fill="#38bdf8" />
              <text x="188" y="175" fill="#ffffff" fontSize="12" fontWeight="bold">C</text>

              {/* Side 1: Left (A -> B) */}
              <line
                x1="100" y1="20" x2="20" y2="160"
                stroke="#38bdf8"
                strokeWidth="5"
                strokeLinecap="round"
                className={isPaused ? '' : 'anim-side-1'}
              />
              <rect x="25" y="75" width="65" height="22" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
              <text x="32" y="90" fill="#38bdf8" fontSize="11" fontWeight="700">Side 1</text>

              {/* Side 2: Right (A -> C) */}
              <line
                x1="100" y1="20" x2="180" y2="160"
                stroke="#2dd4bf"
                strokeWidth="5"
                strokeLinecap="round"
                className={isPaused ? '' : 'anim-side-2'}
              />
              <rect x="125" y="75" width="65" height="22" rx="4" fill="#0f172a" stroke="#2dd4bf" strokeWidth="1" />
              <text x="132" y="90" fill="#2dd4bf" fontSize="11" fontWeight="700">Side 2</text>

              {/* Side 3: Base (B -> C) */}
              <line
                x1="20" y1="160" x2="180" y2="160"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
                className={isPaused ? '' : 'anim-side-3'}
              />
              <rect x="75" y="170" width="65" height="22" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
              <text x="82" y="185" fill="#f59e0b" fontSize="11" fontWeight="700">Side 3</text>

              {/* Angle Arcs */}
              <path d="M90 38 Q100 48 110 38" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              <path d="M35 152 Q44 148 38 138" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
              <path d="M165 152 Q156 148 162 138" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
            </g>

            {/* Interactive Geometry Properties Badge */}
            <g transform="translate(20, 20)">
              <rect width="130" height="52" rx="6" fill="#141e33" stroke="#20314d" strokeWidth="1" />
              <text x="10" y="20" fill="#ffffff" fontSize="11" fontWeight="700">📐 Triangle Facts:</text>
              <text x="10" y="35" fill="#38bdf8" fontSize="10">• 3 Straight Sides (भुजाएँ)</text>
              <text x="10" y="47" fill="#f43f5e" fontSize="10">• 3 Angles (तीन कोण)</text>
            </g>
          </svg>
        );

      case 'classroom_chat':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            <rect width="400" height="240" fill="#090f1d" rx="8" />

            {/* Teacher Speech Bubble */}
            <g transform="translate(30, 30)" className={isPaused ? '' : 'anim-bubble-left'}>
              <rect width="150" height="75" rx="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="60,105 75,105 60,120" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <rect x="58" y="103" width="20" height="4" fill="#1e293b" />
              <text x="16" y="28" fill="#94a3b8" fontSize="10" fontWeight="700" style={{ textTransform: 'uppercase' }}>Teacher Speaks</text>
              <text x="16" y="48" fill="#ffffff" fontSize="11" fontWeight="600">{sourceText ? sourceText.slice(0, 22) + (sourceText.length > 22 ? '...' : '') : 'English / Hinglish'}</text>
              <circle cx="28" cy="130" r="14" fill="#0284c7" />
              <text x="23" y="135" fill="#ffffff" fontSize="12" fontWeight="bold">T</text>
            </g>

            {/* Connecting Bridge Arrow with animated pulse dots */}
            <g transform="translate(195, 70)" className={isPaused ? '' : 'anim-bridge-pulse'}>
              <line x1="0" y1="0" x2="35" y2="0" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 4" />
              <polygon points="35,-6 45,0 35,6" fill="#38bdf8" />
              <circle cx="18" cy="0" r="4" fill="#2dd4bf" />
              <text x="-15" y="-12" fill="#38bdf8" fontSize="10" fontWeight="700">BHASHA SETU</text>
            </g>

            {/* Student Vernacular Bubble */}
            <g transform="translate(220, 110)" className={isPaused ? '' : 'anim-bubble-right'}>
              <rect width="150" height="75" rx="12" fill="#142640" stroke="#2dd4bf" strokeWidth="2" />
              <polygon points="100,-15 115,-15 115,0" fill="#142640" stroke="#2dd4bf" strokeWidth="2" />
              <rect x="98" y="-3" width="20" height="4" fill="#142640" />
              <text x="16" y="28" fill="#2dd4bf" fontSize="10" fontWeight="700" style={{ textTransform: 'uppercase' }}>{targetLangName}</text>
              <text x="16" y="48" fill="#ffffff" fontSize="11" fontWeight="600">Mother Tongue Clarity</text>
              <circle cx="130" cy="-22" r="14" fill="#10b981" />
              <text x="125" y="-17" fill="#ffffff" fontSize="12" fontWeight="bold">S</text>
            </g>
          </svg>
        );

      case 'counting_math':
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            <rect width="400" height="240" fill="#090f1d" rx="8" />

            <g transform="translate(40, 50)">
              {/* Number Block 1 */}
              <rect x="20" y="30" width="60" height="60" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" className={isPaused ? '' : 'anim-block-1'} />
              <text x="44" y="68" fill="#ffffff" fontSize="24" fontWeight="bold">1</text>
              <circle cx="50" cy="110" r="8" fill="#38bdf8" />

              {/* Plus Sign */}
              <text x="105" y="70" fill="#facc15" fontSize="28" fontWeight="bold">+</text>

              {/* Number Block 2 */}
              <rect x="135" y="30" width="60" height="60" rx="10" fill="#0f766e" stroke="#2dd4bf" strokeWidth="2" className={isPaused ? '' : 'anim-block-2'} />
              <text x="159" y="68" fill="#ffffff" fontSize="24" fontWeight="bold">2</text>
              <circle cx="155" cy="110" r="8" fill="#2dd4bf" />
              <circle cx="175" cy="110" r="8" fill="#2dd4bf" />

              {/* Equal Sign */}
              <text x="220" y="70" fill="#facc15" fontSize="28" fontWeight="bold">=</text>

              {/* Result Block 3 */}
              <rect x="250" y="20" width="70" height="70" rx="12" fill="#7c2d12" stroke="#f97316" strokeWidth="2.5" className={isPaused ? '' : 'anim-block-3'} />
              <text x="277" y="65" fill="#ffffff" fontSize="30" fontWeight="bold">3</text>
              <circle cx="268" cy="110" r="8" fill="#f97316" />
              <circle cx="285" cy="110" r="8" fill="#f97316" />
              <circle cx="302" cy="110" r="8" fill="#f97316" />
            </g>

            <text x="200" y="195" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="600">
              Visual Counting & Numeracy for Primary Children
            </text>
          </svg>
        );

      default:
        // Default animated glowing book with floating vernacular particles
        return (
          <svg viewBox="0 0 400 240" className="w-full h-full" style={{ width: '100%', height: '100%', maxHeight: '230px' }}>
            <rect width="400" height="240" fill="#090f1d" rx="8" />

            {/* Glowing Open Book */}
            <g transform="translate(130, 90)">
              {/* Left Page */}
              <path d="M70 60 Q35 50 0 55 L0 10 Q35 5 70 15 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              {/* Right Page */}
              <path d="M70 60 Q105 50 140 55 L140 10 Q105 5 70 15 Z" fill="#1e293b" stroke="#2dd4bf" strokeWidth="2" />
              {/* Book Spine */}
              <line x1="70" y1="15" x2="70" y2="60" stroke="#38bdf8" strokeWidth="3" />
            </g>

            {/* Floating Conceptual Letters / Particles */}
            <g className={isPaused ? '' : 'anim-letters'}>
              <text x="160" y="60" fill="#38bdf8" fontSize="18" fontWeight="bold" opacity="0.8">अ</text>
              <text x="220" y="55" fill="#2dd4bf" fontSize="18" fontWeight="bold" opacity="0.8">আ</text>
              <text x="190" y="40" fill="#facc15" fontSize="18" fontWeight="bold" opacity="0.9">ᱥ</text>
              <text x="240" y="80" fill="#a78bfa" fontSize="16" fontWeight="bold" opacity="0.7">A</text>
            </g>

            {/* Educational Sparkle Aura */}
            <circle cx="200" cy="115" r="45" fill="rgba(56, 189, 248, 0.1)" />
            <text x="200" y="195" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="600">
              Mother Tongue-Based Primary Pedagogy
            </text>
          </svg>
        );
    }
  };

  return (
    <div
      key={replayKey}
      style={{
        marginTop: '1.5rem',
        backgroundColor: '#070c18',
        border: '1px solid #1e3a5f',
        borderRadius: '12px',
        padding: '18px',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)'
      }}
    >
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '12px',
        paddingBottom: '10px',
        borderBottom: '1px solid #182740'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <SparklesIcon size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
              Visual Learning Mode • चित्र आधारित शिक्षण
            </div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>
              {conceptTitle}
            </div>
          </div>
        </div>

        {/* Replay / Animation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
            style={{
              background: '#141e33',
              border: '1px solid #20314d',
              color: '#cbd5e1',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <button
            onClick={handleReplay}
            aria-label="Replay visual animation"
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ↺ Replay
          </button>
        </div>
      </div>

      {/* Main Illustration Box */}
      <div style={{
        position: 'relative',
        backgroundColor: '#030712',
        border: '1px solid #142238',
        borderRadius: '10px',
        overflow: 'hidden',
        minHeight: '210px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '30px' }}>
            <div style={{
              display: 'inline-block',
              width: '28px',
              height: '28px',
              border: '3px solid rgba(56, 189, 248, 0.2)',
              borderTopColor: '#38bdf8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '10px'
            }} />
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Generating child-friendly visual...</div>
          </div>
        ) : (
          renderScene()
        )}
      </div>

      {/* Key Conceptual Learning Points (Pills for young learners) */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px'
      }}>
        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
          Key Concepts:
        </span>
        {keyElements.map((elem, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              color: '#38bdf8',
              padding: '3px 10px',
              borderRadius: '999px',
              fontWeight: 600
            }}
          >
            ✓ {elem}
          </span>
        ))}
      </div>

      {/* Embedded CSS Animations for Scene Elements */}
      <style>{`
        /* Sun pulse */
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .anim-sun {
          transform-origin: 80px 55px;
          animation: sunPulse 3s infinite ease-in-out;
        }

        /* Rain drops */
        @keyframes dropFall {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        .anim-raindrops {
          animation: dropFall 1.8s infinite linear;
        }

        /* Sprout bounce */
        @keyframes sproutSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        .anim-sprout {
          transform-origin: 200px 185px;
          animation: sproutSway 3s infinite ease-in-out;
        }

        /* Vapour rise */
        @keyframes vapourRise {
          0% { transform: translateY(10px); opacity: 0; }
          50% { opacity: 0.9; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        .anim-vapour {
          animation: vapourRise 2.5s infinite ease-out;
        }

        /* Flame flicker */
        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.12); }
        }
        .anim-flame {
          transform-origin: 200px 220px;
          animation: flameFlicker 0.8s infinite ease-in-out;
        }

        /* Triangle sides sequential highlight */
        @keyframes sideGlow1 {
          0%, 100% { stroke-width: 5; filter: drop-shadow(0 0 2px #38bdf8); }
          33% { stroke-width: 8; filter: drop-shadow(0 0 8px #38bdf8); }
        }
        @keyframes sideGlow2 {
          0%, 100% { stroke-width: 5; filter: drop-shadow(0 0 2px #2dd4bf); }
          66% { stroke-width: 8; filter: drop-shadow(0 0 8px #2dd4bf); }
        }
        @keyframes sideGlow3 {
          0%, 100% { stroke-width: 5; filter: drop-shadow(0 0 2px #f59e0b); }
          99% { stroke-width: 8; filter: drop-shadow(0 0 8px #f59e0b); }
        }
        .anim-side-1 { animation: sideGlow1 3s infinite ease-in-out; }
        .anim-side-2 { animation: sideGlow2 3s infinite ease-in-out; }
        .anim-side-3 { animation: sideGlow3 3s infinite ease-in-out; }

        /* Floating letters */
        @keyframes floatLetters {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .anim-letters {
          animation: floatLetters 2.5s infinite ease-in-out;
        }

        /* Reduced motion query */
        @media (prefers-reduced-motion: reduce) {
          .anim-sun, .anim-raindrops, .anim-sprout, .anim-vapour,
          .anim-flame, .anim-side-1, .anim-side-2, .anim-side-3,
          .anim-letters {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
