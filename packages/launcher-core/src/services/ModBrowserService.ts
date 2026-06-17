// ============================================================
// ModBrowserService — browse mods and resource packs from
// CurseForge and Modrinth APIs. Requires user-provided API keys.
// ============================================================

import type { ModrinthProject, CurseForgeProject, ModOrPackEntry } from '../types';

const MODRINTH_API_URL = 'https://api.modrinth.com/v2';
const CURSEFORGE_API_URL = 'https://api.curseforge.com/v1';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

// ===== Modrinth =====

/** Search Modrinth for mods */
export async function searchModrinthMods(
  query: string,
  apiKey?: string
): Promise<ModrinthProject[]> {
  const headers: Record<string, string> = {};
  if (apiKey) headers['Authorization'] = apiKey;

  const params = new URLSearchParams({
    query,
    facets: '[["project_type:mod"]]',
    limit: '25',
  });

  const response = await _fetch(`${MODRINTH_API_URL}/search?${params}`, { headers });
  if (!response.ok) throw new Error(`Modrinth search failed: ${response.status}`);
  const data = await response.json();
  return data.hits ?? [];
}

/** Search Modrinth for resource packs */
export async function searchModrinthResourcePacks(
  query: string,
  apiKey?: string
): Promise<ModrinthProject[]> {
  const headers: Record<string, string> = {};
  if (apiKey) headers['Authorization'] = apiKey;

  const params = new URLSearchParams({
    query,
    facets: '[["project_type:resourcepack"]]',
    limit: '25',
  });

  const response = await _fetch(`${MODRINTH_API_URL}/search?${params}`, { headers });
  if (!response.ok) throw new Error(`Modrinth search failed: ${response.status}`);
  const data = await response.json();
  return data.hits ?? [];
}

/** Get a single Modrinth project by ID */
export async function getModrinthProject(
  projectId: string,
  apiKey?: string
): Promise<ModrinthProject | null> {
  const headers: Record<string, string> = {};
  if (apiKey) headers['Authorization'] = apiKey;

  const response = await _fetch(`${MODRINTH_API_URL}/project/${projectId}`, { headers });
  if (!response.ok) return null;
  return response.json();
}

// ===== CurseForge =====

/** Search CurseForge for mods */
export async function searchCurseForgeMods(
  query: string,
  apiKey: string
): Promise<CurseForgeProject[]> {
  const params = new URLSearchParams({
    gameId: '432', // Minecraft
    classId: '6', // Mods
    searchFilter: query,
    sortField: '2', // Popularity
    sortOrder: 'desc',
    pageSize: '25',
  });

  const response = await _fetch(`${CURSEFORGE_API_URL}/mods/search?${params}`, {
    headers: { 'x-api-key': apiKey },
  });
  if (!response.ok) throw new Error(`CurseForge search failed: ${response.status}`);
  const data = await response.json();
  return data.data ?? [];
}

/** Search CurseForge for resource packs */
export async function searchCurseForgeResourcePacks(
  query: string,
  apiKey: string
): Promise<CurseForgeProject[]> {
  const params = new URLSearchParams({
    gameId: '432', // Minecraft
    classId: '12', // Resource Packs
    searchFilter: query,
    sortField: '2', // Popularity
    sortOrder: 'desc',
    pageSize: '25',
  });

  const response = await _fetch(`${CURSEFORGE_API_URL}/mods/search?${params}`, {
    headers: { 'x-api-key': apiKey },
  });
  if (!response.ok) throw new Error(`CurseForge search failed: ${response.status}`);
  const data = await response.json();
  return data.data ?? [];
}

/** Get a single CurseForge mod by ID */
export async function getCurseForgeProject(
  modId: number,
  apiKey: string
): Promise<CurseForgeProject | null> {
  const response = await _fetch(`${CURSEFORGE_API_URL}/mods/${modId}`, {
    headers: { 'x-api-key': apiKey },
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.data ?? null;
}

// ===== Unified =====

/** Convert Modrinth project to unified entry */
export function modrinthToEntry(project: ModrinthProject): ModOrPackEntry {
  return {
    id: project.project_id,
    source: 'modrinth',
    name: project.title,
    description: project.description,
    icon: project.icon_url,
    downloads: project.downloads,
    version: project.latest_version ?? project.versions[0] ?? 'unknown',
    type: 'mod',
  };
}

/** Convert CurseForge project to unified entry */
export function curseForgeToEntry(project: CurseForgeProject): ModOrPackEntry {
  return {
    id: String(project.id),
    source: 'curseforge',
    name: project.name,
    description: project.summary,
    icon: project.logo?.url,
    downloads: project.downloadCount,
    version: project.latestFiles?.[0]?.fileName ?? 'unknown',
    type: 'mod',
  };
}

/** Search both sources and merge results */
export async function searchAll(
  query: string,
  options: {
    modrinthApiKey?: string;
    curseForgeApiKey?: string;
    type?: 'mod' | 'resourcepack';
    defaultSource?: 'modrinth' | 'curseforge';
  }
): Promise<ModOrPackEntry[]> {
  const results: ModOrPackEntry[] = [];

  if (options.defaultSource === 'modrinth' || !options.defaultSource) {
    try {
      let modrinthResults: ModrinthProject[];
      if (options.type === 'resourcepack') {
        modrinthResults = await searchModrinthResourcePacks(query, options.modrinthApiKey);
      } else {
        modrinthResults = await searchModrinthMods(query, options.modrinthApiKey);
      }
      results.push(
        ...modrinthResults.map((m) => ({
          ...modrinthToEntry(m),
          type: options.type ?? 'mod',
        }))
      );
    } catch {
      // Modrinth unavailable — continue with CurseForge
    }
  }

  if ((options.defaultSource === 'curseforge' || !options.defaultSource) && options.curseForgeApiKey) {
    try {
      let curseResults: CurseForgeProject[];
      if (options.type === 'resourcepack') {
        curseResults = await searchCurseForgeResourcePacks(query, options.curseForgeApiKey);
      } else {
        curseResults = await searchCurseForgeMods(query, options.curseForgeApiKey);
      }
      results.push(
        ...curseResults.map((c) => ({
          ...curseForgeToEntry(c),
          type: options.type ?? 'mod',
        }))
      );
    } catch {
      // CurseForge unavailable
    }
  }

  return results;
}

/** Validate Modrinth API key format */
export function isValidModrinthKey(key: string): boolean {
  return /^mrp_[a-zA-Z0-9]{32,}$/.test(key);
}

/** Validate CurseForge API key format */
export function isValidCurseForgeKey(key: string): boolean {
  return /^\$2[abxy]\$[0-9]{2}\$[a-zA-Z0-9./]+$/.test(key) || key.length >= 32;
}
