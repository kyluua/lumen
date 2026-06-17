// ============================================================
// SkinService — fetch, view, save, export, and import Minecraft
// skins. 360° viewer support. Username-based skin lookup.
// ============================================================

import type { SkinInfo, SkinExport } from '../types';

const MOJANG_API_URL = 'https://api.mojang.com';
const MINESKIN_API_URL = 'https://api.mineskin.org';
const SESSION_API_URL = 'https://sessionserver.mojang.com';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

/** Get UUID from username */
export async function getUUIDFromUsername(username: string): Promise<string | null> {
  try {
    const response = await _fetch(
      `${MOJANG_API_URL}/users/profiles/minecraft/${encodeURIComponent(username)}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.id;
  } catch {
    return null;
  }
}

/** Get skin info from UUID */
export async function getSkinByUUID(uuid: string): Promise<SkinInfo | null> {
  try {
    const response = await _fetch(
      `${SESSION_API_URL}/session/minecraft/profile/${uuid}`
    );
    if (!response.ok) return null;
    const data = await response.json();

    const textures = data.properties?.find((p: any) => p.name === 'textures');
    if (!textures) return null;

    const decoded = JSON.parse(atob(textures.value));
    const skinUrl = decoded.textures?.SKIN?.url;
    const capeUrl = decoded.textures?.CAPE?.url;
    const model = decoded.textures?.SKIN?.metadata?.model === 'slim' ? 'slim' : 'classic';

    return {
      username: data.name,
      uuid,
      skinUrl,
      capeUrl,
      model,
      timestamp: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** Look up skin by username */
export async function getSkinByUsername(username: string): Promise<SkinInfo | null> {
  const uuid = await getUUIDFromUsername(username);
  if (!uuid) return null;
  return getSkinByUUID(uuid);
}

/** Download skin PNG data */
export async function downloadSkin(skinUrl: string): Promise<Uint8Array | null> {
  try {
    const response = await _fetch(skinUrl);
    if (!response.ok) return null;
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return null;
  }
}

/** Export a skin to PNG format */
export function exportSkin(
  data: Uint8Array,
  username: string,
  model: 'classic' | 'slim'
): SkinExport {
  return {
    format: 'png',
    width: 64,
    height: model === 'slim' ? 64 : 64,
    data,
    model,
  };
}

/** Create a download URL for a skin blob */
export function createSkinDownloadUrl(
  data: Uint8Array,
  filename: string
): string {
  const blob = new Blob([data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as BlobPart], { type: 'image/png' });
  return URL.createObjectURL(blob);
}

/** Parse an uploaded skin file */
export async function parseSkinFile(file: File): Promise<SkinExport | null> {
  if (file.type !== 'image/png') return null;

  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Determine model from image dimensions
  const img = await createImageBitmap(new Blob([data]));
  const model: 'classic' | 'slim' = img.width === 64 && img.height === 64 ? 'slim' : 'classic';

  return {
    format: 'png',
    width: img.width,
    height: img.height,
    data,
    model,
  };
}

/** Generate the 3D skin preview UV mapping data */
export function getSkinUVMapping(model: 'classic' | 'slim'): {
  head: { u: number; v: number; w: number; h: number };
  body: { u: number; v: number; w: number; h: number };
  leftArm: { u: number; v: number; w: number; h: number };
  rightArm: { u: number; v: number; w: number; h: number };
  leftLeg: { u: number; v: number; w: number; h: number };
  rightLeg: { u: number; v: number; w: number; h: number };
  armWidth: number;
} {
  return {
    head: { u: 0, v: 0, w: 32, h: 16 },
    body: { u: 16, v: 16, w: 24, h: 16 },
    leftArm: { u: 40, v: 16, w: model === 'slim' ? 12 : 16, h: 16 },
    rightArm: { u: 32, v: 48, w: model === 'slim' ? 12 : 16, h: 16 },
    leftLeg: { u: 16, v: 48, w: 4, h: 16 },
    rightLeg: { u: 0, v: 16, w: 4, h: 16 },
    armWidth: model === 'slim' ? 12 : 16,
  };
}

/** Get skin history from local storage key */
export function getSkinHistoryKey(): string {
  return 'lumen_skin_history';
}
