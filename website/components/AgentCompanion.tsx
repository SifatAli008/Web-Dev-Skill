'use client';

import React, { useState } from 'react';

export interface TelemetryLog {
  id: string;
  time: string;
  role: string;
  roleClass: string;
  message: string;
}

export default function AgentCompanion() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visorState, setVisorState] = useState<'idle' | 'sec' | 'qa' | 'devops'>('idle');
  const [badgeText, setBadgeText] = useState('Agent Ready');
  const [statusText, setStatusText] = useState('Click to view telemetry');
  const [logs, setLogs] = useState<TelemetryLog[]>([
    {
      id: '1',
      time: '18:10:01',
      role: '00 Orchestrator',
      roleClass: 'text-amber-400',
      message: 'Monitoring active repository state & invariants.'
    }
  ]);

  const addLog = (role: string, roleClass: string, message: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [
      ...prev,
      { id: Math.random().toString(), time, role, roleClass, message }
    ]);
  };

  const simulateTask = (type: 'security' | 'qa' | 'deploy') => {
    if (!drawerOpen) setDrawerOpen(true);

    if (type === 'security') {
      setVisorState('sec');
      setBadgeText('06 Security');
      setStatusText('Auditing SQL & Secrets...');
      addLog('06 Security', 'text-rose-400', 'Threat Model activated: Scanning codebase for unparameterized SQL...');
      setTimeout(() => {
        addLog('06 Security', 'text-rose-400', 'Cryptographic check: scrypt hashing verified with unique salts.');
        addLog('06 Security', 'text-rose-400', 'VETO AUDIT PASSED: 0 critical vulnerabilities found.');
        setVisorState('idle');
        setBadgeText('Agent Idle');
        setStatusText('Security Gate Passed');
      }, 1200);
    } else if (type === 'qa') {
      setVisorState('qa');
      setBadgeText('08 SQAT');
      setStatusText('Executing test suites...');
      addLog('08 SQAT Lead', 'text-cyan-400', 'No evidence, no ship: Running 21 reference project integration tests...');
      setTimeout(() => {
        addLog('08 SQAT Lead', 'text-cyan-400', 'Asserting edge cases, negative stock, and idempotency replay headers...');
        addLog('08 SQAT Lead', 'text-cyan-400', 'ALL 21 TESTS PASSED (0.48s execution time). Quality Gate signed.');
        setVisorState('idle');
        setBadgeText('Agent Idle');
        setStatusText('Quality Gate Passed');
      }, 1200);
    } else if (type === 'deploy') {
      setVisorState('devops');
      setBadgeText('09 DevOps');
      setStatusText('Checking container probes...');
      addLog('09 DevOps / SRE', 'text-emerald-400', 'No rollback, no ship: Verifying /api/health/readiness and /api/health/liveness...');
      setTimeout(() => {
        addLog('09 DevOps / SRE', 'text-emerald-400', 'Health probes return 200 OK. Testing automated rollback script...');
        addLog('09 DevOps / SRE', 'text-emerald-400', 'Deployment gate cleared. Ready for zero-downtime release.');
        setVisorState('idle');
        setBadgeText('Agent Idle');
        setStatusText('Deploy Gate Cleared');
      }, 1200);
    }
  };

  const getVisorColor = () => {
    switch (visorState) {
      case 'sec': return '#f43f5e';
      case 'qa': return '#38bdf8';
      case 'devops': return '#f59e0b';
      case 'idle':
      default: return '#10b981';
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      
      {/* Telemetry Drawer */}
      {drawerOpen && (
        <div style={{
          width: '380px',
          background: 'rgba(13, 17, 23, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden'
        }}>
          <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡</span>
              <span>AGENT TASK TELEMETRY</span>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
              aria-label="Close telemetry"
            >✕</button>
          </div>

          <div style={{ padding: '14px', maxHeight: '200px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: 'flex', gap: '8px', lineHeight: 1.4 }}>
                <span style={{ color: '#64748b' }}>{log.time}</span>
                <span style={{ fontWeight: 700 }} className={log.roleClass}>[{log.role}]</span>
                <span style={{ color: '#cbd5e1' }}>{log.message}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '10px 14px', background: '#0d1117', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => simulateTask('security')}
              style={{ flex: 1, background: '#131822', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >🛡️ Security Veto</button>
            <button
              onClick={() => simulateTask('qa')}
              style={{ flex: 1, background: '#131822', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >🧪 QA Tests</button>
            <button
              onClick={() => simulateTask('deploy')}
              style={{ flex: 1, background: '#131822', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >🚀 Deploy</button>
          </div>
        </div>
      )}

      {/* Floating Agent Capsule Button */}
      <div
        onClick={() => setDrawerOpen(!drawerOpen)}
        role="button"
        tabIndex={0}
        aria-expanded={drawerOpen}
        style={{
          background: 'rgba(19, 24, 34, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '40px',
          padding: '6px 16px 6px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          userSelect: 'none'
        }}
      >
        <div style={{ width: '38px', height: '38px', position: 'relative' }}>
          <svg viewBox="0 0 48 48" fill="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <g>
              <line x1="24" y1="6" x2="24" y2="12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="24" cy="5" r="2.5" fill="#38bdf8" />
              <rect x="10" y="12" width="28" height="22" rx="7" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              <rect x="14" y="16" width="20" height="9" rx="3.5" fill={getVisorColor()} style={{ filter: `drop-shadow(0 0 4px ${getVisorColor()})` }} />
              <circle cx="19" cy="20.5" r="1.5" fill="#000" />
              <circle cx="29" cy="20.5" r="1.5" fill="#000" />
              <rect x="13" y="36" width="22" height="8" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <circle cx="8" cy="34" r="3.5" fill="#38bdf8" />
              <circle cx="40" cy="34" r="3.5" fill="#38bdf8" />
            </g>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{badgeText}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{statusText}</span>
        </div>
      </div>

    </div>
  );
}

