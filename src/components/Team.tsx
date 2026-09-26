import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { UsersIcon, ExternalLinkIcon } from './Icons';

export const Team: React.FC = () => {
  return (
    <section id="team" style={{
      padding: '4.5rem 0',
      backgroundColor: '#0c1322',
      borderTop: '1px solid #1e293b'
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
            marginBottom: '0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <UsersIcon size={16} /> SIH Project Innovators
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem' }}>
            Meet the Development Team
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6 }}>
            Dedicated engineering team building accessible, mother tongue-centered educational tools for multilingual classrooms.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="bhasha-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Photo / Initials Badge - never overlapped by buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      border: '2px solid #20314d',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                    flexShrink: 0
                  }}>
                    {member.initials}
                  </div>
                )}
                <div>
                  <h3 style={{ fontSize: '1.12rem', marginBottom: '4px', color: '#ffffff' }}>
                    {member.name}
                  </h3>
                  <div style={{
                    fontSize: '0.78rem',
                    color: '#38bdf8',
                    fontWeight: 600
                  }}>
                    {member.department}
                  </div>
                </div>
              </div>

              {/* Role description */}
              <div style={{
                backgroundColor: '#0a0f1d',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: '#cbd5e1',
                marginBottom: '20px'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                  Project Role
                </span>
                <span style={{ fontWeight: 600 }}>{member.role}</span>
              </div>

              {/* Bottom LinkedIn Button container with mt-auto alignment */}
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${member.name}'s LinkedIn profile (opens in new tab)`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      backgroundColor: '#1b2845',
                      border: '1px solid #2e4469',
                      color: '#ffffff',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#0a66c2';
                      e.currentTarget.style.borderColor = '#0a66c2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1b2845';
                      e.currentTarget.style.borderColor = '#2e4469';
                    }}
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLinkIcon size={14} />
                  </a>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: '#64748b',
                    backgroundColor: '#141e33',
                    border: '1px dashed #20314d'
                  }}>
                    Profile verified via SIH submission
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
