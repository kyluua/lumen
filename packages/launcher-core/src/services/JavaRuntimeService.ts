// ============================================================
// JavaRuntimeService — auto-detect, validate, and manage Java
// runtimes. Supports JDK 21 (baseline), JDK 25 (supported),
// and compatibility checks for newer JDKs.
// ============================================================

import type { JavaRuntime, JavaCompatibilityCheck } from '../types';
import { JAVA_MIN_BASELINE, JAVA_RECOMMENDED, JAVA_NEXT_SUPPORTED } from '../types';

const KNOWN_VENDORS: Record<string, string> = {
  'Oracle': 'Oracle Corporation',
  'Eclipse': 'Eclipse Adoptium',
  'Azul': 'Azul Systems',
  'Microsoft': 'Microsoft',
  'IBM': 'IBM',
  'GraalVM': 'GraalVM Community',
  'OpenJDK': 'OpenJDK',
};

function uid(): string {
  return 'java_' + Math.random().toString(36).slice(2, 8) + '_' + Date.now().toString(36);
}

/** Check Java compatibility for a given Minecraft/loader profile */
export function checkJavaCompatibility(
  javaVersion: number,
  minecraftVersion: string,
  loaderType: string
): JavaCompatibilityCheck {
  const warnings: string[] = [];
  const errors: string[] = [];
  const [major] = minecraftVersion.split('.').map(Number);

  // Minecraft 1.21+ requires Java 21+
  if (major >= 1 && javaVersion < JAVA_MIN_BASELINE) {
    errors.push(`Minecraft ${minecraftVersion} requires Java ${JAVA_MIN_BASELINE}+. Detected Java ${javaVersion}.`);
  }

  // JDK 25 warnings
  if (javaVersion > JAVA_RECOMMENDED && javaVersion <= JAVA_NEXT_SUPPORTED) {
    warnings.push(`Java ${javaVersion} is supported but less tested than JDK ${JAVA_RECOMMENDED}.`);
  }

  if (javaVersion > JAVA_NEXT_SUPPORTED) {
    warnings.push(`Java ${javaVersion} has not been extensively tested with Lumen. Proceed with caution.`);
  }

  // Forge has historically been sensitive
  if (loaderType === 'forge' && javaVersion > 21) {
    warnings.push('Forge may have limited compatibility with JDK 25+. JDK 21 is recommended for Forge.');
  }

  return {
    isCompatible: errors.length === 0,
    warnings,
    errors,
    minRequired: JAVA_MIN_BASELINE,
    maxRecommended: JAVA_RECOMMENDED,
  };
}

/** Parse Java version string (e.g., "21.0.1", "1.8.0_402") */
export function parseJavaVersion(versionString: string): { major: number; full: string; vendor: string } {
  const cleaned = versionString.trim().replace(/^"|"$/g, '');

  // Handle "1.8.x" style versions
  const oldStyle = cleaned.match(/^1\.(\d+)\.(\d+)(?:_(\d+))?/);
  if (oldStyle) {
    return { major: parseInt(oldStyle[1], 10), full: cleaned, vendor: 'Unknown' };
  }

  // Handle "21.x.x" style versions
  const newStyle = cleaned.match(/^(\d+)(?:\.(\d+)(?:\.(\d+))?)?/);
  if (newStyle) {
    return { major: parseInt(newStyle[1], 10), full: cleaned, vendor: 'Unknown' };
  }

  return { major: 0, full: cleaned, vendor: 'Unknown' };
}

/** Detect Java vendor from version string */
export function detectJavaVendor(versionOutput: string): string {
  for (const [key, name] of Object.entries(KNOWN_VENDORS)) {
    if (versionOutput.toLowerCase().includes(key.toLowerCase())) {
      return name;
    }
  }
  return 'Unknown Vendor';
}

/** Create a JavaRuntime entry from detection data */
export function createJavaRuntime(
  path: string,
  versionOutput: string
): JavaRuntime {
  const { major, full } = parseJavaVersion(versionOutput);
  const vendor = detectJavaVendor(versionOutput);
  const now = new Date().toISOString();

  return {
    id: uid(),
    path,
    version: full,
    vendor,
    majorVersion: major,
    isManaged: false,
    isCompatible: major >= JAVA_MIN_BASELINE,
    compatibilityWarnings: major > JAVA_RECOMMENDED
      ? [`Java ${major} is newer than the recommended JDK ${JAVA_RECOMMENDED}`]
      : [],
    detectedAt: now,
    validatedAt: now,
  };
}

/** Get recommended JDK version */
export function getRecommendedJava(): number {
  return JAVA_RECOMMENDED;
}

/** Validate a custom Java path format */
export function isValidJavaPath(path: string): boolean {
  // Basic path validation — platform-specific checks happen at runtime
  return path.length > 0 && !path.includes('\0');
}

/** Get list of common Java search paths per OS */
export function getDefaultJavaSearchPaths(os: string): string[] {
  if (os === 'windows') {
    return [
      'C:\\Program Files\\Java',
      'C:\\Program Files\\Eclipse Adoptium',
      'C:\\Program Files\\Microsoft',
      'C:\\Program Files\\Azul',
      '%JAVA_HOME%\\bin',
    ];
  }
  if (os === 'macos') {
    return [
      '/Library/Java/JavaVirtualMachines',
      '/usr/lib/jvm',
      '~/.sdkman/candidates/java',
    ];
  }
  // Linux
  return [
    '/usr/lib/jvm',
    '/usr/local/lib/jvm',
    '~/.sdkman/candidates/java',
  ];
}
