'use client';

import React, { useState } from 'react';

const SCENARIOS = {
  prod: {
    prompt: `"Add Stripe subscriptions for our $29/mo Pro plan and create a user account for customers who purchase."`,
    tokens: "Context Load: 8,420 / 12,000 tokens (L1 Budget)",
    lines: [
      { hat: "hat-orch", title: "[00 Orchestrator]", msg: "Signal detected: User auth + Payment processing. Classifying tier -> PROD." },
      { hat: "hat-orch", title: "[00 Orchestrator]", msg: "Routing specialists via skills.index.json: 02-arch, 06-sec, 12-mon, 08-qa." },
      { hat: "hat-sec", title: "[06 Security]", msg: "HARD VETO Active: Verifying password hashing (scrypt) & CSRF tokens." },
      { hat: "hat-mon", title: "[12 Monetization]", msg: "Price check: Must be server-authoritative ($29.00). Client amounts rejected." },
      { hat: "hat-sec", title: "[06 Security]", msg: "VETO TRIGGER: Checking for Idempotency-Key on checkout mutation." },
      { hat: "hat-qa", title: "[08 Testing/QA]", msg: "Quality Gate: Executing 7 automated integration tests with parameter assertions." },
      { isBox: true, type: "pass", text: "ALL PROD GATES PASSED: 0 OWASP criticals • Ready for atomic deployment." }
    ]
  },
  mvp: {
    prompt: `"Build a quick internal tool to track hackathon team submissions in 24 hours."`,
    tokens: "Context Load: 5,610 / 12,000 tokens (L0/L1 Budget)",
    lines: [
      { hat: "hat-orch", title: "[00 Orchestrator]", msg: "Signal detected: Internal hackathon prototype. Classifying tier -> MVP." },
      { hat: "hat-orch", title: "[00 Orchestrator]", msg: "Over-engineering vetoed: Microservices & complex state trees blocked." },
      { hat: "hat-sec", title: "[06 Security]", msg: "Baseline Security: In-memory SQLite parameterized queries mandated. No raw SQL." },
      { hat: "hat-qa", title: "[08 Testing/QA]", msg: "Smoke tests verified: Happy path submission + duplicate title rejection." },
      { isBox: true, type: "pass", text: "MVP GATE PASSED: Fast execution with zero security vulnerabilities." }
    ]
  },
  scale: {
    prompt: `"Our content platform is experiencing traffic spikes to 500k MAU with degraded LCP."`,
    tokens: "Context Load: 9,180 / 12,000 tokens (L1 Budget)",
    lines: [
      { hat: "hat-orch", title: "[00 Orchestrator]", msg: "Signal detected: >100k MAU + spiky load. Classifying tier -> SCALE." },
      { hat: "hat-perf", title: "[10 Performance]", msg: "Core Web Vitals Audit: Adding fetchpriority='high' to hero image and aspect-ratio." },
      { hat: "hat-perf", title: "[10 Performance]", msg: "Edge Caching: Tagging routes with s-maxage=3600, stale-while-revalidate=86400." },
      { hat: "hat-perf", title: "[10 Performance]", msg: "ETag 304 validation: Conditional GET verified with zero payload transfer." },
      { isBox: true, type: "pass", text: "SCALE GATE PASSED: Absolute Zero CLS verified • Origin load reduced by 94%." }
    ]
  }
};

export default function Simulator() {
  const [activeKey, setActiveKey] = useState<'prod' | 'mvp' | 'scale'>('prod');
  const [outputLines, setOutputLines] = useState<any[]>(SCENARIOS.prod.lines);

  const switchScenario = (key: 'prod' | 'mvp' | 'scale') => {
    setActiveKey(key);
    setOutputLines([]);
    const lines = SCENARIOS[key].lines;
    lines.forEach((line, i) => {
      setTimeout(() => {
        setOutputLines(prev => [...prev, line]);
      }, i * 140);
    });
  };

  const current = SCENARIOS[activeKey];

  return (
    <div style={{
      background: '#0e1118',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '40px'
    }}>
      <div style={{
        background: '#141822',
        padding: '12px 18px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>PROTOCOL ENGINE</span>
          <span>Live 15-Specialist Routing Simulation</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => switchScenario('prod')}
            style={{
              background: activeKey === 'prod' ? 'rgba(56, 189, 248, 0.15)' : '#0e1118',
              border: `1px solid ${activeKey === 'prod' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
              color: activeKey === 'prod' ? '#fff' : '#cbd5e1',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >Commerce (PROD)</button>
          <button
            onClick={() => switchScenario('mvp')}
            style={{
              background: activeKey === 'mvp' ? 'rgba(56, 189, 248, 0.15)' : '#0e1118',
              border: `1px solid ${activeKey === 'mvp' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
              color: activeKey === 'mvp' ? '#fff' : '#cbd5e1',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >Hackathon (MVP)</button>
          <button
            onClick={() => switchScenario('scale')}
            style={{
              background: activeKey === 'scale' ? 'rgba(56, 189, 248, 0.15)' : '#0e1118',
              border: `1px solid ${activeKey === 'scale' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
              color: activeKey === 'scale' ? '#fff' : '#cbd5e1',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >Spiky Traffic (SCALE)</button>
        </div>
      </div>

      <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Simulated Developer Prompt:</span>
          <div style={{ background: '#08090d', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#f8fafc', minHeight: '85px', lineHeight: 1.5 }}>
            {current.prompt}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#94a3b8' }}>{current.tokens}</span>
        </div>

        <div style={{ background: '#040508', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '220px' }}>
          {outputLines.map((line, idx) => (
            line.isBox ? (
              <div key={idx} style={{
                background: 'rgba(16, 185, 129, 0.12)',
                borderLeft: '3px solid #10b981',
                padding: '6px 10px',
                color: '#86efac',
                fontWeight: 600,
                borderRadius: '0 4px 4px 0',
                marginTop: '4px'
              }}>{line.text}</div>
            ) : (
              <div key={idx} style={{ display: 'flex', gap: '8px', lineHeight: 1.4 }}>
                <span style={{ fontWeight: 700, minWidth: '130px', color: line.hat === 'hat-sec' ? '#f43f5e' : line.hat === 'hat-orch' ? '#f59e0b' : '#38bdf8' }}>{line.title}</span>
                <span style={{ color: '#cbd5e1' }}>{line.msg}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

