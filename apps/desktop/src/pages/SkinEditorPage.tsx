import React, { useState } from 'react';
import { Search, Download, Upload, RotateCw } from 'lucide-react';
import { getSkinByUsername } from '@lumen/launcher-core';
import type { SkinInfo } from '@lumen/launcher-core';

export const SkinEditorPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [skin, setSkin] = useState<SkinInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState('');

  const handleLookup = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await getSkinByUsername(username.trim());
      if (result) setSkin(result);
      else setError('Player not found or skin unavailable.');
    } catch {
      setError('Failed to fetch skin. Check the username and try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Skin Editor & Viewer</h2>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input type="text" placeholder="Enter Minecraft username..." value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLookup()}
          style={{ flex: 1, padding: '0.625rem 1rem', backgroundColor: 'var(--lumen-bg-card)', color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '1rem' }} />
        <button onClick={handleLookup} disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: 'var(--lumen-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, opacity: loading ? 0.7 : 1 }}>
          <Search size={18} /> {loading ? 'Loading...' : 'Lookup'}
        </button>
      </div>
      {error && <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid var(--lumen-error)', borderRadius: 8, color: 'var(--lumen-error)', fontSize: '0.875rem' }}>{error}</div>}
      {skin && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)', textAlign: 'center' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button onClick={() => setRotation(r => r - 45)} style={iconBtnStyle}><RotateCw size={18} style={{ transform: 'scaleX(-1)' }} /></button>
                <span style={{ color: 'var(--lumen-text-muted)', fontSize: '0.8125rem', alignSelf: 'center' }}>{rotation}°</span>
                <button onClick={() => setRotation(r => r + 45)} style={iconBtnStyle}><RotateCw size={18} /></button>
              </div>
              {skin.skinUrl ? (
                <img src={skin.skinUrl} alt={`${skin.username}'s skin`}
                  style={{ width: 256, height: 384, imageRendering: 'pixelated', borderRadius: 8, transform: `rotateY(${rotation}deg)`, transition: 'transform 0.3s ease' }} />
              ) : (
                <div style={{ width: 256, height: 384, backgroundColor: 'var(--lumen-bg-surface)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lumen-text-muted)' }}>No skin</div>
              )}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 250, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <InfoRow label="Username" value={skin.username} />
            <InfoRow label="UUID" value={skin.uuid} />
            <InfoRow label="Model" value={skin.model} />
            <InfoRow label="Cape" value={skin.capeUrl ? 'Yes' : 'None'} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <ActionButton icon={Download} label="Export Skin" />
              <ActionButton icon={Upload} label="Import Skin" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--lumen-border-light)' }}>
    <span style={{ color: 'var(--lumen-text-muted)', fontSize: '0.8125rem' }}>{label}</span>
    <span style={{ color: 'var(--lumen-text-primary)', fontSize: '0.875rem', fontWeight: 500, wordBreak: 'break-all' }}>{value}</span>
  </div>
);

const ActionButton: React.FC<{ icon: any; label: string }> = ({ icon: Icon, label }) => (
  <button style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-bg-surface)', color: 'var(--lumen-text-secondary)', border: '1px solid var(--lumen-border)', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem' }}>
    <Icon size={16} /> {label}
  </button>
);

const iconBtnStyle: React.CSSProperties = { background: 'var(--lumen-bg-surface)', border: '1px solid var(--lumen-border)', borderRadius: 6, padding: '0.375rem', cursor: 'pointer', color: 'var(--lumen-text-secondary)', display: 'flex' };