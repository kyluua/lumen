// ============================================================
// Lumen — Profiles Page
// Profile creation wizard for Vanilla, Fabric, Forge, NeoForge.
// Import/export, repair, favorites, per-profile settings.
// ============================================================

import React, { useState } from 'react';
import { useLumenStore } from '../store';
import { createProfile, validateProfile, exportProfile, importProfile, repairProfile } from '@lumen/launcher-core';
import type { LoaderType, Profile } from '@lumen/launcher-core';
import { Plus, Download, Upload, Wrench, Play, Star, Trash2, AlertTriangle } from 'lucide-react';

const LOADERS: { type: LoaderType; label: string; description: string }[] = [
  { type: 'vanilla', label: 'Vanilla', description: 'Pure Minecraft, no mod loader' },
  { type: 'fabric', label: 'Fabric', description: 'Lightweight modding framework' },
  { type: 'forge', label: 'Forge', description: 'Traditional mod loader' },
  { type: 'neoforge', label: 'NeoForge', description: 'Modern fork of Forge' },
];

export const ProfilesPage: React.FC = () => {
  const store = useLumenStore();
  const profiles = Object.values(store.settings.profiles);
  const [showCreator, setShowCreator] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const handleCreateProfile = (loaderType: LoaderType) => {
    const runtimes = store.settings.java.runtimes;
    const defaultJava = runtimes.find((r) => r.majorVersion >= 21);
    if (!defaultJava) {
      setErrors(['No compatible Java runtime found. Please configure JDK 21+ in Settings.']);
      return;
    }

    const profile = createProfile({
      name: `New ${loaderType.charAt(0).toUpperCase() + loaderType.slice(1)} Profile`,
      minecraftVersion: '1.21',
      loaderType,
      javaRuntime: {
        path: defaultJava.path,
        version: defaultJava.version,
        vendor: defaultJava.vendor,
        majorVersion: defaultJava.majorVersion,
      },
    });

    store.addProfile(profile);
    setShowCreator(false);
    setErrors([]);
  };

  const handleImport = () => {
    const profile = importProfile(importJson);
    if (profile) {
      store.addProfile(profile);
      setImportJson('');
    } else {
      setErrors(['Invalid profile JSON.']);
    }
  };

  const handleRepair = (profile: Profile) => {
    const repaired = repairProfile(profile);
    store.addProfile(repaired);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, color: 'var(--lumen-text-primary)' }}>
          Profiles
        </h2>
        <button
          onClick={() => setShowCreator(!showCreator)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.625rem 1.25rem', backgroundColor: 'var(--lumen-primary)',
            color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 600,
          }}
        >
          <Plus size={18} /> New Profile
        </button>
      </div>

      {errors.length > 0 && (
        <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid var(--lumen-error)', borderRadius: 8, color: 'var(--lumen-error)' }}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      {/* Profile Creator */}
      {showCreator && (
        <div style={{ padding: '1.5rem', marginBottom: '1.5rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--lumen-text-primary)' }}>Choose a Loader</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {LOADERS.map(({ type, label, description }) => (
              <button
                key={type}
                onClick={() => handleCreateProfile(type)}
                style={{
                  padding: '1rem', backgroundColor: 'var(--lumen-bg-surface)',
                  border: '1px solid var(--lumen-border)', borderRadius: 10,
                  cursor: 'pointer', textAlign: 'left', color: 'var(--lumen-text-primary)',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-muted)' }}>{description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Import */}
      <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Paste profile JSON to import..."
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            style={{
              flex: 1, padding: '0.5rem 0.75rem', backgroundColor: 'var(--lumen-bg-surface)',
              border: '1px solid var(--lumen-border)', borderRadius: 8, color: 'var(--lumen-text-primary)',
              fontFamily: 'inherit',
            }}
          />
          <button onClick={handleImport} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
            <Upload size={16} /> Import
          </button>
        </div>
      </div>

      {/* Profile List */}
      {profiles.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--lumen-text-muted)' }}>
          <p>No profiles created yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onPlay={() => {}}
              onRepair={() => handleRepair(profile)}
              onExport={() => {
                const json = exportProfile(profile);
                navigator.clipboard?.writeText(json);
              }}
              onDelete={() => store.removeProfile(profile.id)}
              onToggleFavorite={() => store.toggleFavorite(profile.id)}
              onNameChange={(name) => store.updateProfile(profile.id, { name })}
              onMemoryChange={(min, max) => store.updateProfile(profile.id, { memory: { min, max } })}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProfileCard: React.FC<{
  profile: Profile;
  onPlay: () => void;
  onRepair: () => void;
  onExport: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  onNameChange: (name: string) => void;
  onMemoryChange: (min: number, max: number) => void;
}> = ({ profile, onPlay, onRepair, onExport, onDelete, onToggleFavorite, onNameChange, onMemoryChange }) => {
  const validation = validateProfile(profile);

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 10, border: '1px solid var(--lumen-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <input
            value={profile.name}
            onChange={(e) => onNameChange(e.target.value)}
            style={{
              fontWeight: 600, fontSize: '1.0625rem', color: 'var(--lumen-text-primary)',
              background: 'none', border: 'none', fontFamily: 'inherit', outline: 'none',
              borderBottom: '2px solid transparent',
            }}
          />
          <div style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-muted)', marginTop: '0.25rem' }}>
            MC {profile.minecraftVersion} • {profile.loaderType.charAt(0).toUpperCase() + profile.loaderType.slice(1)}
            {profile.loaderVersion ? ` • Loader ${profile.loaderVersion}` : ''}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--lumen-text-secondary)' }}>
            <span>RAM: {profile.memory.min}MB – {profile.memory.max}MB</span>
            <span>{profile.resolution.width}×{profile.resolution.height}{profile.resolution.fullscreen ? ' FS' : ''}</span>
            <span>Java {profile.javaRuntime.majorVersion}</span>
          </div>
          {!validation.valid && (
            <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--lumen-warning)', fontSize: '0.8125rem' }}>
              <AlertTriangle size={14} />
              {validation.errors[0]}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          <IconButton icon={Star} filled={profile.favorite} onClick={onToggleFavorite} title="Favorite" />
          <IconButton icon={Play} onClick={onPlay} title="Play" />
          <IconButton icon={Wrench} onClick={onRepair} title="Repair" />
          <IconButton icon={Download} onClick={onExport} title="Export" />
          <IconButton icon={Trash2} onClick={onDelete} title="Delete" />
        </div>
      </div>
    </div>
  );
};

const IconButton: React.FC<{
  icon: any;
  filled?: boolean;
  onClick: () => void;
  title: string;
}> = ({ icon: Icon, filled, onClick, title }) => (
  <button onClick={onClick} title={title}
    style={{
      background: filled ? 'var(--lumen-primary)' : 'var(--lumen-bg-surface)',
      color: filled ? 'white' : 'var(--lumen-text-secondary)',
      border: '1px solid var(--lumen-border)', borderRadius: 6, padding: '0.375rem',
      cursor: 'pointer', display: 'flex',
    }}>
    <Icon size={16} />
  </button>
);
