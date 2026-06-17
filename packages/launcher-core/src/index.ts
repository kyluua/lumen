// ============================================================
// Lumen Launcher Core — Index
// Public API surface for the launcher-core package
// ============================================================

export * from './types';
export { createProfile, validateProfile, exportProfile, importProfile, createFromTemplate, createProfileBundle, canAddProfile, repairProfile } from './services/ProfileService';
export type { } from './services/ProfileService';
export { checkJavaCompatibility, parseJavaVersion, detectJavaVendor, createJavaRuntime, getRecommendedJava, isValidJavaPath, getDefaultJavaSearchPaths } from './services/JavaRuntimeService';
export { fetchVersionManifest, getVersionEntry, fetchVersionDetail, fetchAssetIndex, getAssetUrl, resolveLibraries, filterSupportedVersions, getLatestRelease } from './services/ManifestService';
export { fetchFabricLoaderVersions, fetchFabricGameVersions, getFabricInstallerUrl, buildFabricProfile, fetchForgeVersions, getForgeInstallerUrl, fetchNeoForgeVersions, getNeoForgeInstallerUrl, validateLoaderCompatibility, getRecommendedLoaderVersion, prepareLoaderInstall } from './services/LoaderService';
export { createDownloadQueue, addToQueue, removeFromQueue, pauseDownload, resumeDownload, getQueueProgress, validateChecksum, downloadFile, retryDownload } from './services/DownloadService';
export { buildLaunchConfig, buildLaunchCommand, validateLaunch, createLaunchHistory, completeLaunchHistory, getDefaultLaunchArgs } from './services/LaunchService';
export { getMicrosoftAuthUrl, exchangeCodeForToken, authenticateWithXbox, authenticateWithXSTS, authenticateWithMinecraft, getMinecraftProfile, checkGameOwnership, createAuthCredentials, isCredentialsExpired, createStoredAccount } from './services/AuthService';
export { parseCrashReport, getCrashSuggestions, resolveCrash, getCrashSummary } from './services/CrashReportService';
export { checkForUpdates, compareVersions, isNewerVersion, validateUpdateChecksum, createChangelogEntry, getChangelog, getReleaseChannels } from './services/UpdateService';
export { getUUIDFromUsername, getSkinByUUID, getSkinByUsername, downloadSkin, exportSkin, createSkinDownloadUrl, parseSkinFile, getSkinUVMapping, getSkinHistoryKey } from './services/SkinService';
export { searchModrinthMods, searchModrinthResourcePacks, getModrinthProject, searchCurseForgeMods, searchCurseForgeResourcePacks, getCurseForgeProject, modrinthToEntry, curseForgeToEntry, searchAll, isValidModrinthKey, isValidCurseForgeKey } from './services/ModBrowserService';
export { validateExtension, registerExtension, toggleExtension, grantPermission, revokePermission, createExtensionSandbox, getExtensionTypeDescriptions, getForbiddenBehaviorWarnings } from './services/ExtensionService';
export { collectHardwareInfo, createDiagnosticReport, exportDiagnosticReport, createDiagnosticDownloadUrl, LogBuffer, globalLogBuffer, quickSystemCheck } from './services/DiagnosticService';
import type { LumenSettings } from './types';

export const LUMEN_VERSION = '1.0.0';
export const LUMEN_CHANNEL = 'stable';

export const DEFAULT_SETTINGS: LumenSettings = {
  version: '1',
  appearance: {
    themeMode: 'system',
    accentColor: '#7c3aed',
    density: 'comfortable',
    fontFamily: 'Georgia, serif',
    fontSize: 14,
    fontSizeScale: 1.0,
    reducedMotion: false,
    backgroundOpacity: 0.95,
    galaxyTheme: 'galaxy',
    customEffects: {
      lightning: true,
      wind: true,
      rain: false,
      splashes: true,
      explosions: false,
      particleDensity: 'medium',
      effectsSpeed: 1.0,
    },
    sidebarIconsOnly: false,
    showNewsFeed: true,
  },
  java: {
    runtimes: [],
    autoDetect: true,
    managedRuntimeEnabled: false,
  },
  profiles: {},
  profileBundles: [],
  extensions: [],
  modsAndPacks: {
    defaultBrowser: 'modrinth',
    localModsFolders: {},
    localResourcePacksFolders: {},
    maxProfilesPerVersion: 5,
  },
  accounts: {
    accounts: [],
    autoLogin: false,
  },
  updates: {
    channel: 'stable',
    autoDownload: false,
    notifyOnUpdate: true,
  },
  privacy: {
    telemetryEnabled: false,
    crashReportsEnabled: true,
    usageAnalyticsEnabled: false,
    networkLogging: false,
    remoteResourceLoading: false,
  },
  apiKeys: {},
  installedAt: new Date().toISOString(),
  firstRunCompleted: false,
  onboardingCompleted: false,
};
