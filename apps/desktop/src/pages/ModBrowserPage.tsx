import React, { useState } from 'react';
import { Search, Package, Image } from 'lucide-react';
import { useLumenStore } from '../store';

export const ModBrowserPage: React.FC = () => {
  const store = useLumenStore();
  const [query, setQuery] = useState('');
  const [browser, setBrowser] = useState<'modrinth' | 'curseforge'>(store.settings.modsAndPacks.defaultBrowser);
  const [category, setCategory] = useState<'mod' | 'resourcepack'>('mod');
  const [apiKeyMR, setApiKeyMR] = useState(store.settings.apiKeys.modrinthApiKey ?? '');
  const [apiKeyCF, setApiKeyCF] = useState(store.settings.apiKeys.curseForgeApiKey ?? '');

  const handleSaveKeys = () => {
    store.setApiKeys({ modrinthApiKey: apiKeyMR || undefined, curseForgeApiKey: apiKeyCF || undefined });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Browse Mods & Resource Packs</h2>

      {/* API Key Configuration */}
      <div style={{ padding: '1.25rem', marginBottom: '1.5rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '0.75rem', color: 'var(--lumen-text-primary)' }}>API Keys (Required)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>Modrinth API Key</label>
            <input type="password" value={apiKeyMR} onChange={e => setApiKeyMR(e.target.value)} placeholder="mrp_..." style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--lumen-text-secondary)', display: 'block', marginBottom: '0.25rem' }}>CurseForge API Key</label>
            <input type="password" value={apiKeyCF} onChange={e => setApiKeyCF(e.target.value)} placeholder="$2a$..." style={inputStyle} />
          </div>
          <button onClick={handleSaveKeys} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', backgroundColor: 'var(--lumen-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>Save Keys</button>
        </div>
      </div>

      {/* Browser Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={() => setBrowser('modrinth')} style={{ ...browserBtnStyle, backgroundColor: browser === 'modrinth' ? 'var(--lumen-primary)' : 'var(--lumen-bg-card)', color: browser === 'modrinth' ? 'white' : 'var(--lumen-text-secondary)' }}>Modrinth</button>
          <button onClick={() => setBrowser('curseforge')} style={{ ...browserBtnStyle, backgroundColor: browser === 'curseforge' ? 'var(--lumen-primary)' : 'var(--lumen-bg-card)', color: browser === 'curseforge' ? 'white' : 'var(--lumen-text-secondary)' }}>CurseForge</button>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={() => setCategory('mod')} style={{ ...browserBtnStyle, backgroundColor: category === 'mod' ? 'var(--lumen-accent)' : 'var(--lumen-bg-card)', color: category === 'mod' ? 'white' : 'var(--lumen-text-secondary)' }}>
            <Package size={14} /> Mods
          </button>
          <button onClick={() => setCategory('resourcepack')} style={{ ...browserBtnStyle, backgroundColor: category === 'resourcepack' ? 'var(--lumen-accent)' : 'var(--lumen-bg-card)', color: category === 'resourcepack' ? 'white' : 'var(--lumen-text-secondary)' }}>
            <Image size={14} /> Resource Packs
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <input type="text" placeholder={`Search ${category === 'mod' ? 'mods' : 'resource packs'} on ${browser}...`} value={query} onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, padding: '0.625rem 1rem', backgroundColor: 'var(--lumen-bg-card)', color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8, fontFamily: 'inherit' }} />
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1.25rem', backgroundColor: 'var(--lumen-primary)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
          <Search size={18} /> Search
        </button>
      </div>

      {/* Results placeholder */}
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--lumen-text-muted)', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
        <p>Enter a search query and press Search to browse {browser} {category === 'mod' ? 'mods' : 'resource packs'}.</p>
        <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>API keys are required for CurseForge. Modrinth supports anonymous browsing.</p>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', backgroundColor: 'var(--lumen-bg-surface)',
  color: 'var(--lumen-text-primary)', border: '1px solid var(--lumen-border)', borderRadius: 8,
  fontFamily: 'inherit', fontSize: '0.875rem',
};

const browserBtnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.25rem',
  padding: '0.5rem 0.75rem', border: '1px solid var(--lumen-border)',
  borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8125rem',
};