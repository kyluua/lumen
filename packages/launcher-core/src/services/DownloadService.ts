// ============================================================
// DownloadService — download queue with pause/resume, checksum
// validation, retry/rollback, and progress tracking.
// ============================================================

import type { DownloadState, DownloadProgress } from '../types';

let _fetch: typeof fetch = globalThis.fetch.bind(globalThis);

export function setFetch(f: typeof fetch) {
  _fetch = f;
}

export interface DownloadQueue {
  items: DownloadState[];
  concurrent: number;
  onProgress?: (progress: DownloadProgress) => void;
  onFileComplete?: (item: DownloadState) => void;
  onError?: (item: DownloadState, error: Error) => void;
}

/** Create a new download queue */
export function createDownloadQueue(options?: Partial<DownloadQueue>): DownloadQueue {
  return {
    items: [],
    concurrent: 3,
    ...options,
  };
}

/** Add a download to the queue */
export function addToQueue(
  queue: DownloadQueue,
  item: Omit<DownloadState, 'id' | 'status' | 'downloaded' | 'retries'>
): string {
  const id = 'dl_' + Math.random().toString(36).slice(2, 10);
  const entry: DownloadState = {
    ...item,
    id,
    status: 'queued',
    downloaded: 0,
    retries: 0,
    maxRetries: item.maxRetries ?? 3,
  };
  queue.items.push(entry);
  return id;
}

/** Remove a download from the queue */
export function removeFromQueue(queue: DownloadQueue, id: string): boolean {
  const idx = queue.items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const item = queue.items[idx];
  if (item.status === 'downloading') {
    // Can't remove active downloads
    return false;
  }
  queue.items.splice(idx, 1);
  return true;
}

/** Pause a download */
export function pauseDownload(queue: DownloadQueue, id: string): boolean {
  const item = queue.items.find((i) => i.id === id);
  if (item && item.status === 'downloading') {
    item.status = 'paused';
    return true;
  }
  return false;
}

/** Resume a paused download */
export function resumeDownload(queue: DownloadQueue, id: string): boolean {
  const item = queue.items.find((i) => i.id === id);
  if (item && item.status === 'paused') {
    item.status = 'queued';
    return true;
  }
  return false;
}

/** Calculate overall progress */
export function getQueueProgress(queue: DownloadQueue): DownloadProgress {
  const total = queue.items.length;
  if (total === 0) {
    return { overall: 0, currentFile: '', speed: 0, remaining: 0, queued: 0, completed: 0, failed: 0 };
  }

  let completed = 0;
  let failed = 0;
  let queued = 0;
  let totalDownloaded = 0;
  let totalSize = 0;
  let currentFile = '';

  for (const item of queue.items) {
    totalDownloaded += item.downloaded;
    totalSize += item.size;
    if (item.status === 'completed') completed++;
    if (item.status === 'failed') failed++;
    if (item.status === 'queued' || item.status === 'downloading' || item.status === 'retrying') {
      queued++;
      if (item.status === 'downloading') currentFile = item.url;
    }
  }

  return {
    overall: totalSize > 0 ? totalDownloaded / totalSize : 0,
    currentFile,
    speed: 0,
    remaining: 0,
    queued,
    completed,
    failed,
  };
}

/** Validate checksum (SHA-1) */
export async function validateChecksum(data: Uint8Array, expectedSha1: string): Promise<boolean> {
  if (!expectedSha1) return true; // skip if no checksum provided
  const hashBuffer = await crypto.subtle.digest('SHA-1', data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toLowerCase() === expectedSha1.toLowerCase();
}

/** Simple download with progress */
export async function downloadFile(
  url: string,
  onProgress?: (downloaded: number, total: number) => void
): Promise<Uint8Array> {
  const response = await _fetch(url);
  if (!response.ok) throw new Error(`Download failed: ${response.status} ${response.statusText}`);

  const contentLength = parseInt(response.headers.get('content-length') ?? '0', 10);
  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body reader');

  const chunks: Uint8Array[] = [];
  let downloaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    downloaded += value.length;
    onProgress?.(downloaded, contentLength);
  }

  const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/** Retry a failed download */
export function retryDownload(queue: DownloadQueue, id: string): boolean {
  const item = queue.items.find((i) => i.id === id);
  if (item && item.status === 'failed' && item.retries < item.maxRetries) {
    item.status = 'retrying';
    item.retries++;
    item.error = undefined;
    return true;
  }
  return false;
}