// ============================================================
// CrashReportService — parse and manage Minecraft crash reports,
// identify relevant mods, and provide resolution guidance.
// ============================================================

import type { CrashReport, Profile, LoaderType } from '../types';

/** Parse a Minecraft crash report from raw text */
export function parseCrashReport(
  profile: Profile,
  rawReport: string
): CrashReport {
  const lines = rawReport.split('\n');

  // Extract crash message
  const descLine = lines.find((l) => l.trim().startsWith('Description:')) ?? '';
  const crashMessage = descLine.replace('Description:', '').trim();

  // Extract stack trace
  const stackStart = lines.findIndex((l) => l.trim().startsWith('Stacktrace:') || l.trim().startsWith('at '));
  const stackEnd = lines.findIndex((l, i) => i > stackStart && l.trim() === '');
  const stackTrace = lines.slice(stackStart, stackEnd > 0 ? stackEnd : lines.length).join('\n');

  // Identify relevant mods from crash
  const relevantMods = identifyRelevantMods(rawReport, profile.loaderType);

  return {
    id: 'crash_' + Date.now().toString(36),
    profileId: profile.id,
    launchedAt: new Date().toISOString(),
    minecraftVersion: profile.minecraftVersion,
    loaderType: profile.loaderType,
    crashFile: rawReport,
    crashMessage,
    stackTrace,
    relevantMods,
    resolved: false,
    createdAt: new Date().toISOString(),
  };
}

/** Identify mods potentially related to the crash */
function identifyRelevantMods(report: string, _loaderType: LoaderType): string[] {
  const mods: string[] = [];
  // Common mod patterns in crash reports
  const modRegex = /\b([a-zA-Z0-9_-]+(?:-[0-9.]+)?(?:\.jar)?)\b/g;
  const knownMods = new Set<string>();

  // Find lines referencing mods
  for (const line of report.split('\n')) {
    if (line.includes('mod') || line.includes('Mod') || line.includes('fabric') || line.includes('forge') || line.includes('neoforge')) {
      const matches = line.match(modRegex);
      if (matches) {
        for (const m of matches) {
          if (m.length > 3 && !m.endsWith('.class') && !m.endsWith('.java')) {
            knownMods.add(m);
          }
        }
      }
    }
  }

  return Array.from(knownMods).slice(0, 10);
}

/** Get common resolution suggestions based on crash type */
export function getCrashSuggestions(crash: CrashReport): string[] {
  const suggestions: string[] = [];
  const msg = crash.crashMessage.toLowerCase() + crash.stackTrace.toLowerCase();

  if (msg.includes('outofmemory') || msg.includes('heap space')) {
    suggestions.push('Increase allocated RAM in profile settings.');
    suggestions.push('Try reducing render distance or graphics settings.');
    suggestions.push('Remove memory-heavy mods or texture packs.');
  }
  if (msg.includes('classnotfound') || msg.includes('noclassdeffound')) {
    suggestions.push('Missing library or mod. Try repairing the profile.');
    suggestions.push('Check that all required mods are installed.');
  }
  if (msg.includes('unsupportedclassversion') || msg.includes('class version')) {
    suggestions.push('Java version mismatch. Ensure you are using JDK 21 for this profile.');
    suggestions.push('Try switching to JDK 21 as the default runtime.');
  }
  if (msg.includes('opengl') || msg.includes('pixel format')) {
    suggestions.push('Graphics driver issue. Update your GPU drivers.');
    suggestions.push('Try reducing graphics settings or disabling shaders.');
  }
  if (msg.includes('modloading') || msg.includes('loader')) {
    suggestions.push('A mod may be incompatible. Check mod versions and compatibility.');
    suggestions.push(`Use the repair function to reset the profile's loader state.`);
  }

  if (suggestions.length === 0) {
    suggestions.push('Export diagnostics and check the Lumen log viewer for details.');
    suggestions.push('Try repairing the profile or reinstalling the loader.');
  }

  return suggestions;
}

/** Mark crash as resolved */
export function resolveCrash(crash: CrashReport): CrashReport {
  return { ...crash, resolved: true };
}

/** Get crash summary for quick display */
export function getCrashSummary(crash: CrashReport): string {
  const lines = crash.crashMessage.split('\n');
  const firstLine = lines[0] ?? crash.crashMessage;
  return firstLine.length > 120 ? firstLine.slice(0, 117) + '...' : firstLine;
}
