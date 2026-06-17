// ============================================================
// UpdateService — signed app updates, changelog screen,
// release channels, and rollback support.
// ============================================================

import type { AppUpdate, ChangelogEntry, ChangelogItem, ReleaseChannel } from '../types';

const UPDATE_MANIFEST_URL = ''; // Configured per release channel

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

/** Check for available updates */
export async function checkForUpdates(
  currentVersion: string,
  channel: ReleaseChannel
): Promise<AppUpdate | null> {
  try {
    const url = `${UPDATE_MANIFEST_URL}/updates/${channel}/latest.json`;
    const response = await _fetch(url);
    if (!response.ok) return null;
    const update: AppUpdate = await response.json();

    if (update.version !== currentVersion) {
      return update;
    }
    return null;
  } catch {
    return null;
  }
}

/** Compare version strings */
export function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const na = partsA[i] ?? 0;
    const nb = partsB[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }
  return 0;
}

/** Check if an update is newer than the current version */
export function isNewerVersion(updateVersion: string, currentVersion: string): boolean {
  return compareVersions(updateVersion, currentVersion) > 0;
}

/** Validate update checksum */
export async function validateUpdateChecksum(
  data: Uint8Array,
  expectedChecksum: string
): Promise<boolean> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toLowerCase() === expectedChecksum.toLowerCase();
}

/** Create a changelog entry */
export function createChangelogEntry(
  version: string,
  date: string,
  changes: ChangelogItem[]
): ChangelogEntry {
  return { version, date, changes };
}

/** Get the changelog for the current version */
export function getChangelog(): ChangelogEntry[] {
  return [
    {
      version: '1.0.0',
      date: new Date().toISOString().split('T')[0],
      changes: [
        { type: 'feature', description: 'Initial release of Lumen launcher' },
        { type: 'feature', description: 'Vanilla, Fabric, Forge, and NeoForge profile support' },
        { type: 'feature', description: 'Java runtime auto-detection and validation (JDK 21, 25)' },
        { type: 'feature', description: 'Custom themes, accent colors, and density modes' },
        { type: 'feature', description: 'Skin viewer and editor with 360° rotation' },
        { type: 'feature', description: 'CurseForge and Modrinth mod/resource pack browsing' },
        { type: 'feature', description: 'Profile import/export and bundles (5 profiles per version)' },
        { type: 'feature', description: 'Custom visual effects: lightning, wind, rain, splashes, explosions' },
        { type: 'feature', description: 'Galaxy and heaven UI themes with Georgia font' },
        { type: 'feature', description: 'Microsoft/Xbox authentication flow' },
        { type: 'feature', description: 'In-game Click GUI with toggleable, customizable mods' },
        { type: 'feature', description: 'Crash report viewer and profile repair' },
        { type: 'feature', description: 'Signed updates with rollback support' },
        { type: 'security', description: 'No telemetry, no credential scraping, no hidden network calls' },
        { type: 'security', description: 'All assets are original or clearly licensed' },
        { type: 'improvement', description: 'Accessible keyboard navigation and focus states' },
        { type: 'improvement', description: 'Reduced motion mode for accessibility' },
      ],
    },
  ];
}

/** Get supported channels */
export function getReleaseChannels(): { value: ReleaseChannel; label: string; description: string }[] {
  return [
    { value: 'stable', label: 'Stable', description: 'Fully tested, production-ready builds' },
    { value: 'beta', label: 'Beta', description: 'Early access to new features, may have minor bugs' },
    { value: 'nightly', label: 'Nightly', description: 'Latest changes, may be unstable' },
    { value: '26.1.x', label: '26.1.x', description: 'Lumen 26.1 compatibility line' },
    { value: '26.2.x', label: '26.2.x', description: 'Lumen 26.2 compatibility line' },
  ];
}