// ============================================================
// Lumen Launcher Core — Type System
// All domain types for profiles, Java runtimes, loaders,
// Minecraft manifests, asset management, launch configuration,
// extensions, themes, and diagnostics.
// ============================================================

// ----- Profile Management -----

export type LoaderType = 'vanilla' | 'fabric' | 'forge' | 'neoforge';

export type ProfileState = 'ready' | 'installing' | 'repairing' | 'error' | 'launching' | 'running';

export type ReleaseChannel = 'stable' | 'beta' | 'nightly' | '26.1.x' | '26.2.x';

export interface Profile {
  id: string;
  name: string;
  minecraftVersion: string;
  loaderType: LoaderType;
  loaderVersion?: string;
  releaseChannel: ReleaseChannel;
  gameDirectory: string;
  javaRuntime: JavaRuntimeRef;
  memory: MemorySettings;
  resolution: ResolutionSettings;
  launchArgs: string[];
  state: ProfileState;
  icon?: string;
  lastLaunched?: string;
  createdAt: string;
  updatedAt: string;
  favorite: boolean;
  bundledMods: string[];
  bundledResourcePacks: string[];
}

export interface ProfileTemplate {
  id: string;
  name: string;
  description: string;
  minecraftVersion: string;
  loaderType: LoaderType;
  loaderVersion?: string;
  memory: MemorySettings;
  resolution: ResolutionSettings;
  launchArgs: string[];
}

export interface JavaRuntimeRef {
  path: string;
  version: string;
  vendor: string;
  majorVersion: number;
}

export interface MemorySettings {
  min: number; // MB
  max: number; // MB
}

export interface ResolutionSettings {
  width: number;
  height: number;
  fullscreen: boolean;
}

// ----- Java Runtime Management -----

export interface JavaRuntime {
  id: string;
  path: string;
  version: string;
  vendor: string;
  majorVersion: number;
  isManaged: boolean;
  isCompatible: boolean;
  compatibilityWarnings: string[];
  detectedAt: string;
  validatedAt?: string;
}

export interface JavaCompatibilityCheck {
  isCompatible: boolean;
  warnings: string[];
  errors: string[];
  minRequired: number;
  maxRecommended: number;
}

export const JAVA_MIN_BASELINE = 21;
export const JAVA_RECOMMENDED = 21;
export const JAVA_NEXT_SUPPORTED = 25;

// ----- Loaders -----

export interface LoaderInstallConfig {
  loaderType: LoaderType;
  minecraftVersion: string;
  loaderVersion?: string;
  gameDirectory: string;
  javaPath: string;
}

export interface LoaderVersion {
  version: string;
  stable: boolean;
  minecraftVersions: string[];
  releaseDate?: string;
}

export interface FabricLoaderInfo {
  separator: string;
  build: number;
  maven: string;
  version: string;
  stable: boolean;
}

export interface ForgeVersionInfo {
  version: string;
  mcVersion: string;
  type: 'latest' | 'recommended';
  installerUrl?: string;
}

export interface NeoForgeVersionInfo {
  version: string;
  mcVersion: string;
  installerUrl?: string;
}

// ----- Minecraft Manifest -----

export interface MinecraftVersionManifest {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: MinecraftVersionEntry[];
}

export interface MinecraftVersionEntry {
  id: string;
  type: 'release' | 'snapshot' | 'old_beta' | 'old_alpha';
  url: string;
  time: string;
  releaseTime: string;
  sha1: string;
  complianceLevel: number;
}

export interface MinecraftVersionDetail {
  id: string;
  type: string;
  mainClass: string;
  minecraftArguments?: string;
  arguments: {
    game: (string | GameArgumentRule)[];
    jvm: (string | JvmArgumentRule)[];
  };
  assetIndex: {
    id: string;
    sha1: string;
    size: number;
    totalSize: number;
    url: string;
  };
  assets: string;
  downloads: {
    client: DownloadEntry;
    client_mappings?: DownloadEntry;
    server?: DownloadEntry;
    server_mappings?: DownloadEntry;
  };
  libraries: Library[];
  logging: {
    client: {
      argument: string;
      file: DownloadEntry;
      type: string;
    };
  };
  javaVersion: {
    component: string;
    majorVersion: number;
  };
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
}

export interface GameArgumentRule {
  rules: Rule[];
  value: string | string[];
}

export interface JvmArgumentRule {
  rules: Rule[];
  value: string | string[];
}

export interface Rule {
  action: 'allow' | 'disallow';
  os?: {
    name?: string;
    version?: string;
    arch?: string;
  };
  features?: Record<string, boolean>;
}

export interface DownloadEntry {
  sha1: string;
  size: number;
  url: string;
  path?: string;
  totalSize?: number;
}

export interface Library {
  name: string;
  url?: string;
  downloads: {
    artifact?: LibraryArtifact;
    classifiers?: Record<string, LibraryArtifact>;
  };
  rules?: Rule[];
  natives?: Record<string, string>;
  extract?: {
    exclude: string[];
  };
}

export interface LibraryArtifact {
  path: string;
  sha1: string;
  size: number;
  url: string;
}

export interface AssetIndex {
  objects: Record<string, AssetObject>;
}

export interface AssetObject {
  hash: string;
  size: number;
}

// ----- Download Management -----

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'failed' | 'retrying';

export interface DownloadState {
  id: string;
  url: string;
  destination: string;
  sha1?: string;
  size: number;
  downloaded: number;
  status: DownloadStatus;
  retries: number;
  maxRetries: number;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface DownloadProgress {
  overall: number; // 0-1
  currentFile: string;
  speed: number; // bytes/sec
  remaining: number; // seconds estimate
  queued: number;
  completed: number;
  failed: number;
}

// ----- Launch Management -----

export interface LaunchConfig {
  profile: Profile;
  javaRuntime: JavaRuntime;
  minecraftVersion: MinecraftVersionDetail;
  libraries: string[];
  nativesDir: string;
  assetIndex: string;
  gameDir: string;
  classpath: string[];
  jvmArgs: string[];
  gameArgs: string[];
  mainClass: string;
  auth: AuthCredentials;
}

export interface AuthCredentials {
  accessToken: string;
  username: string;
  uuid: string;
  xuid?: string;
  userType: 'msa' | 'mojang';
  expiresAt: number;
}

export interface LaunchHistory {
  id: string;
  profileId: string;
  launchedAt: string;
  closedAt?: string;
  duration?: number;
  exitCode?: number;
  crashDetected: boolean;
}

// ----- Crash Reports -----

export interface CrashReport {
  id: string;
  profileId: string;
  launchedAt: string;
  minecraftVersion: string;
  loaderType: LoaderType;
  crashFile: string;
  crashMessage: string;
  stackTrace: string;
  relevantMods: string[];
  resolved: boolean;
  createdAt: string;
}

// ----- Extensions -----

export type ExtensionType = 'theme' | 'widget' | 'launch-hook' | 'profile-template' | 'diagnostic-exporter';

export interface Extension {
  id: string;
  name: string;
  type: ExtensionType;
  version: string;
  author: string;
  description: string;
  permissions: ExtensionPermission[];
  enabled: boolean;
  entryPoint: string;
  config?: Record<string, unknown>;
}

export interface ExtensionPermission {
  name: string;
  description: string;
  granted: boolean;
}

// ----- Theme & Appearance -----

export type ThemeMode = 'light' | 'dark' | 'system';

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export type GalaxyTheme = 'galaxy' | 'heaven' | 'nebula' | 'cosmic';

export interface AppearanceConfig {
  themeMode: ThemeMode;
  accentColor: string;
  density: DensityMode;
  fontFamily: string;
  fontSize: number;
  fontSizeScale: number;
  reducedMotion: boolean;
  backgroundImage?: string;
  backgroundOpacity: number;
  galaxyTheme: GalaxyTheme;
  customEffects: CustomEffectsConfig;
  sidebarIconsOnly: boolean;
  showNewsFeed: boolean;
}

export interface CustomEffectsConfig {
  lightning: boolean;
  wind: boolean;
  rain: boolean;
  splashes: boolean;
  explosions: boolean;
  particleDensity: 'low' | 'medium' | 'high';
  effectsSpeed: number; // 0.5-2.0
}

// ----- Settings -----

export interface LumenSettings {
  version: string; // schema version for migrations
  appearance: AppearanceConfig;
  java: {
    runtimes: JavaRuntime[];
    defaultRuntimePath?: string;
    autoDetect: boolean;
    managedRuntimeEnabled: boolean;
  };
  profiles: Record<string, Profile>;
  profileBundles: ProfileBundle[];
  extensions: Extension[];
  modsAndPacks: ModsAndPacksConfig;
  accounts: AccountConfig;
  updates: UpdateConfig;
  privacy: PrivacyConfig;
  apiKeys: ApiKeyConfig;
  installedAt: string;
  firstRunCompleted: boolean;
  onboardingCompleted: boolean;
}

export interface ProfileBundle {
  id: string;
  name: string;
  minecraftVersion: string;
  profiles: string[]; // profile IDs
  mods: string[];
  resourcePacks: string[];
  createdAt: string;
}

export interface ModsAndPacksConfig {
  modrinthApiKey?: string;
  curseForgeApiKey?: string;
  defaultBrowser: 'modrinth' | 'curseforge';
  localModsFolders: Record<string, string>; // profileId -> folder path
  localResourcePacksFolders: Record<string, string>;
  maxProfilesPerVersion: number; // default: 5
}

export interface AccountConfig {
  accounts: StoredAccount[];
  activeAccountId?: string;
  autoLogin: boolean;
}

export interface StoredAccount {
  id: string;
  username: string;
  uuid: string;
  userType: 'msa' | 'mojang';
  addedAt: string;
}

export interface UpdateConfig {
  channel: ReleaseChannel;
  autoDownload: boolean;
  notifyOnUpdate: boolean;
  lastChecked?: string;
  skippedVersion?: string;
}

export interface PrivacyConfig {
  telemetryEnabled: boolean;
  crashReportsEnabled: boolean;
  usageAnalyticsEnabled: boolean;
  networkLogging: boolean;
  remoteResourceLoading: boolean;
}

export interface ApiKeyConfig {
  curseForgeApiKey?: string;
  modrinthApiKey?: string;
}

// ----- Updates -----

export interface AppUpdate {
  version: string;
  channel: ReleaseChannel;
  releaseDate: string;
  changelog: string[];
  downloadUrl: string;
  checksum: string;
  required: boolean;
  size: number;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: ChangelogItem[];
}

export interface ChangelogItem {
  type: 'feature' | 'fix' | 'improvement' | 'breaking' | 'security';
  description: string;
}

// ----- Skin Management -----

export interface SkinInfo {
  username: string;
  uuid: string;
  skinUrl: string;
  capeUrl?: string;
  model: 'classic' | 'slim';
  timestamp: string;
}

export interface SkinExport {
  format: 'png';
  width: number;
  height: number;
  data: Uint8Array;
  model: 'classic' | 'slim';
}

// ----- Mod & Resource Pack Browsing -----

export interface ModrinthProject {
  project_id: string;
  title: string;
  description: string;
  categories: string[];
  downloads: number;
  icon_url?: string;
  slug: string;
  versions: string[];
  latest_version?: string;
}

export interface CurseForgeProject {
  id: number;
  name: string;
  summary: string;
  categories: { name: string }[];
  downloadCount: number;
  logo?: { url: string };
  slug: string;
  latestFiles: { fileName: string }[];
}

export interface ModOrPackEntry {
  id: string;
  source: 'modrinth' | 'curseforge';
  name: string;
  description: string;
  icon?: string;
  downloads: number;
  version: string;
  type: 'mod' | 'resourcepack';
}

// ----- Onboarding -----

export interface OnboardingData {
  hardwareInfo: HardwareInfo;
  howHeard: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLoader: LoaderType;
  setupComplete: boolean;
}

export interface HardwareInfo {
  osName: string;
  osVersion: string;
  cpuCores: number;
  cpuModel: string;
  totalRamMB: number;
  gpuModel: string;
  freeDiskGB: number;
}

// ----- Diagnostic -----

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  lumenVersion: string;
  os: string;
  javaRuntimes: string[];
  profiles: string[];
  recentCrashes: string[];
  logBuffer: string;
  settingsSnapshot: Partial<LumenSettings>;
}

// ----- GitHub/Discord -----

export interface SocialLinks {
  github: string;
  discord: string;
  website: string;
}