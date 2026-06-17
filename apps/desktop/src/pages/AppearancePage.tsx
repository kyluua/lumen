import React from 'react';
import { useLumenStore } from '../store';
import type { GalaxyTheme, ThemeMode, DensityMode } from '@lumen/launcher-core';

export const AppearancePage: React.FC = () => {
  const store = useLumenStore();
  const a = store.settings.appearance;

  const themes: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }
  ];
  const galaxies: { value: GalaxyTheme; label: string }[] = [
    { value: 'galaxy', label: 'Galaxy' }, { value: 'heaven', label: 'Heaven' }, { value: 'nebula', label: 'Nebula' }, { value: 'cosmic', label: 'Cosmic' }
  ];
  const densities: { value: DensityMode; label: string }[] = [
    { value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'spacious', label: 'Spacious' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Appearance</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Section title="Theme">
          <div style={{ display: 'flex', gap: '0.5rem' }}>{themes.map(t => <Button key={t.value} active={a.themeMode===t.value} onClick={()=>store.setThemeMode(t.value)} label={t.label} />)}</div>
        </Section>
        <Section title="Galaxy Theme">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>{galaxies.map(g => <Button key={g.value} active={a.galaxyTheme===g.value} onClick={()=>store.setGalaxyTheme(g.value)} label={g.label} />)}</div>
        </Section>
        <Section title="Accent Color">
          <input type="color" value={a.accentColor} onChange={e => store.setAccentColor(e.target.value)} style={{ width: 60, height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
        </Section>
        <Section title="Density">
          <div style={{ display: 'flex', gap: '0.5rem' }}>{densities.map(d => <Button key={d.value} active={a.density===d.value} onClick={()=>store.setDensity(d.value)} label={d.label} />)}</div>
        </Section>
        <Section title="Custom Effects">
          <EffectToggle label="Lightning" checked={a.customEffects.lightning} onChange={v => store.updateAppearance({customEffects:{...a.customEffects,lightning:v}})} />
          <EffectToggle label="Wind" checked={a.customEffects.wind} onChange={v => store.updateAppearance({customEffects:{...a.customEffects,wind:v}})} />
          <EffectToggle label="Rain" checked={a.customEffects.rain} onChange={v => store.updateAppearance({customEffects:{...a.customEffects,rain:v}})} />
          <EffectToggle label="Splashes" checked={a.customEffects.splashes} onChange={v => store.updateAppearance({customEffects:{...a.customEffects,splashes:v}})} />
          <EffectToggle label="Explosions" checked={a.customEffects.explosions} onChange={v => store.updateAppearance({customEffects:{...a.customEffects,explosions:v}})} />
        </Section>
        <Section title="Accessibility">
          <EffectToggle label="Reduced Motion" checked={a.reducedMotion} onChange={v => store.setReducedMotion(v)} />
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{title:string; children:React.ReactNode}> = ({title,children}) => (
  <div style={{padding:'1.25rem',backgroundColor:'var(--lumen-bg-card)',borderRadius:12,border:'1px solid var(--lumen-border)'}}>
    <h3 style={{fontSize:'1rem',fontWeight:600,marginBottom:'0.75rem',color:'var(--lumen-text-primary)'}}>{title}</h3>
    {children}
  </div>
);

const Button: React.FC<{active:boolean;onClick:()=>void;label:string}> = ({active,onClick,label}) => (
  <button onClick={onClick} style={{padding:'0.5rem 1rem',backgroundColor:active?'var(--lumen-primary)':'var(--lumen-bg-surface)',color:active?'white':'var(--lumen-text-secondary)',border:'1px solid var(--lumen-border)',borderRadius:8,cursor:'pointer',fontFamily:'inherit',fontWeight:active?600:400}}>{label}</button>
);

const EffectToggle: React.FC<{label:string;checked:boolean;onChange:(v:boolean)=>void}> = ({label,checked,onChange}) => (
  <label style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 0'}}>
    <span style={{color:'var(--lumen-text-secondary)'}}>{label}</span>
    <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
  </label>
);
