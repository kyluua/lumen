// ============================================================
// Lumen — Home Page
// Dashboard with news feed, quick actions, recent profiles,
// launch history, and system status.
// ============================================================

import React from 'react';
import { useLumenStore } from '../store';
import { Gamepad2, Plus, Play, Settings, Zap } from 'lucide-react';

export const HomePage: React.FC = () => {
  const store = useLumenStore();
  const profiles = Object.values(store.settings.profiles);
  const recentProfiles = profiles.slice(0, 5);

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, color: 'var(--lumen-text-primary)' }}>
          Welcome to Lumen
        </h2>
        <p style={{ color: 'var(--lumen-text-secondary)', marginTop: '0.25rem' }}>
          A safe, polished, customizable Minecraft launcher
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <QuickAction icon={Plus} label="New Profile" onClick={() => store.navigate('profiles')} />
        <QuickAction icon={Settings} label="Settings" onClick={() => store.navigate('settings')} />
        <QuickAction icon={Zap} label="Click GUI" onClick={() => store.navigate('click-gui')} />
      </div>

      {/* Recent Profiles */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--lumen-text-primary)' }}>
          Recent Profiles
        </h3>
        {recentProfiles.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'var(--lumen-bg-card)',
              borderRadius: 12,
              border: '1px solid var(--lumen-border)',
              color: 'var(--lumen-text-muted)',
            }}
          >
            <Gamepad2 size={40} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
            <p>No profiles yet. Create your first profile to get started.</p>
            <button
              onClick={() => store.navigate('profiles')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1.25rem',
                backgroundColor: 'var(--lumen-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
              }}
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentProfiles.map((profile) => (
              <div
                key={profile.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem',
                  backgroundColor: 'var(--lumen-bg-card)',
                  borderRadius: 10,
                  border: '1px solid var(--lumen-border)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--lumen-text-primary)' }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-muted)' }}>
                    {profile.minecraftVersion} • {profile.loaderType}
                  </div>
                </div>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'var(--lumen-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  <Play size={16} /> Play
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Status */}
      <SystemStatus />
    </div>
  );
};

const QuickAction: React.FC<{ icon: any; label: string; onClick: () => void }> = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      backgroundColor: 'var(--lumen-bg-card)',
      border: '1px solid var(--lumen-border)',
      borderRadius: 10,
      cursor: 'pointer',
      color: 'var(--lumen-text-primary)',
      fontFamily: 'inherit',
      fontSize: '0.9375rem',
      fontWeight: 500,
      transition: 'all 0.15s ease',
    }}
  >
    <Icon size={18} /> {label}
  </button>
);

const SystemStatus: React.FC = () => {
  const store = useLumenStore();
  const runtimes = store.settings.java.runtimes;
  const hasJDK21 = runtimes.some((r) => r.majorVersion >= 21);
  const hasJDK25 = runtimes.some((r) => r.majorVersion >= 25);

  return (
    <div
      style={{
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--lumen-bg-card)',
        borderRadius: 10,
        border: '1px solid var(--lumen-border)',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--lumen-text-primary)' }}>
        System Status
      </h3>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <StatusBadge
          label="JDK 21"
          ok={hasJDK21}
          okText="Detected"
          failText="Not Found"
        />
        <StatusBadge
          label="JDK 25"
          ok={hasJDK25}
          okText="Available"
          failText="Not Found"
        />
        <StatusBadge
          label="Account"
          ok={store.settings.accounts.accounts.length > 0}
          okText="Signed In"
          failText="Not Signed In"
        />
        <StatusBadge
          label="Profiles"
          ok={Object.keys(store.settings.profiles).length > 0}
          okText={`${Object.keys(store.settings.profiles).length} Active`}
          failText="None"
        />
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ label: string; ok: boolean; okText: string; failText: string }> = ({ label, ok, okText, failText }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: ok ? 'var(--lumen-success)' : 'var(--lumen-error)',
      }}
    />
    <span style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-secondary)' }}>
      {label}: {ok ? okText : failText}
    </span>
  </div>
);
