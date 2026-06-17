import React from 'react';
import { getChangelog } from '@lumen/launcher-core';
import { useLumenStore } from '../store';

export const UpdatesPage: React.FC = () => {
  const store = useLumenStore();
  const changelog = getChangelog();
  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Updates & Releases</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ color: 'var(--lumen-text-secondary)', marginRight: '0.75rem' }}>Channel:</label>
        <select value={store.settings.updates.channel} onChange={(e) => store.setUpdateChannel(e.target.value as any)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-bg-card)', color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8, fontFamily: 'inherit' }}>
          {['stable','beta','nightly','26.1.x','26.2.x'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {changelog.map((entry, i) => (
        <div key={i} style={{ padding: '1.25rem', marginBottom: '1rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontWeight: 700, color: 'var(--lumen-text-primary)' }}>v{entry.version}</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-muted)' }}>{entry.date}</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {entry.changes.map((c, j) => (
              <li key={j} style={{ padding: '0.375rem 0', color: 'var(--lumen-text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ padding: '0.125rem 0.375rem', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 600, backgroundColor: c.type==='feature'?'rgba(34,211,238,0.15)':c.type==='fix'?'rgba(52,211,153,0.15)':c.type==='security'?'rgba(248,113,113,0.15)':'rgba(167,139,250,0.15)', color: c.type==='feature'?'var(--lumen-accent)':c.type==='fix'?'var(--lumen-success)':c.type==='security'?'var(--lumen-error)':'var(--lumen-primary)' }}>{c.type.toUpperCase()}</span>
                {c.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};