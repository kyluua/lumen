// ============================================================
// ProfileService — manages Minecraft profiles (CRUD, import/export,
// per-profile settings, validation, and repair)
// ============================================================

import type {
  Profile,
  ProfileTemplate,
  ProfileBundle,
  LoaderType,
  MemorySettings,
  ResolutionSettings,
  ReleaseChannel,
  JavaRuntimeRef,
} from '../types';
import { DEFAULT_SETTINGS } from '../index';

let _settings: any = DEFAULT_SETTINGS;

export function injectSettings(getSettings: () => any) {
  _settings = getSettings;
}

/** Generate a unique profile ID (v4-like UUID in browser-safe form) */
function uid(): string {
  return 'profile_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
}

/** Create a new profile with sensible defaults */
export function createProfile(options: {
  name: string;
  minecraftVersion: string;
  loaderType: LoaderType;
  loaderVersion?: string;
  releaseChannel?: ReleaseChannel;
  javaRuntime?: JavaRuntimeRef;
  memory?: MemorySettings;
  resolution?: ResolutionSettings;
  gameDirectory?: string;
}): Profile {
  const settings = _settings();
  const now = new Date().toISOString();
  const defaultJava = settings.java.runtimes?.[0] ?? {
    path: 'java',
    version: '21',
    vendor: 'Unknown',
    majorVersion: 21,
  };

  return {
    id: uid(),
    name: options.name,
    minecraftVersion: options.minecraftVersion,
    loaderType: options.loaderType,
    loaderVersion: options.loaderVersion,
    releaseChannel: options.releaseChannel ?? 'stable',
    gameDirectory: options.gameDirectory ?? `./instances/${options.name.replace(/\s+/g, '_')}`,
    javaRuntime: options.javaRuntime ?? {
      path: defaultJava.path,
      version: defaultJava.version,
      vendor: defaultJava.vendor,
      majorVersion: defaultJava.majorVersion,
    },
    memory: options.memory ?? { min: 2048, max: 4096 },
    resolution: options.resolution ?? { width: 1920, height: 1080, fullscreen: false },
    launchArgs: [],
    state: 'ready',
    favorite: false,
    bundledMods: [],
    bundledResourcePacks: [],
    createdAt: now,
    updatedAt: now,
  };
}

/** Validate a profile for launch readiness */
export function validateProfile(profile: Profile): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!profile.name.trim()) errors.push('Profile name is required.');
  if (!profile.minecraftVersion) errors.push('Minecraft version is required.');
  if (!profile.javaRuntime?.path) errors.push('Java runtime is required.');
  if (profile.javaRuntime && profile.javaRuntime.majorVersion < 21) {
    errors.push(`Java ${profile.javaRuntime.majorVersion} is too old. JDK 21+ is required.`);
  }
  if (profile.javaRuntime && profile.javaRuntime.majorVersion === 25) {
    warnings.push('JDK 25 is supported but less tested. JDK 21 is recommended for most profiles.');
  }
  if (profile.javaRuntime && profile.javaRuntime.majorVersion > 25) {
    warnings.push(`Java ${profile.javaRuntime.majorVersion} has not been extensively tested. Launch may fail.`);
  }
  if (profile.memory.min < 1024) warnings.push('Less than 1GB minimum RAM may cause performance issues.');
  if (profile.memory.max < 2048) warnings.push('Less than 2GB maximum RAM may cause instability for modded profiles.');

  return { valid: errors.length === 0, errors, warnings };
}

/** Export profile as JSON for sharing */
export function exportProfile(profile: Profile): string {
  const exportable = { ...profile };
  // Redact sensitive paths if needed
  return JSON.stringify(exportable, null, 2);
}

/** Import a profile from JSON */
export function importProfile(json: string): Profile | null {
  try {
    const data = JSON.parse(json) as Profile;
    // Basic validation
    if (!data.name || !data.minecraftVersion || !data.loaderType) return null;
    data.id = uid();
    data.state = 'ready';
    data.updatedAt = new Date().toISOString();
    return data;
  } catch {
    return null;
  }
}

/** Create profile from template */
export function createFromTemplate(template: ProfileTemplate, name: string): Profile {
  return createProfile({
    name,
    minecraftVersion: template.minecraftVersion,
    loaderType: template.loaderType,
    loaderVersion: template.loaderVersion,
    memory: template.memory,
    resolution: template.resolution,
  });
}

/** Bundle multiple profiles together */
export function createProfileBundle(
  name: string,
  minecraftVersion: string,
  profiles: string[],
  mods: string[],
  resourcePacks: string[]
): ProfileBundle {
  return {
    id: 'bundle_' + uid(),
    name,
    minecraftVersion,
    profiles,
    mods,
    resourcePacks,
    createdAt: new Date().toISOString(),
  };
}

/** Check if a version already has the maximum allowed profiles */
export function canAddProfile(version: string, existingProfiles: Profile[]): boolean {
  const max = _settings().modsAndPacks?.maxProfilesPerVersion ?? 5;
  const count = existingProfiles.filter((p) => p.minecraftVersion === version).length;
  return count < max;
}

/** Repair a profile's settings (reset to defaults while preserving core identity) */
export function repairProfile(profile: Profile): Profile {
  const settings = _settings();
  const defaultJava = settings.java.runtimes?.[0] ?? profile.javaRuntime;
  return {
    ...profile,
    memory: { min: 2048, max: 4096 },
    resolution: { width: 1920, height: 1080, fullscreen: false },
    launchArgs: [],
    state: 'ready',
    updatedAt: new Date().toISOString(),
    javaRuntime: defaultJava
      ? {
          path: defaultJava.path,
          version: defaultJava.version,
          vendor: defaultJava.vendor,
          majorVersion: defaultJava.majorVersion,
        }
      : profile.javaRuntime,
    bundledMods: profile.bundledMods,
    bundledResourcePacks: profile.bundledResourcePacks,
  };
}
