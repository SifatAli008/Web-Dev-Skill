'use client';

import React from 'react';

export default function Sidebar({ activeSection }: { activeSection?: string }) {
  return (
    <aside style={{
      background: '#0d1117',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '24px 16px',
      height: 'calc(100vh - 60px)',
      position: 'sticky',
      top: '60px',
      overflowY: 'auto'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0 12px 8px' }}>
          Getting Started
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <li><a href="#overview" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Overview</a></li>
          <li><a href="#quickstart" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>5-Second Quickstart</a></li>
          <li><a href="#tiers" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>3-Tier Rigor Model</a></li>
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0 12px 8px' }}>
          Core Protocol
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <li><a href="#vetos" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Hard Vetos & Gates</a></li>
          <li><a href="#hygiene" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Zero AI Vibe Code</a></li>
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0 12px 8px' }}>
          15 Specialists
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <li>
            <a href="#specialists" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
              <span>06 Security</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>VETO</span>
            </a>
          </li>
          <li>
            <a href="#specialists" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
              <span>08 SQAT QA</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>SHIP</span>
            </a>
          </li>
          <li>
            <a href="#specialists" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
              <span>00 Orchestrator</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>GATE</span>
            </a>
          </li>
          <li>
            <a href="#specialists" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
              <span>02 Architecture</span>
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>GATE</span>
            </a>
          </li>
          <li>
            <a href="#specialists" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>
              <span>View All 15 Roles</span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>→</span>
            </a>
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', padding: '0 12px 8px' }}>
          Adapters & Playbooks
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <li><a href="#adapters" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Cursor (.mdc rules)</a></li>
          <li><a href="#adapters" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Claude Code & Copilot</a></li>
          <li><a href="#playbooks" style={{ display: 'block', padding: '7px 12px', borderRadius: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>16 Playbooks</a></li>
        </ul>
      </div>
    </aside>
  );
}

