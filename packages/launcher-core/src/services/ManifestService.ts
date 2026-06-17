// ============================================================
// ManifestService — resolve Minecraft version manifests,
// fetch version details, asset indexes, and libraries from
// Mojang's official launchermeta API.
// ============================================================

import type {
  MinecraftVersionManifest,
  MinecraftVersionEntry,
  MinecraftVersionDetail,
  AssetIndex,
} from '../types';

const MOJANG_MANIFEST_URL = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
const RESOURCES_URL = 'https://resources.download.minecraft.net';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

/** Fetch the Minecraft version manifest (all versions) */
export async function fetchVersionManifest(): Promise<MinecraftVersionManifest> {
  const response = await _fetch(MOJANG_MANIFEST_URL);
  if (!response.ok) throw new Error(`Failed to fetch Minecraft version manifest: ${response.status}`);
  return response.json();
}

/** Get a single version entry by ID */
export async function getVersionEntry(
  versionId: string,
  manifest?: MinecraftVersionManifest
): Promise<MinecraftVersionEntry | null> {
  const m = manifest ?? (await fetchVersionManifest());
  return m.versions.find((v) => v.id === versionId) ?? null;
}

/** Fetch full version detail JSON */
export async function fetchVersionDetail(versionEntry: MinecraftVersionEntry | string): Promise<MinecraftVersionDetail> {
  const url = typeof versionEntry === 'string'
    ? (await getVersionEntry(versionEntry))?.url
    : versionEntry.url;
  if (!url) throw new Error('Version URL not found');
  const response = await _fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch version detail: ${response.status}`);
  return response.json();
}

/** Fetch the asset index */
export async function fetchAssetIndex(assetIndexInfo: { id: string; url: string }): Promise<AssetIndex> {
  const response = await _fetch(assetIndexInfo.url);
  if (!response.ok) throw new Error(`Failed to fetch asset index: ${response.status}`);
  return response.json();
}

/** Get the asset download URL for a given hash */
export function getAssetUrl(hash: string): string {
  const prefix = hash.substring(0, 2);
  return `${RESOURCES_URL}/${prefix}/${hash}`;
}

/** Build Minecraft version detail with library paths resolved */
export function resolveLibraries(
  detail: MinecraftVersionDetail,
  osName: string,
  osArch: string
): { libraries: string[]; natives: string[] } {
  const libraries: string[] = [];
  const natives: string[] = [];

  for (const lib of detail.libraries) {
    // Check rules
    if (lib.rules && !checkRules(lib.rules, osName)) {
      continue;
    }

    if (lib.downloads.artifact) {
      libraries.push(lib.downloads.artifact.path);
    }

    // Native libraries
    if (lib.natives) {
      const nativeKey = getNativeKey(osName);
      if (nativeKey && lib.natives[nativeKey] && lib.downloads.classifiers) {
        const classifier = lib.downloads.classifiers[lib.natives[nativeKey]];
        if (classifier) {
          natives.push(classifier.path);
        }
      }
    }
  }

  return { libraries, natives };
}

/** Check library rules for OS compatibility */
function checkRules(
  rules: { action: 'allow' | 'disallow'; os?: { name?: string; version?: string; arch?: string } }[],
  osName: string
): boolean {
  let allowed = false;
  for (const rule of rules) {
    if (!rule.os) {
      if (rule.action === 'allow') allowed = true;
      continue;
    }
    const osMatches = !rule.os.name || osName.toLowerCase().includes(rule.os.name.toLowerCase());
    if (osMatches) {
      allowed = rule.action === 'allow';
    }
  }
  return allowed;
}

/** Map OS names to native library keys */
function getNativeKey(osName: string): string | null {
  const lower = osName.toLowerCase();
  if (lower.includes('win')) return 'windows';
  if (lower.includes('mac') || lower.includes('darwin')) return 'osx';
  if (lower.includes('linux')) return 'linux';
  return null;
}

/** Filter version list to supported versions (1.21.x+) */
export function filterSupportedVersions(manifest: MinecraftVersionManifest): MinecraftVersionEntry[] {
  return manifest.versions.filter((v) => {
    const parts = v.id.split('.');
    if (parts[0] !== '1') return false;
    const minor = parseInt(parts[1], 10);
    // Support 1.21+ (and preview/snapshot for 1.21+)
    return minor >= 21 || v.type === 'snapshot';
  });
}

/** Get the latest release version */
export function getLatestRelease(manifest: MinecraftVersionManifest): MinecraftVersionEntry | null {
  return manifest.versions.find((v) => v.id === manifest.latest.release) ?? null;
}
