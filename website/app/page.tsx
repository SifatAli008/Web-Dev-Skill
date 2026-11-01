'use client';

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Simulator from '../components/Simulator';
import { SPECIALISTS } from '../data/specialists';

export default function DocsPage() {
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState(SPECIALISTS[6]); // 06 Security

  const filteredSpecs = SPECIALISTS.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.num.includes(search) ||
    s.triggers.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px minmax(0, 1fr) 220px',
      maxWidth: '1540px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 60px)'
    }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main style={{ padding: '40px 48px 100px', maxWidth: '920px' }}>
        
        {/* Overview */}
        <section id="overview" style={{ marginBottom: '60px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#38bdf8', marginBottom: '8px' }}>
            <span>Documentation</span> / <span>Next.js Architecture</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '16px' }}>
            Universal WebDev Skills
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            An open-source, tool-agnostic framework that equips AI coding agents with the engineering rigor, architectural discipline, and security posture of an elite 15-specialist web engineering team.
          </p>

          <div style={{
            background: 'rgba(56, 189, 248, 0.1)',
            borderLeft: '4px solid #38bdf8',
            padding: '16px 20px',
            borderRadius: '8px',
            color: '#bae6fd',
            marginBottom: '32px'
          }}>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>The Core Principle</div>
            Universal WebDev Skills replaces unguided AI coding with objective tier-first classification (MVP, PROD, SCALE), non-negotiable security vetos, and schema-validated handoffs across Cursor, Claude Code, Antigravity, and Copilot.
          </div>

          {/* Interactive Protocol Engine Simulator */}
          <Simulator />
        </section>

        {/* 5-Second Quickstart */}
        <section id="quickstart" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            5-Second Quickstart
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '16px' }}>
            Install the framework into any repository in seconds using the zero-dependency CLI installer:
          </p>
          <div style={{ background: '#050608', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', marginBottom: '16px' }}>
            npx webdev-skills init
          </div>
        </section>

        {/* 3-Tier Rigor Matrix */}
        <section id="tiers" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            3-Tier Rigor Model
          </h2>
          <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', background: '#0e1118' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#141822', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tier</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase' }}>Activation Signals</th>
                  <th style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: '0.75rem', textTransform: 'uppercase' }}>Engineering Standards</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#38bdf8' }}>MVP</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Internal tools, hackathons, proofs of concept. Zero public customer data.</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Speed prioritized. Single-file simplicity, parameterized SQLite, scrypt hashing.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#10b981' }}>PROD</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Public users, user accounts, email capture, checkout/payments, revenue at stake.</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>ACID transactions, Idempotency-Keys, health probes, zero-downtime expand/contract migrations.</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#a855f7' }}>SCALE</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>&gt;100k MAU, spiky traffic patterns, high-volume payouts, strict high SLAs.</td>
                  <td style={{ padding: '12px 16px', color: '#cbd5e1' }}>Edge caching (s-maxage, stale-while-revalidate), ETag conditional GET, CLS = 0, cookieless analytics.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 15 Specialists Directory & Dossier */}
        <section id="specialists" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            15 Specialist Engineering Team
          </h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
            Inspect each specialist's role, binding authorities, non-negotiable stances, and triggers:
          </p>

          <input
            type="text"
            placeholder="Search specialists (e.g. security, auth, database, seo)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#0e1118',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '0.92rem',
              marginBottom: '20px',
              outline: 'none'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
              {filteredSpecs.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSpec(s)}
                  style={{
                    background: s.id === selectedSpec.id ? 'rgba(56, 189, 248, 0.1)' : '#0e1118',
                    border: `1px solid ${s.id === selectedSpec.id ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>{s.num}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.name}</span>
                  </div>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: s.auth === 'veto' ? 'rgba(244, 63, 94, 0.15)' : s.auth === 'gate' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                    color: s.auth === 'veto' ? '#f43f5e' : s.auth === 'gate' ? '#f59e0b' : '#38bdf8'
                  }}>{s.authLabel}</span>
                </div>
              ))}
            </div>

            {/* Dossier Card */}
            <div style={{ background: '#0e1118', border: '1px solid rgba(255, 255, 255, 0.16)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '14px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#38bdf8' }}>ROLE #{selectedSpec.num}</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2px' }}>{selectedSpec.name}</h3>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Stance</div>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>{selectedSpec.refuse}</p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>First Questions</div>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {selectedSpec.questions.map((q, i) => (
                    <li key={i} style={{ paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#38bdf8' }}>•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Activation Snippet</div>
                <div style={{ background: '#040508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', padding: '8px 12px', fontFamily: 'monospace', fontSize: '0.78rem', color: '#38bdf8' }}>
                  {selectedSpec.snippet}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Right Table of Contents */}
      <aside style={{ padding: '40px 20px', position: 'sticky', top: '60px', height: 'calc(100vh - 60px)' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
          On This Page
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
          <li><a href="#overview" style={{ color: '#94a3b8', textDecoration: 'none' }}>Overview</a></li>
          <li><a href="#quickstart" style={{ color: '#94a3b8', textDecoration: 'none' }}>Quickstart</a></li>
          <li><a href="#tiers" style={{ color: '#94a3b8', textDecoration: 'none' }}>3-Tier Model</a></li>
          <li><a href="#specialists" style={{ color: '#94a3b8', textDecoration: 'none' }}>15 Specialists</a></li>
        </ul>
      </aside>
    </div>
  );
}

