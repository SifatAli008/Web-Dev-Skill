import React from 'react';
import AgentCompanion from '../components/AgentCompanion';

export const metadata = {
  title: 'Universal WebDev Skills | Official Next.js Documentation',
  description: 'Open-source 15-specialist web engineering team framework for AI coding agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#090b10',
        color: '#f1f5f9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }}>
        {/* Top Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '60px',
          background: 'rgba(13, 17, 23, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              fontWeight: 700
            }}>⚡</div>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Universal WebDev Skills</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', padding: '2px 7px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', borderRadius: '4px' }}>Next.js Docs</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a
              href="https://github.com/SifatAli008/Web-Dev-Skill"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#131822'
              }}
            >GitHub</a>
          </div>
        </header>

        {children}

        {/* Floating Animated Agent Companion */}
        <AgentCompanion />
      </body>
    </html>
  );
}

