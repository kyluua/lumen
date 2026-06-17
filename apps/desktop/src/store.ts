// ============================================================
// Lumen — Zustand Store
// Central state management for the entire launcher.
// Persists settings, profiles, and preferences.
// ============================================================

import { create } from 'zustand';
import type {
  LumenSettings,
  Profile,
  JavaRuntime,
  AppearanceConfig,
  ThemeMode,
  DensityMode,
  GalaxyTheme,
  ReleaseChannel,
  OnboardingData,
  HardwareInfo,
  StoredAccount,
  CrashReport,
  LaunchHistory,
  ChangelogEntry,
  Extension,
  ProfileBundle,
  ModOrPackEntry,
} from '@lumen/launcher-core';
import { DEFAULT_SETTINGS } from '@lumen/launcher-core';
import { buildTheme, type LumenTheme } from '@lumen/ui/theme';

export interface LumenStore {
  // Settings
  settings: LumenSettings;
  theme: LumenTheme;

  // UI State
  currentPage: string;
  sidebarOpen: boolean;
  searchQuery: string;
  onboardingStep: number;
  showSplash: boolean;

  // Actions
  setSettings: (settings: Partial<LumenSettings>) => void;
  updateAppearance: (appearance: Partial<AppearanceConfig>) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setGalaxyTheme: (theme: GalaxyTheme) => void;
  setAccentColor: (color: string) => void;
  setDensity: (density: DensityMode) => void;
  setReducedMotion: (reduced: boolean) => void;

  // Profiles
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  removeProfile: (id: string) => void;
  setProfileState: (id: string, state: Profile['state']) => void;
  toggleFavorite: (id: string) => void;

  // Java
  addJavaRuntime: (runtime: JavaRuntime) => void;
  removeJavaRuntime: (id: string) => void;
  setDefaultJava: (path: string) => void;

  // Accounts
  addAccount: (account: StoredAccount) => void;
  removeAccount: (id: string) => void;
  setActiveAccount: (id: string) => void;

  // Updates
  setUpdateChannel: (channel: ReleaseChannel) => void;
  setChangelog: (entries: ChangelogEntry[]) => void;

  // Extensions
  addExtension: (ext: Extension) => void;
  toggleExtension: (id: string, enabled: boolean) => void;
  removeExtension: (id: string) => void;

  // Mods & Packs
  setApiKeys: (keys: { curseForgeApiKey?: string; modrinthApiKey?: string }) => void;
  addProfileBundle: (bundle: ProfileBundle) => void;
  removeProfileBundle: (id: string) => void;

  // Onboarding
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  setOnboardingStep: (step: number) => void;

  // Navigation
  navigate: (page: string) => void;
  toggleSidebar: () => void;
  setSearchQuery: (query: string) => void;

  // Crash Reports
  addCrashReport: (report: CrashReport) => void;
  resolveCrash: (id: string) => void;

  // Launch History
  addLaunchHistory: (entry: LaunchHistory) => void;

  // Splash
  dismissSplash: () => void;
}

export const useLumenStore = create<LumenStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  theme: buildTheme(DEFAULT_SETTINGS.appearance),

  currentPage: 'home',
  sidebarOpen: true,
  searchQuery: '',
  onboardingStep: 0,
  showSplash: true,

  // Settings
  setSettings: (partial) => {
    const current = get().settings;
    const updated = { ...current, ...partial };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  updateAppearance: (appearance) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, ...appearance },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  setThemeMode: (mode) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, themeMode: mode },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  setGalaxyTheme: (galaxyTheme) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, galaxyTheme },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  setAccentColor: (color) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, accentColor: color },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  setDensity: (density) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, density },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  setReducedMotion: (reduced) => {
    const current = get().settings;
    const updated = {
      ...current,
      appearance: { ...current.appearance, reducedMotion: reduced },
    };
    set({ settings: updated, theme: buildTheme(updated.appearance) });
  },

  // Profiles
  addProfile: (profile) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        profiles: { ...current.profiles, [profile.id]: profile },
      },
    });
  },

  updateProfile: (id, updates) => {
    const current = get().settings;
    const profile = current.profiles[id];
    if (!profile) return;
    set({
      settings: {
        ...current,
        profiles: {
          ...current.profiles,
          [id]: { ...profile, ...updates, updatedAt: new Date().toISOString() },
        },
      },
    });
  },

  removeProfile: (id) => {
    const current = get().settings;
    const { [id]: _, ...rest } = current.profiles;
    set({ settings: { ...current, profiles: rest } });
  },

  setProfileState: (id, state) => {
    get().updateProfile(id, { state });
  },

  toggleFavorite: (id) => {
    const profile = get().settings.profiles[id];
    if (profile) {
      get().updateProfile(id, { favorite: !profile.favorite });
    }
  },

  // Java
  addJavaRuntime: (runtime) => {
    const current = get().settings;
    const runtimes = [...current.java.runtimes.filter((r) => r.path !== runtime.path), runtime];
    set({ settings: { ...current, java: { ...current.java, runtimes } } });
  },

  removeJavaRuntime: (id) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        java: {
          ...current.java,
          runtimes: current.java.runtimes.filter((r) => r.id !== id),
        },
      },
    });
  },

  setDefaultJava: (path) => {
    const current = get().settings;
    set({ settings: { ...current, java: { ...current.java, defaultRuntimePath: path } } });
  },

  // Accounts
  addAccount: (account) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        accounts: {
          ...current.accounts,
          accounts: [...current.accounts.accounts, account],
        },
      },
    });
  },

  removeAccount: (id) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        accounts: {
          ...current.accounts,
          accounts: current.accounts.accounts.filter((a) => a.id !== id),
        },
      },
    });
  },

  setActiveAccount: (id) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        accounts: { ...current.accounts, activeAccountId: id },
      },
    });
  },

  // Updates
  setUpdateChannel: (channel) => {
    const current = get().settings;
    set({ settings: { ...current, updates: { ...current.updates, channel } } });
  },

  setChangelog: (_entries) => {
    // Changelog is derived from UpdateService
  },

  // Extensions
  addExtension: (ext) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        extensions: [...current.extensions.filter((e) => e.id !== ext.id), ext],
      },
    });
  },

  toggleExtension: (id, enabled) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        extensions: current.extensions.map((e) =>
          e.id === id ? { ...e, enabled } : e
        ),
      },
    });
  },

  removeExtension: (id) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        extensions: current.extensions.filter((e) => e.id !== id),
      },
    });
  },

  // Mods & Packs
  setApiKeys: (keys) => {
    const current = get().settings;
    set({ settings: { ...current, apiKeys: { ...current.apiKeys, ...keys } } });
  },

  addProfileBundle: (bundle) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        profileBundles: [...current.profileBundles, bundle],
      },
    });
  },

  removeProfileBundle: (id) => {
    const current = get().settings;
    set({
      settings: {
        ...current,
        profileBundles: current.profileBundles.filter((b) => b.id !== id),
      },
    });
  },

  // Onboarding
  setOnboardingData: (_data) => {
    // Onboarding data stored separately
  },

  completeOnboarding: () => {
    const current = get().settings;
    set({
      settings: { ...current, onboardingCompleted: true, firstRunCompleted: true },
    });
  },

  setOnboardingStep: (step) => set({ onboardingStep: step }),

  // Navigation
  navigate: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Crash Reports
  addCrashReport: (_report) => {
    // Crash reports managed separately
  },

  resolveCrash: (_id) => {
    // Crash resolution managed separately
  },

  // Launch History
  addLaunchHistory: (_entry) => {
    // Launch history managed separately
  },

  // Splash
  dismissSplash: () => set({ showSplash: false }),
}));