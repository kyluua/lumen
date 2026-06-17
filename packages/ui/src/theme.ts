// ============================================================
// Lumen UI — Theme System
// Supports light, dark, system themes; galaxy/heaven in-game
// themes; Georgia font with italics; accent colors; density
// modes; accessibility; custom effects
// ============================================================

import type { ThemeMode, DensityMode, GalaxyTheme, AppearanceConfig, CustomEffectsConfig } from '@lumen/launcher-core';

export interface LumenTheme {
  mode: ThemeMode;
  galaxyTheme: GalaxyTheme;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  density: DensityMode;
  borderRadius: BorderRadius;
  shadows: Shadows;
  effects: CustomEffectsConfig;
}

export interface ThemeColors {
  // Primary
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;

  // Backgrounds
  bgRoot: string;
  bgSurface: string;
  bgCard: string;
  bgElevated: string;
  bgGlass: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;

  // Borders
  border: string;
  borderLight: string;

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;

  // Galaxy theme overlays
  galaxyOverlay1: string;
  galaxyOverlay2: string;
  galaxyAccent: string;
}

export interface Typography {
  fontFamily: string;
  fontFamilyCode: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface BorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glow: string;
}

// ===== Galaxy Theme Color Palettes =====

const lightColors: ThemeColors = {
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  primaryDark: '#5b21b6',
  accent: '#06b6d4',
  bgRoot: '#f8fafc',
  bgSurface: '#ffffff',
  bgCard: '#f1f5f9',
  bgElevated: '#ffffff',
  bgGlass: 'rgba(255,255,255,0.8)',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textOnPrimary: '#ffffff',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  galaxyOverlay1: 'rgba(124, 58, 237, 0.05)',
  galaxyOverlay2: 'rgba(6, 182, 212, 0.08)',
  galaxyAccent: '#7c3aed',
};

const darkColors: ThemeColors = {
  primary: '#a78bfa',
  primaryLight: '#c4b5fd',
  primaryDark: '#7c3aed',
  accent: '#22d3ee',
  bgRoot: '#0a0a1a',
  bgSurface: '#13132b',
  bgCard: '#1a1a3e',
  bgElevated: '#1e1e46',
  bgGlass: 'rgba(19, 19, 43, 0.85)',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textOnPrimary: '#0f172a',
  border: '#2a2a5a',
  borderLight: '#1e1e46',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
  galaxyOverlay1: 'rgba(167, 139, 250, 0.08)',
  galaxyOverlay2: 'rgba(34, 211, 238, 0.06)',
  galaxyAccent: '#a78bfa',
};

// ===== Galaxy Theme Variants =====

const nebulaColors: ThemeColors = {
  ...darkColors,
  primary: '#f472b6',
  primaryLight: '#f9a8d4',
  primaryDark: '#db2777',
  accent: '#e879f9',
  galaxyOverlay1: 'rgba(244, 114, 182, 0.08)',
  galaxyOverlay2: 'rgba(232, 121, 249, 0.06)',
  galaxyAccent: '#f472b6',
};

const cosmicColors: ThemeColors = {
  ...darkColors,
  primary: '#38bdf8',
  primaryLight: '#7dd3fc',
  primaryDark: '#0284c7',
  accent: '#2dd4bf',
  galaxyOverlay1: 'rgba(56, 189, 248, 0.08)',
  galaxyOverlay2: 'rgba(45, 212, 191, 0.06)',
  galaxyAccent: '#38bdf8',
};

const heavenColors: ThemeColors = {
  ...lightColors,
  primary: '#f0c040',
  primaryLight: '#fde68a',
  primaryDark: '#d97706',
  accent: '#fb923c',
  bgRoot: '#fffbeb',
  bgSurface: '#ffffff',
  bgCard: '#fef3c7',
  bgElevated: '#fff7ed',
  galaxyOverlay1: 'rgba(251, 191, 36, 0.06)',
  galaxyOverlay2: 'rgba(249, 115, 22, 0.04)',
  galaxyAccent: '#f59e0b',
};

// ===== Typography =====

export const defaultTypography: Typography = {
  fontFamily: '"Georgia", serif',
  fontFamilyCode: '"JetBrains Mono", "Fira Code", monospace',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ===== Layout =====

export const defaultSpacing: Spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const defaultBorderRadius: BorderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
};

export const defaultShadows: Shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.05)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 25px rgba(0,0,0,0.15)',
  xl: '0 20px 50px rgba(0,0,0,0.2)',
  glow: '0 0 20px rgba(124,58,237,0.3)',
};

// ===== Theme Builder =====

export function buildTheme(
  appearance: AppearanceConfig
): LumenTheme {
  const isDark = appearance.themeMode === 'dark' ||
    (appearance.themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const baseColors = isDark ? darkColors : lightColors;
  let galaxyColors = baseColors;

  switch (appearance.galaxyTheme) {
    case 'nebula':
      galaxyColors = { ...nebulaColors };
      break;
    case 'cosmic':
      galaxyColors = { ...cosmicColors };
      break;
    case 'heaven':
      galaxyColors = { ...heavenColors };
      break;
    default:
      galaxyColors = { ...baseColors };
  }

  // Apply accent color override
  galaxyColors.accent = appearance.accentColor;
  galaxyColors.primary = appearance.accentColor;

  return {
    mode: isDark ? 'dark' : 'light',
    galaxyTheme: appearance.galaxyTheme,
    colors: galaxyColors,
    typography: {
      ...defaultTypography,
      fontFamily: appearance.fontFamily || defaultTypography.fontFamily,
      fontSize: {
        ...defaultTypography.fontSize,
        base: `${appearance.fontSize / 16 * appearance.fontSizeScale}rem`,
      },
    },
    spacing: defaultSpacing,
    density: appearance.density,
    borderRadius: defaultBorderRadius,
    shadows: isDark
      ? { ...defaultShadows, sm: '0 1px 2px rgba(0,0,0,0.2)' }
      : defaultShadows,
    effects: appearance.customEffects,
  };
}

// ===== CSS Variable Generation =====

export function generateThemeCSS(theme: LumenTheme): Record<string, string> {
  return {
    '--lumen-primary': theme.colors.primary,
    '--lumen-primary-light': theme.colors.primaryLight,
    '--lumen-primary-dark': theme.colors.primaryDark,
    '--lumen-accent': theme.colors.accent,
    '--lumen-bg-root': theme.colors.bgRoot,
    '--lumen-bg-surface': theme.colors.bgSurface,
    '--lumen-bg-card': theme.colors.bgCard,
    '--lumen-bg-elevated': theme.colors.bgElevated,
    '--lumen-bg-glass': theme.colors.bgGlass,
    '--lumen-text-primary': theme.colors.textPrimary,
    '--lumen-text-secondary': theme.colors.textSecondary,
    '--lumen-text-muted': theme.colors.textMuted,
    '--lumen-text-on-primary': theme.colors.textOnPrimary,
    '--lumen-border': theme.colors.border,
    '--lumen-border-light': theme.colors.borderLight,
    '--lumen-success': theme.colors.success,
    '--lumen-warning': theme.colors.warning,
    '--lumen-error': theme.colors.error,
    '--lumen-info': theme.colors.info,
    '--lumen-font-family': theme.typography.fontFamily,
    '--lumen-font-size': theme.typography.fontSize.base,
    '--lumen-radius': theme.borderRadius.md,
  };
}

// ===== Galaxy Background Effects =====

export const GALAXY_BACKGROUND_CSS = `
  .lumen-galaxy-bg {
    position: relative;
    overflow: hidden;
  }
  .lumen-galaxy-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, var(--lumen-primary) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, var(--lumen-accent) 0%, transparent 40%),
      radial-gradient(ellipse at 50% 80%, var(--lumen-primary-light) 0%, transparent 45%);
    opacity: 0.15;
    pointer-events: none;
    z-index: 0;
  }
  .lumen-galaxy-stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(2px 2px at 10% 15%, rgba(255,255,255,0.8), transparent),
      radial-gradient(2px 2px at 30% 45%, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 55% 25%, rgba(255,255,255,0.7), transparent),
      radial-gradient(2px 2px at 70% 60%, rgba(255,255,255,0.5), transparent),
      radial-gradient(1px 1px at 85% 35%, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.6), transparent),
      radial-gradient(2px 2px at 45% 85%, rgba(255,255,255,0.4), transparent);
    pointer-events: none;
    z-index: 0;
  }
`;

// ===== Accessibility Helpers =====

export function getFocusRing(color: string): string {
  return `0 0 0 3px ${color}40`;
}

export function getContrastText(bgHex: string): string {
  // Simple luminance check
  const hex = bgHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#0f172a' : '#f1f5f9';
}
