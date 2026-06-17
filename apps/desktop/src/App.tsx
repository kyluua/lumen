// ============================================================
// Lumen — Main App Component
// Shell layout with sidebar navigation, theme provider,
// galaxy background effects, and page routing.
// ============================================================

import React, { useEffect, useMemo } from 'react';
import { useLumenStore } from './store';
import { buildTheme, generateThemeCSS, GALAXY_BACKGROUND_CSS } from '@lumen/ui/theme';
import { LUMEN_VERSION } from '@lumen/launcher-core';

// Page components (lazy-loaded in production)
import { HomePage } from './pages/HomePage';
import { ProfilesPage } from './pages/ProfilesPage';
import { SettingsPage } from './pages/SettingsPage';
import { AppearancePage } from './pages/AppearancePage';
import { UpdatesPage } from './pages/UpdatesPage';
import { CreditsPage } from './pages/CreditsPage';
import { SkinEditorPage } from './pages/SkinEditorPage';
import { ModBrowserPage } from './pages/ModBrowserPage';
import { ClickGUI } from './components/ClickGUI';

// Icons
import {
  Home, Gamepad2, Settings, Palette, RefreshCw, Heart,
  User, Package, ChevronLeft, ChevronRight, Search, Zap,
  CloudLightning, Wind, CloudRain, Sparkles, Bomb
} from 'lucide-react';

interface AppProps {
  onReady?: () => void;
}

export const App: React.FC<AppProps> = ({ onReady }) => {
  const store = useLumenStore();
  const { settings, theme, currentPage, sidebarOpen, searchQuery } = store;

  // Build theme from settings
  const activeTheme = useMemo(() => buildTheme(settings.appearance), [settings.appearance]);

  // Apply theme CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const vars = generateThemeCSS(activeTheme);
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.classList.toggle('dark', activeTheme.mode === 'dark');
    root.classList.toggle('reduced-motion', settings.appearance.reducedMotion);
  }, [activeTheme, settings.appearance.reducedMotion]);

  // Signal ready after mount
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'profiles', label: 'Profiles', icon: Gamepad2 },
    { id: 'skin-editor', label: 'Skin Editor', icon: User },
    { id: 'mod-browser', label: 'Browse Mods', icon: Package },
    { id: 'click-gui', label: 'Click GUI', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'updates', label: 'Updates', icon: RefreshCw },
    { id: 'credits', label: 'Credits', icon: Heart },
  ];

  const filteredNav = searchQuery
    ? navItems.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : navItems;

  // Render page content
  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'profiles': return <ProfilesPage />;
      case 'settings': return <SettingsPage />;
      case 'appearance': return <AppearancePage />;
      case 'updates': return <UpdatesPage />;
      case 'credits': return <CreditsPage />;
      case 'skin-editor': return <SkinEditorPage />;
      case 'mod-browser': return <ModBrowserPage />;
      case 'click-gui': return <ClickGUI />;
      default: return <HomePage />;
    }
  };

  return (
    <div
      className="lumen-app lumen-galaxy-bg"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: `var(--lumen-bg-root)`,
        color: `var(--lumen-text-primary)`,
        fontFamily: `var(--lumen-font-family)`,
      }}
    >
      {/* Galaxy Background Effects */}
      <div className="lumen-galaxy-stars" />
      <style>{GALAXY_BACKGROUND_CSS}</style>

      {/* Animated effects based on settings */}
      {settings.appearance.customEffects.lightning && <LightningEffect />}
      {settings.appearance.customEffects.wind && <WindEffect />}
      {settings.appearance.customEffects.rain && <RainEffect />}
      {settings.appearance.customEffects.splashes && <SplashEffect />}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 240 : 60,
          minWidth: sidebarOpen ? 240 : 60,
          transition: 'width 0.3s ease',
          backgroundColor: `var(--lumen-bg-surface)`,
          borderRight: `1px solid var(--lumen-border)`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center',
            borderBottom: `1px solid var(--lumen-border)`,
          }}
        >
          {sidebarOpen && (
            <h1
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1.5rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, var(--lumen-primary), var(--lumen-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Lumen
            </h1>
          )}
          <button
            onClick={store.toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--lumen-text-secondary)',
              padding: 4,
              borderRadius: 4,
            }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div style={{ padding: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.5rem 0.75rem',
                backgroundColor: 'var(--lumen-bg-card)',
                borderRadius: 8,
                border: '1px solid var(--lumen-border)',
              }}
            >
              <Search size={16} style={{ color: 'var(--lumen-text-muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--lumen-text-primary)',
                  fontFamily: 'inherit',
                  width: '100%',
                }}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0.5rem', overflowY: 'auto' }}>
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => store.navigate(item.id)}
                title={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarOpen ? 12 : 0,
                  width: '100%',
                  padding: sidebarOpen ? '0.625rem 0.75rem' : '0.625rem',
                  marginBottom: 2,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  backgroundColor: isActive ? 'var(--lumen-primary)' : 'transparent',
                  color: isActive ? 'var(--lumen-text-on-primary)' : 'var(--lumen-text-secondary)',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--lumen-bg-card)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Version + Effects Toggles */}
        <div
          style={{
            padding: '0.75rem',
            borderTop: `1px solid var(--lumen-border)`,
            fontSize: '0.75rem',
            color: 'var(--lumen-text-muted)',
          }}
        >
          {sidebarOpen && (
            <>
              <div style={{ marginBottom: 8 }}>Lumen v{LUMEN_VERSION}</div>
              <EffectsToggles />
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {renderPage()}
      </main>
    </div>
  );
};

// ===== Effect Toggles =====

const EffectsToggles: React.FC = () => {
  const store = useLumenStore();
  const effects = store.settings.appearance.customEffects;

  const toggles = [
    { key: 'lightning' as const, icon: CloudLightning, label: 'Lightning' },
    { key: 'wind' as const, icon: Wind, label: 'Wind' },
    { key: 'rain' as const, icon: CloudRain, label: 'Rain' },
    { key: 'splashes' as const, icon: Sparkles, label: 'Splashes' },
    { key: 'explosions' as const, icon: Bomb, label: 'Explosions' },
  ];

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {toggles.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() =>
            store.updateAppearance({
              customEffects: { ...effects, [key]: !effects[key] },
            })
          }
          title={label}
          style={{
            background: effects[key] ? 'var(--lumen-primary)' : 'var(--lumen-bg-card)',
            color: effects[key] ? 'white' : 'var(--lumen-text-muted)',
            border: 'none',
            borderRadius: 6,
            padding: '4px 6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            fontSize: '0.7rem',
          }}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
};

// ===== Effect Components (CSS-animated) =====

const LightningEffect: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.05,
      background: 'linear-gradient(180deg, transparent 40%, rgba(167,139,250,0.3) 50%, transparent 60%)',
      animation: 'lightning 4s ease-in-out infinite',
    }}
  />
);

const WindEffect: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.03,
      background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 41px)',
      animation: 'wind 8s linear infinite',
    }}
  />
);

const RainEffect: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.04,
      background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(167,139,250,0.3) 2px, rgba(167,139,250,0.3) 3px)',
      animation: 'rain 0.5s linear infinite',
    }}
  />
);

const SplashEffect: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.03,
      background: 'radial-gradient(circle at 20% 80%, rgba(167,139,250,0.5) 0%, transparent 20%), radial-gradient(circle at 70% 30%, rgba(34,211,238,0.4) 0%, transparent 15%)',
      animation: 'splash 6s ease-in-out infinite alternate',
    }}
  />
);
