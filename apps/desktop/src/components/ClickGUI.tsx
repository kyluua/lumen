import React, { useState } from 'react';
import { Zap, Eye, Gauge, Layout, MousePointer, Star, X, Search, SlidersHorizontal } from 'lucide-react';

type ModCategory = 'utility' | 'visual' | 'performance' | 'hud' | 'action' | 'favorites';

interface ModEntry {
  id: string;
  name: string;
  description: string;
  category: ModCategory;
  enabled: boolean;
  favorite: boolean;
  settings?: Record<string, unknown>;
}

const DEFAULT_MODS: ModEntry[] = [
  // Utility
  { id: 'auto-tool', name: 'AutoTool', description: 'Automatically selects the best tool for the block', category: 'utility', enabled: false, favorite: false },
  { id: 'auto-sprint', name: 'AutoSprint', description: 'Automatically sprints when moving', category: 'utility', enabled: false, favorite: false },
  { id: 'auto-walk', name: 'AutoWalk', description: 'Automatically walks forward', category: 'utility', enabled: false, favorite: false },
  { id: 'fast-place', name: 'FastPlace', description: 'Reduces block placement delay', category: 'utility', enabled: false, favorite: false },
  { id: 'no-fall', name: 'NoFall', description: 'Prevents fall damage', category: 'utility', enabled: false, favorite: true },
  { id: 'scaffold', name: 'Scaffold', description: 'Automatically places blocks under you', category: 'utility', enabled: false, favorite: false },
  // Visual
  { id: 'fullbright', name: 'Fullbright', description: 'Removes darkness for full visibility', category: 'visual', enabled: false, favorite: false },
  { id: 'esp', name: 'ESP', description: 'Highlights entities through walls', category: 'visual', enabled: false, favorite: false },
  { id: 'tracers', name: 'Tracers', description: 'Draws lines to nearby entities', category: 'visual', enabled: false, favorite: false },
  { id: 'chams', name: 'Chams', description: 'Renders entities through walls', category: 'visual', enabled: false, favorite: false },
  { id: 'x-ray', name: 'X-Ray', description: 'See ores through blocks', category: 'visual', enabled: false, favorite: true },
  { id: 'name-tags', name: 'NameTags', description: 'Enhanced player name tags', category: 'visual', enabled: false, favorite: false },
  // Performance
  { id: 'fps-boost', name: 'FPS Boost', description: 'Optimizes game rendering for higher FPS', category: 'performance', enabled: false, favorite: false },
  { id: 'fast-math', name: 'FastMath', description: 'Optimizes mathematical operations', category: 'performance', enabled: false, favorite: false },
  { id: 'chunk-optimizer', name: 'Chunk Optimizer', description: 'Optimizes chunk loading', category: 'performance', enabled: false, favorite: false },
  // HUD
  { id: 'armor-hud', name: 'Armor HUD', description: 'Shows equipped armor durability', category: 'hud', enabled: false, favorite: false },
  { id: 'coords-display', name: 'Coordinates', description: 'Displays current coordinates', category: 'hud', enabled: true, favorite: false },
  { id: 'fps-display', name: 'FPS Display', description: 'Shows current FPS counter', category: 'hud', enabled: true, favorite: false },
  { id: 'compass', name: 'Compass', description: 'Shows directional compass', category: 'hud', enabled: false, favorite: false },
  { id: 'potion-hud', name: 'Potion HUD', description: 'Displays active potion effects', category: 'hud', enabled: false, favorite: false },
  // Action
  { id: 'auto-clicker', name: 'AutoClicker', description: 'Automatically clicks at configurable speed', category: 'action', enabled: false, favorite: false },
  { id: 'auto-fish', name: 'AutoFish', description: 'Automatically fishes', category: 'action', enabled: false, favorite: false },
  { id: 'kill-aura', name: 'KillAura', description: 'Automatically attacks nearby entities', category: 'action', enabled: false, favorite: false },
  { id: 'reach', name: 'Reach', description: 'Extends attack/interaction range', category: 'action', enabled: false, favorite: false },
  { id: 'velocity', name: 'Velocity', description: 'Reduces knockback', category: 'action', enabled: false, favorite: false },
];

export const ClickGUI: React.FC = () => {
  const [mods, setMods] = useState<ModEntry[]>(DEFAULT_MODS);
  const [activeCategory, setActiveCategory] = useState<ModCategory>('utility');
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(true);

  const categories: { key: ModCategory; label: string; icon: any }[] = [
    { key: 'utility', label: 'Utility', icon: MousePointer },
    { key: 'visual', label: 'Visual', icon: Eye },
    { key: 'performance', label: 'Performance', icon: Gauge },
    { key: 'hud', label: 'HUD', icon: Layout },
    { key: 'action', label: 'Action', icon: Zap },
    { key: 'favorites', label: 'Favorites', icon: Star },
  ];

  const toggleMod = (id: string) => {
    setMods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const toggleFavorite = (id: string) => {
    setMods(prev => prev.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  };

  const filteredMods = mods.filter(m => {
    if (activeCategory === 'favorites') return m.favorite;
    if (activeCategory !== m.category) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (!open) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--lumen-bg-root)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--lumen-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 700, color: 'var(--lumen-text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={22} style={{ color: 'var(--lumen-primary)' }} /> Click GUI
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--lumen-text-muted)' }}>Right-Shift to toggle</span>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--lumen-text-secondary)', cursor: 'pointer' }}><X size={20} /></button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--lumen-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 8, border: '1px solid var(--lumen-border)' }}>
          <Search size={16} style={{ color: 'var(--lumen-text-muted)' }} />
          <input type="text" placeholder="Search mods..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--lumen-text-primary)', fontFamily: 'inherit', fontSize: '0.875rem' }} />
          <SlidersHorizontal size={16} style={{ color: 'var(--lumen-text-muted)' }} />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem 1rem', borderBottom: '1px solid var(--lumen-border)', overflowX: 'auto' }}>
        {categories.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveCategory(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem',
              backgroundColor: activeCategory === key ? 'var(--lumen-primary)' : 'transparent',
              color: activeCategory === key ? 'white' : 'var(--lumen-text-secondary)',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '0.8125rem', fontWeight: activeCategory === key ? 600 : 400,
              whiteSpace: 'nowrap',
            }}>
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Mod List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem 1rem' }}>
        {filteredMods.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--lumen-text-muted)' }}>
            {activeCategory === 'favorites' ? 'No favorited mods yet.' : 'No mods match your search.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
            {filteredMods.map(mod => (
              <div key={mod.id} style={{ padding: '0.875rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 10, border: '1px solid var(--lumen-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Toggle */}
                <button onClick={() => toggleMod(mod.id)}
                  style={{
                    width: 40, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                    backgroundColor: mod.enabled ? 'var(--lumen-success)' : 'var(--lumen-bg-surface)',
                    position: 'relative', transition: 'background-color 0.2s',
                    flexShrink: 0,
                  }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: 3, left: mod.enabled ? 19 : 3, transition: 'left 0.2s' }} />
                </button>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--lumen-text-primary)' }}>{mod.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--lumen-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.description}</div>
                </div>
                {/* Favorite */}
                <button onClick={() => toggleFavorite(mod.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: mod.favorite ? 'var(--lumen-warning)' : 'var(--lumen-text-muted)', padding: 4 }}>
                  <Star size={16} fill={mod.favorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ padding: '0.625rem 1.5rem', borderTop: '1px solid var(--lumen-border)', fontSize: '0.75rem', color: 'var(--lumen-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Lumen Client — Right-Shift to toggle</span>
        <span>{mods.filter(m => m.enabled).length} enabled / {mods.length} total</span>
      </div>
    </div>
  );
};