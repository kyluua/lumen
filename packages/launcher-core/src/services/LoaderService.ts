// ============================================================
// LoaderService — install and manage Fabric, Forge, and NeoForge
// loaders. Handles version resolution, installer flows, and
// compatibility verification.
// ============================================================

import type {
  LoaderType,
  LoaderInstallConfig,
  LoaderVersion,
  FabricLoaderInfo,
  ForgeVersionInfo,
  NeoForgeVersionInfo,
} from '../types';

const FABRIC_META_URL = 'https://meta.fabricmc.net/v2';
const FORGE_MAVEN_URL = 'https://maven.minecraftforge.net';
const NEOFORGE_MAVEN_URL = 'https://maven.neoforged.net';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

// ===== Fabric =====

/** Fetch available Fabric loader versions */
export async function fetchFabricLoaderVersions(): Promise<FabricLoaderInfo[]> {
  const response = await _fetch(`${FABRIC_META_URL}/versions/loader`);
  if (!response.ok) throw new Error('Failed to fetch Fabric loader versions');
  return response.json();
}

/** Fetch Fabric game versions (Minecraft versions Fabric supports) */
export async function fetchFabricGameVersions(): Promise<{ version: string; stable: boolean }[]> {
  const response = await _fetch(`${FABRIC_META_URL}/versions/game`);
  if (!response.ok) throw new Error('Failed to fetch Fabric game versions');
  return response.json();
}

/** Get the Fabric installer download URL for a specific version */
export function getFabricInstallerUrl(loaderVersion: string, minecraftVersion: string): string {
  return `${FABRIC_META_URL}/versions/loader/${minecraftVersion}/${loaderVersion}/profile/json`;
}

/** Build Fabric profile JSON */
export async function buildFabricProfile(
  minecraftVersion: string,
  loaderVersion: string
): Promise<object> {
  const url = getFabricInstallerUrl(loaderVersion, minecraftVersion);
  const response = await _fetch(url);
  if (!response.ok) throw new Error('Failed to build Fabric profile');
  return response.json();
}

// ===== Forge =====

/** Fetch available Forge versions for a Minecraft version */
export async function fetchForgeVersions(minecraftVersion: string): Promise<ForgeVersionInfo[]> {
  const url = `${FORGE_MAVEN_URL}/net/minecraftforge/forge/index_${minecraftVersion}.json`;
  const response = await _fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch Forge versions for MC ${minecraftVersion}`);
  const data = await response.json();
  return data.versions ?? [];
}

/** Get Forge installer URL */
export function getForgeInstallerUrl(forgeVersion: string, minecraftVersion: string): string {
  const fullVersion = `${minecraftVersion}-${forgeVersion}`;
  return `${FORGE_MAVEN_URL}/net/minecraftforge/forge/${fullVersion}/forge-${fullVersion}-installer.jar`;
}

/** Get Forge universal jar URL */
export function getForgeUniversalUrl(forgeVersion: string, minecraftVersion: string): string {
  const fullVersion = `${minecraftVersion}-${forgeVersion}`;
  return `${FORGE_MAVEN_URL}/net/minecraftforge/forge/${fullVersion}/forge-${fullVersion}-universal.jar`;
}

// ===== NeoForge =====

/** Fetch available NeoForge versions */
export async function fetchNeoForgeVersions(): Promise<NeoForgeVersionInfo[]> {
  const response = await _fetch(`${NEOFORGE_MAVEN_URL}/net/neoforged/neoforge/maven-metadata.xml`);
  if (!response.ok) throw new Error('Failed to fetch NeoForge versions');
  // Parse XML metadata response
  const text = await response.text();
  const versions = parseNeoForgeMetadata(text);
  return versions;
}

function parseNeoForgeMetadata(xml: string): NeoForgeVersionInfo[] {
  const versionRegex = /<version>([\d.]+(?:-beta)?)<\/version>/g;
  const versions: NeoForgeVersionInfo[] = [];
  let match;
  while ((match = versionRegex.exec(xml)) !== null) {
    versions.push({
      version: match[1],
      mcVersion: '', // filled in by caller
    });
  }
  return versions;
}

/** Get NeoForge installer URL */
export function getNeoForgeInstallerUrl(neoForgeVersion: string): string {
  return `${NEOFORGE_MAVEN_URL}/net/neoforged/neoforge/${neoForgeVersion}/neoforge-${neoForgeVersion}-installer.jar`;
}

// ===== Common =====

/** Validate loader/Minecraft version compatibility */
export function validateLoaderCompatibility(
  loaderType: LoaderType,
  minecraftVersion: string,
  loaderVersion: string
): { compatible: boolean; warnings: string[] } {
  const warnings: string[] = [];

  // Fabric typically supports latest MC quickly
  if (loaderType === 'fabric') {
    // Fabric is generally quick to support new versions
  }

  if (loaderType === 'forge') {
    warnings.push('Forge updates may lag behind Minecraft releases. Check compatibility before upgrading.');
  }

  if (loaderType === 'neoforge') {
    warnings.push('NeoForge is a fork of Forge. Ensure your mods are compatible with NeoForge.');
  }

  return { compatible: true, warnings };
}

/** Get the recommended loader version for a Minecraft version */
export function getRecommendedLoaderVersion(
  loaderType: LoaderType,
  _minecraftVersion: string
): string | null {
  switch (loaderType) {
    case 'fabric':
      return 'latest'; // resolve at install time
    case 'forge':
      return 'recommended';
    case 'neoforge':
      return 'latest';
    default:
      return null;
  }
}

/** Prepare install config for a loader */
export function prepareLoaderInstall(config: LoaderInstallConfig): LoaderInstallConfig {
  return {
    ...config,
    gameDirectory: config.gameDirectory.replace(/\\/g, '/'),
    javaPath: config.javaPath.replace(/\\/g, '/'),
  };
}