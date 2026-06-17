import React, { useState } from 'react';
import { useLumenStore } from '../store';

export const SettingsPage: React.FC = () => {
  const store = useLumenStore();
  const profiles = Object.values(store.settings.profiles);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const profile = selectedProfile ? store.settings.profiles[selectedProfile] : null;

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Settings</h2>

      {/* Profile Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <select
          value={selectedProfile ?? ''}
          onChange={(e) => setSelectedProfile(e.target.value || null)}
          style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-bg-card)', color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.9375rem', minWidth: 250 }}
        >
          <option value="">Global Settings</option>
          {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {/* Per-Profile Settings */}
      {profile ? (
        <ProfileSettingsPanel profile={profile} onUpdate={(u) => store.updateProfile(profile.id, u)} />
      ) : (
        <GlobalSettingsPanel />
      )}
    </div>
  );
};

const GlobalSettingsPanel: React.FC = () => {
  const store = useLumenStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <SettingsSection title="Java Runtimes">
        {store.settings.java.runtimes.length === 0 ? (
          <p style={{ color: 'var(--lumen-text-muted)' }}>No Java runtimes detected. Add JDK 21+ to get started.</p>
        ) : (
          store.settings.java.runtimes.map((rt) => (
            <div key={rt.id} style={{ padding: '0.75rem', backgroundColor: 'var(--lumen-bg-surface)', borderRadius: 8, border: '1px solid var(--lumen-border)', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600 }}>Java {rt.majorVersion} — {rt.vendor}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-muted)' }}>{rt.path}</div>
            </div>
          ))
        )}
      </SettingsSection>
      <SettingsSection title="Update Channel">
        <select value={store.settings.updates.channel} onChange={(e) => store.setUpdateChannel(e.target.value as any)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-bg-surface)', color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8, fontFamily: 'inherit' }}>
          {['stable', 'beta', 'nightly', '26.1.x', '26.2.x'].map((ch) => <option key={ch} value={ch}>{ch}</option>)}
        </select>
      </SettingsSection>
      <SettingsSection title="Privacy">
        <ToggleSetting label="Crash Reports" checked={store.settings.privacy.crashReportsEnabled} onChange={(v) => store.setSettings({ privacy: { ...store.settings.privacy, crashReportsEnabled: v } })} />
        <ToggleSetting label="Telemetry" checked={store.settings.privacy.telemetryEnabled} onChange={(v) => store.setSettings({ privacy: { ...store.settings.privacy, telemetryEnabled: v } })} />
      </SettingsSection>
    </div>
  );
};

const ProfileSettingsPanel: React.FC<{ profile: any; onUpdate: (u: any) => void }> = ({ profile, onUpdate }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <SettingsSection title="RAM Allocation">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="number" value={profile.memory.min} onChange={(e) => onUpdate({ memory: { ...profile.memory, min: Number(e.target.value) } })} style={inputStyle} /> MB min
        <input type="number" value={profile.memory.max} onChange={(e) => onUpdate({ memory: { ...profile.memory, max: Number(e.target.value) } })} style={inputStyle} /> MB max
      </div>
    </SettingsSection>
    <SettingsSection title="Resolution">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="number" value={profile.resolution.width} onChange={(e) => onUpdate({ resolution: { ...profile.resolution, width: Number(e.target.value) } })} style={inputStyle} />
        ×
        <input type="number" value={profile.resolution.height} onChange={(e) => onUpdate({ resolution: { ...profile.resolution, height: Number(e.target.value) } })} style={inputStyle} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <input type="checkbox" checked={profile.resolution.fullscreen} onChange={(e) => onUpdate({ resolution: { ...profile.resolution, fullscreen: e.target.checked } })} /> Fullscreen
        </label>
      </div>
    </SettingsSection>
  </div>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ padding: '1.25rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--lumen-text-primary)' }}>{title}</h3>
    {children}
  </div>
);

const ToggleSetting: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
    <span style={{ color: 'var(--lumen-text-secondary)' }}>{label}</span>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
  </label>
);

const inputStyle: React.CSSProperties = {
  padding: '0.5rem', backgroundColor: 'var(--lumen-bg-surface)', color: 'var(--lumen-text-primary)',
  border: '1px solid var(--lumen-border)', borderRadius: 6, fontFamily: 'inherit', width: 100,
};
