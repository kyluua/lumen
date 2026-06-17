// ============================================================
// DiagnosticService — diagnostic report generation,
// log buffers, system info collection, and export.
// User-controlled, transparent, no hidden telemetry.
// ============================================================

import type { DiagnosticReport, HardwareInfo, LumenSettings } from '../types';

/** Collect hardware information */
export function collectHardwareInfo(): HardwareInfo {
  return {
    osName: getOSName(),
    osVersion: getOSVersion(),
    cpuCores: navigator.hardwareConcurrency ?? 4,
    cpuModel: 'Unknown', // Requires native API
    totalRamMB: 0, // Requires native API
    gpuModel: 'Unknown', // Requires native API
    freeDiskGB: 0, // Requires native API
  };
}

function getOSName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown';
}

function getOSVersion(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) {
    const match = ua.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      const versionMap: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' };
      return versionMap[match[1]] ?? match[1];
    }
  }
  if (ua.includes('Mac OS X')) {
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    return match ? match[1].replace('_', '.') : 'macOS';
  }
  return 'Unknown';
}

/** Create a full diagnostic report */
export function createDiagnosticReport(
  lumenVersion: string,
  javaRuntimes: string[],
  profiles: string[],
  recentCrashes: string[],
  logBuffer: string,
  settings: Partial<LumenSettings>
): DiagnosticReport {
  return {
    id: 'diag_' + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    lumenVersion,
    os: `${getOSName()} ${getOSVersion()}`,
    javaRuntimes,
    profiles,
    recentCrashes,
    logBuffer,
    settingsSnapshot: settings,
  };
}

/** Export diagnostic report as JSON file */
export function exportDiagnosticReport(report: DiagnosticReport): string {
  const sanitized = sanitizeDiagnosticData(report);
  return JSON.stringify(sanitized, null, 2);
}

/** Sanitize sensitive data from diagnostic reports */
function sanitizeDiagnosticData(report: DiagnosticReport): DiagnosticReport {
  // Remove personal information and tokens
  const sanitized = { ...report };

  if (sanitized.settingsSnapshot?.accounts) {
    sanitized.settingsSnapshot = {
      ...sanitized.settingsSnapshot,
      accounts: {
        ...sanitized.settingsSnapshot.accounts,
        accounts: sanitized.settingsSnapshot.accounts.accounts.map((a) => ({
          ...a,
          uuid: '[REDACTED]',
        })),
      },
    };
  }

  if (sanitized.settingsSnapshot?.apiKeys) {
    sanitized.settingsSnapshot = {
      ...sanitized.settingsSnapshot,
      apiKeys: {
        curseForgeApiKey: sanitized.settingsSnapshot.apiKeys.curseForgeApiKey ? '[REDACTED]' : undefined,
        modrinthApiKey: sanitized.settingsSnapshot.apiKeys.modrinthApiKey ? '[REDACTED]' : undefined,
      },
    };
  }

  return sanitized;
}

/** Create a download URL for a diagnostic report */
export function createDiagnosticDownloadUrl(report: DiagnosticReport): string {
  const json = exportDiagnosticReport(report);
  const blob = new Blob([json], { type: 'application/json' });
  return URL.createObjectURL(blob);
}

/** Log buffer for collecting runtime diagnostics */
export class LogBuffer {
  private lines: string[] = [];
  private maxLines: number;

  constructor(maxLines: number = 1000) {
    this.maxLines = maxLines;
  }

  append(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    this.lines.push(formatted);
    if (this.lines.length > this.maxLines) {
      this.lines.shift();
    }
  }

  getLines(count?: number): string {
    const lines = count ? this.lines.slice(-count) : this.lines;
    return lines.join('\n');
  }

  clear(): void {
    this.lines = [];
  }

  search(query: string): string[] {
    const lower = query.toLowerCase();
    return this.lines.filter((l) => l.toLowerCase().includes(lower));
  }
}

// Global log buffer instance
export const globalLogBuffer = new LogBuffer(2000);

/** Quick system check to validate Lumen is running in a supported environment */
export function quickSystemCheck(): { pass: boolean; issues: string[] } {
  const issues: string[] = [];
  const osName = getOSName();

  if (osName === 'Unknown') {
    issues.push('Unable to determine operating system. Lumen may not function correctly.');
  }

  return { pass: issues.length === 0, issues };
}
