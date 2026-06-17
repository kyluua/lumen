// ============================================================
// LaunchService — builds launch arguments, resolves classpaths,
// manages launch history, and handles Minecraft process launch.
// ============================================================

import type {
  Profile,
  JavaRuntime,
  MinecraftVersionDetail,
  LaunchConfig,
  LaunchHistory,
  AuthCredentials,
} from '../types';
import { resolveLibraries } from './ManifestService';
import { checkJavaCompatibility } from './JavaRuntimeService';

let _settings: any = {};

export function injectSettings(getSettings: () => any) {
  _settings = getSettings;
}

/** Build the full launch configuration */
export function buildLaunchConfig(
  profile: Profile,
  javaRuntime: JavaRuntime,
  versionDetail: MinecraftVersionDetail,
  auth: AuthCredentials,
  osName: string,
  osArch: string
): LaunchConfig {
  const { libraries, natives } = resolveLibraries(versionDetail, osName, osArch);

  const classpath = [
    ...libraries,
    versionDetail.downloads.client.path ?? 'client.jar',
  ];

  const jvmArgs = buildJvmArgs(profile, javaRuntime, versionDetail, natives);
  const gameArgs = buildGameArgs(profile, versionDetail, auth);

  return {
    profile,
    javaRuntime,
    minecraftVersion: versionDetail,
    libraries,
    nativesDir: `${profile.gameDirectory}/natives`,
    assetIndex: versionDetail.assetIndex.id,
    gameDir: profile.gameDirectory,
    classpath,
    jvmArgs,
    gameArgs,
    mainClass: versionDetail.mainClass,
    auth,
  };
}

/** Build JVM arguments */
function buildJvmArgs(
  profile: Profile,
  javaRuntime: JavaRuntime,
  versionDetail: MinecraftVersionDetail,
  nativesDir: string[]
): string[] {
  const args: string[] = [];

  // Memory
  args.push(`-Xms${profile.memory.min}M`);
  args.push(`-Xmx${profile.memory.max}M`);

  // Natives
  args.push(`-Djava.library.path=${nativesDir.join(';')}`);

  // Version-specific JVM args from manifest
  if (versionDetail.arguments?.jvm) {
    for (const arg of versionDetail.arguments.jvm) {
      if (typeof arg === 'string') {
        args.push(arg);
      } else if (arg.rules) {
        // Skip rules-based args for now; apply generic ones
        if (arg.value && typeof arg.value === 'string') {
          args.push(arg.value);
        } else if (Array.isArray(arg.value)) {
          args.push(...arg.value);
        }
      }
    }
  }

  // Custom launch args from profile
  args.push(...profile.launchArgs);

  return args;
}

/** Build game arguments */
function buildGameArgs(
  profile: Profile,
  versionDetail: MinecraftVersionDetail,
  auth: AuthCredentials
): string[] {
  const args: string[] = [];

  // Auth
  args.push('--username', auth.username);
  args.push('--uuid', auth.uuid);
  args.push('--accessToken', auth.accessToken);
  args.push('--userType', auth.userType);
  args.push('--version', versionDetail.id);
  args.push('--gameDir', profile.gameDirectory);
  args.push('--assetsDir', `${profile.gameDirectory}/assets`);
  args.push('--assetIndex', versionDetail.assetIndex.id);

  if (profile.resolution.fullscreen) {
    args.push('--fullscreen');
  } else {
    args.push('--width', String(profile.resolution.width));
    args.push('--height', String(profile.resolution.height));
  }

  return args;
}

/** Build the full launch command line */
export function buildLaunchCommand(config: LaunchConfig): string[] {
  const cmd: string[] = [config.javaRuntime.path];

  // JVM args
  cmd.push(...config.jvmArgs);

  // Classpath
  const cp = config.classpath.join(':');
  cmd.push('-cp', cp);

  // Main class
  cmd.push(config.mainClass);

  // Game args
  cmd.push(...config.gameArgs);

  return cmd;
}

/** Validate launch readiness */
export function validateLaunch(
  profile: Profile,
  javaRuntime: JavaRuntime
): { ready: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!profile.name) errors.push('Profile has no name.');
  if (!profile.minecraftVersion) errors.push('No Minecraft version selected.');
  if (!javaRuntime.path) errors.push('No Java runtime configured.');

  const compat = checkJavaCompatibility(
    javaRuntime.majorVersion,
    profile.minecraftVersion,
    profile.loaderType
  );
  errors.push(...compat.errors);
  warnings.push(...compat.warnings);

  if (profile.memory.min < 1024) warnings.push('Low minimum RAM (less than 1GB).');
  if (profile.memory.max < 2048) warnings.push('Low maximum RAM (less than 2GB).');

  return { ready: errors.length === 0, errors, warnings };
}

/** Create a launch history entry */
export function createLaunchHistory(
  profileId: string,
  launchedAt: string
): LaunchHistory {
  return {
    id: 'launch_' + Date.now().toString(36),
    profileId,
    launchedAt,
    crashDetected: false,
  };
}

/** Record a completed launch */
export function completeLaunchHistory(
  history: LaunchHistory,
  exitCode: number,
  crashDetected: boolean
): LaunchHistory {
  const closedAt = new Date().toISOString();
  const duration = new Date(closedAt).getTime() - new Date(history.launchedAt).getTime();
  return {
    ...history,
    closedAt,
    duration,
    exitCode,
    crashDetected,
  };
}

/** Get the default launch args for a profile */
export function getDefaultLaunchArgs(): string[] {
  return [];
}