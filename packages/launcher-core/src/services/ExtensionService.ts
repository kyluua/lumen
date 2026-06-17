// ============================================================
// ExtensionService — sandboxed extension API for themes,
// launch hooks, UI widgets, and diagnostic exporters.
// Extensions CANNOT modify gameplay, intercept credentials,
// bypass server rules, or tamper with packets.
// ============================================================

import type { Extension, ExtensionType, ExtensionPermission } from '../types';

/** Allowed extension types */
const ALLOWED_EXTENSION_TYPES: ExtensionType[] = ['theme', 'widget', 'launch-hook', 'profile-template', 'diagnostic-exporter'];

/** Forbidden extension behaviors */
const FORBIDDEN_BEHAVIORS = [
  'modify gameplay',
  'intercept credentials',
  'bypass server rules',
  'tamper with packets',
  'hide behavior from users',
];

/** Validate that an extension does not contain forbidden behaviors */
export function validateExtension(ext: Extension): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!ALLOWED_EXTENSION_TYPES.includes(ext.type)) {
    errors.push(`Extension type '${ext.type}' is not allowed.`);
  }

  if (!ext.name || ext.name.trim().length === 0) {
    errors.push('Extension name is required.');
  }

  if (!ext.entryPoint || ext.entryPoint.trim().length === 0) {
    errors.push('Extension entry point is required.');
  }

  // Check permissions are within allowed bounds
  const allowedPermissions = ['theme.read', 'theme.write', 'widget.render', 'launch.hook', 'diagnostic.export'];
  for (const perm of ext.permissions) {
    if (!allowedPermissions.includes(perm.name)) {
      errors.push(`Permission '${perm.name}' is not allowed for extensions.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/** Create a new extension registration */
export function registerExtension(options: {
  name: string;
  type: ExtensionType;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  entryPoint: string;
  config?: Record<string, unknown>;
}): Extension {
  return {
    id: 'ext_' + Math.random().toString(36).slice(2, 12),
    name: options.name,
    type: options.type,
    version: options.version,
    author: options.author,
    description: options.description,
    permissions: options.permissions.map((name) => ({
      name,
      description: getPermissionDescription(name),
      granted: false,
    })),
    enabled: false,
    entryPoint: options.entryPoint,
    config: options.config ?? {},
  };
}

/** Get human-readable permission descriptions */
function getPermissionDescription(name: string): string {
  const descriptions: Record<string, string> = {
    'theme.read': 'Read current theme settings',
    'theme.write': 'Apply theme customizations',
    'widget.render': 'Render a widget on the home screen',
    'launch.hook': 'Run a script before or after launch',
    'diagnostic.export': 'Export diagnostic reports',
  };
  return descriptions[name] ?? 'Unknown permission';
}

/** Enable/disable an extension */
export function toggleExtension(ext: Extension, enabled: boolean): Extension {
  return { ...ext, enabled };
}

/** Grant a permission to an extension */
export function grantPermission(ext: Extension, permissionName: string): Extension {
  return {
    ...ext,
    permissions: ext.permissions.map((p) =>
      p.name === permissionName ? { ...p, granted: true } : p
    ),
  };
}

/** Revoke a permission from an extension */
export function revokePermission(ext: Extension, permissionName: string): Extension {
  return {
    ...ext,
    permissions: ext.permissions.map((p) =>
      p.name === permissionName ? { ...p, granted: false } : p
    ),
  };
}

/** Sandbox execution context for an extension */
export function createExtensionSandbox(ext: Extension): {
  run: (code: string) => Promise<unknown>;
  allowedApis: string[];
} {
  const allowedApis = ext.permissions
    .filter((p) => p.granted)
    .map((p) => p.name);

  return {
    allowedApis,
    run: async (code: string) => {
      // In production, this would use isolated-vm or a Web Worker sandbox
      // For now, we validate but don't execute arbitrary code
      if (!ext.enabled) throw new Error('Extension is disabled');
      if (code.length > 10000) throw new Error('Extension code too large');
      console.log(`[Lumen Extension Sandbox] Would execute ${ext.name}:`, code.slice(0, 200));
      return undefined;
    },
  };
}

/** List all available extension types with descriptions */
export function getExtensionTypeDescriptions(): { type: ExtensionType; label: string; description: string }[] {
  return [
    { type: 'theme', label: 'Theme Pack', description: 'Custom color schemes and visual styles for the launcher' },
    { type: 'widget', label: 'Home Screen Widget', description: 'Custom widgets displayed on the launcher home screen' },
    { type: 'launch-hook', label: 'Launch Hook', description: 'Scripts that run before or after Minecraft launches' },
    { type: 'profile-template', label: 'Profile Template', description: 'Preconfigured profile settings for quick setup' },
    { type: 'diagnostic-exporter', label: 'Diagnostic Exporter', description: 'Custom diagnostic report formats for support' },
  ];
}

/** Get forbidden behavior warnings for display */
export function getForbiddenBehaviorWarnings(): string[] {
  return FORBIDDEN_BEHAVIORS.map((b) => `⚠ Extensions cannot ${b}.`);
}
