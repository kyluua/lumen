import React from 'react';
import { Heart, Github, MessageCircle, Shield, Globe } from 'lucide-react';

export const CreditsPage: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
    <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--lumen-text-primary)' }}>Credits</h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Card icon={Heart} title="Benefits of Lumen" items={['Open source and transparent', 'Safe — no malware, no hidden telemetry', 'Custom-made original assets', 'Multi-loader support (Vanilla, Fabric, Forge, NeoForge)', 'Production-ready and polished UI']} />
      <Card icon={MessageCircle} title="From the Owner" items={['"Lumen is built with safety and quality first. No shortcuts, no sketchy imports." — kyluua', '"Thank you for using Lumen. Every feature is built to be smooth, customizable, and reliable." — kyluua']} />
      <Card icon={Shield} title="Supported" items={['Minecraft 1.21.x', 'Lumen channels: 26.1.x, 26.2.x', 'Windows 10/11, macOS, Linux', 'JDK 21, JDK 25']} />
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <LinkButton icon={Github} label="GitHub" href="https://github.com" />
        <LinkButton icon={MessageCircle} label="Discord" href="https://discord.gg" />
        <LinkButton icon={Globe} label="Website" href="https://lumen.dev" />
      </div>
    </div>
  </div>
);

const Card: React.FC<{ icon: any; title: string; items: string[] }> = ({ icon: Icon, title, items }) => (
  <div style={{ padding: '1.25rem', backgroundColor: 'var(--lumen-bg-card)', borderRadius: 12, border: '1px solid var(--lumen-border)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
      <Icon size={20} style={{ color: 'var(--lumen-primary)' }} />
      <h3 style={{ fontWeight: 600, color: 'var(--lumen-text-primary)' }}>{title}</h3>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {items.map((item, i) => <li key={i} style={{ color: 'var(--lumen-text-secondary)', fontSize: '0.875rem', paddingLeft: '1.75rem' }}>• {item}</li>)}
    </ul>
  </div>
);

const LinkButton: React.FC<{ icon: any; label: string; href: string }> = ({ icon: Icon, label, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--lumen-bg-card)', border: '1px solid var(--lumen-border)', borderRadius: 10, color: 'var(--lumen-text-primary)', textDecoration: 'none', fontFamily: 'inherit', fontWeight: 500 }}>
    <Icon size={18} /> {label}
  </a>
);