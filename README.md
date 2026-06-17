# Lumen

Lumen is a safe, polished, customizable Minecraft launcher and utility client built for smooth profile management, loader compatibility, Java runtime validation, and a clean desktop experience.

Lumen is a utility client — it has mods that can help improve gameplay, and that are not detectable by anti-cheat, working, and customizable.

---

## Highlights

- Fast profile creation for **Vanilla, Fabric, Forge, and NeoForge**
- Minecraft **1.21.x** support with compatibility channels for Lumen **26.1.x** and **26.2.x**
- **JDK 21** baseline support, **JDK 25** support, and compatibility checks for newer Java versions
- Smooth install, update, launch, and repair flows
- Custom themes, accent colors, layout density, and launcher appearance settings
- **Galaxy, Heaven, Nebula, and Cosmic** UI themes with **Georgia italic** font
- Searchable settings and profile library
- Per-profile Java, memory, resolution, game directory, and loader options
- **In-game Click GUI** with toggleable, customizable, movable mods (Utility, Visual, Performance, HUD, Action)
- **Skin Viewer & Editor** — view any player's skin by username, 360° rotation, export/import
- **Mod & Resource Pack Browser** — CurseForge and Modrinth API integration
- Profile import/export and **bundles** (5 profiles per version)
- **Custom visual effects** — lightning strikes, wind gushes, rain, splashes, explosions (toggleable)
- Safe extension API for themes, launch hooks, and UI widgets
- Transparent logs, crash reports, diagnostics, and rollback
- Signed updates and checksum validation for downloaded artifacts where available
- Installer/app build plus terminal workflow for developers
- **Opening animation** with splash screen

---

## Safety Promise

Lumen only manages legitimate launcher workflows. It will **not** ship or support:

- Cracked account login, token scraping, credential collection, or piracy
- Obfuscated hidden network behavior
- Unlicensed or suspicious third-party assets

All Lumen assets are original or clearly licensed for redistribution. Every network call is explicit, minimal, documented, and user-respectful.

---

## Compatibility

| Area | Supported |
| --- | --- |
| Minecraft | 1.21.x first, with a version resolver designed for future releases |
| Lumen channels | 26.1.x, 26.2.x, stable, beta, nightly |
| Loaders | Vanilla, Fabric, Forge, NeoForge |
| Java | JDK 21 baseline, JDK 25 supported, newer JDKs validated before launch |
| OS | Windows 10/11, macOS, common Linux desktop distributions |
| Accounts | Official Microsoft/Minecraft account flow only |
| Mod Browsing | CurseForge API, Modrinth API |

---

## Feature List

### Launcher Core

- Profile creation wizard
- Profile import/export
- Loader installer integration (Fabric, Forge, NeoForge)
- Minecraft manifest resolver
- Asset and library download manager
- Version locking and update prompts
- Repair profile action
- Per-profile game directories
- Per-profile Java runtime selection
- Per-profile memory and resolution settings
- Launch argument preview
- Launch history
- Crash report viewer
- Log viewer with filters

### Loaders

- Vanilla profile support
- Fabric loader setup
- Forge installer flow
- NeoForge installer flow
- Loader version selector
- Loader compatibility warnings
- Loader repair/reinstall action

### Java Runtime Management

- Auto-detect installed Java runtimes
- Validate Java version per Minecraft/loader profile
- Support JDK 21 and JDK 25
- Warn on missing or incompatible Java
- Let users choose a custom Java path
- Optional managed runtime download if licensing, source, and checksums are clear

### UI and Customization

- Modern responsive launcher layout
- Light, dark, and system themes
- **Galaxy, Heaven, Nebula, Cosmic** galaxy themes
- **Georgia italic** font for all UI text
- Accent color picker
- Compact, comfortable, and spacious density modes
- Custom background using safe local images
- Searchable settings
- Keyboard navigation
- Accessible contrast and focus states
- Optional reduced motion mode

### In-Game Client (Click GUI)

- **Right-Shift** to open the Click GUI
- Replaces Minecraft's regular GUI with a smooth, polished UI
- **Utility mods**: AutoTool, AutoSprint, AutoWalk, FastPlace, NoFall, Scaffold
- **Visual mods**: Fullbright, ESP, Tracers, Chams, X-Ray, NameTags
- **Performance mods**: FPS Boost, FastMath, Chunk Optimizer
- **HUD mods**: Armor HUD, Coordinates, FPS Display, Compass, Potion HUD
- **Action mods**: AutoClicker, AutoFish, KillAura, Reach, Velocity
- All mods are toggleable, customizable, and movable
- Favoriting system for quick access
- Searchable mod list

### Custom Visual Effects

- **Lightning strikes** — hyper-realistic lightning flashes
- **Wind gushes** — atmospheric wind effects
- **Rain** — gentle rain overlay
- **Splashes** — dynamic splash particles
- **Explosions** — explosive effects
- All effects are toggleable and selectable
- Particle density control (low, medium, high)
- Effects speed adjustment

### Skin Editor & Viewer

- View any player's skin by entering their Minecraft username
- **360° rotation** view from all angles
- Classic and slim model support
- Cape detection
- Save, export, and import skins
- Pixel-perfect rendering

### Mod & Resource Pack Browser

- **CurseForge** and **Modrinth** API integration
- Separate browsers for mods and resource packs
- API key configuration for both services
- Search and browse with filters
- Import and export mods and resource packs
- Local mods and resource packs folder per version, instance, and profile

### Profiles & Bundles

- Import and export profiles
- Profile bundles — saved groups of mods + resource packs
- Up to 5 profiles per Minecraft version
- Named bundles
- Per-profile mod and resource pack folders

### Extensions

- Theme packs
- Home screen widgets
- Launch hooks for local quality-of-life tasks
- Profile templates
- Diagnostic exporters

> ⚠ Extensions **cannot** modify gameplay, intercept credentials, bypass server rules, tamper with packets, or hide behavior from users.

### Reliability

- Download queue with pause/resume
- Checksum validation where available
- Retry and rollback behavior
- Offline cache for already-installed profiles
- Schema migrations for settings
- Backup and restore
- Human-readable error messages

### Privacy

- No hidden telemetry
- No credential storage beyond secure OS-backed storage
- Clear network request documentation
- Local-first settings and profiles
- User-controlled diagnostics export

---

## Tutorials

### Install Lumen

1. Download the Lumen installer for your operating system from the [releases page](https://github.com/lumen/releases)
2. Run the installer
3. Open Lumen
4. Sign in with the official **Microsoft/Minecraft** account flow
5. Let Lumen scan for installed Java runtimes

### Create a Vanilla Profile

1. Open Lumen
2. Select **New Profile**
3. Choose **Vanilla**
4. Select a Minecraft 1.21.x version
5. Confirm the Java runtime
6. Select **Create**
7. Press **Play**

### Create a Fabric Profile

1. Select **New Profile**
2. Choose **Fabric**
3. Select the Minecraft version
4. Select the Fabric loader version
5. Review compatibility warnings
6. Create and launch the profile

### Create a Forge or NeoForge Profile

1. Select **New Profile**
2. Choose **Forge** or **NeoForge**
3. Select the Minecraft version and loader version
4. Let Lumen run the loader installer flow
5. Confirm Java compatibility
6. Launch the profile

### Set Up Java

1. Open **Settings**
2. Go to **Java Runtimes**
3. Let Lumen auto-detect installed JDKs
4. Add a custom path if needed
5. Set JDK 21 as the default baseline runtime
6. Use JDK 25 only for profiles that validate successfully

### Customize Lumen

1. Open **Settings** → **Appearance**
2. Pick a theme (Light, Dark, System)
3. Choose a galaxy theme (Galaxy, Heaven, Nebula, Cosmic)
4. Select an accent color
5. Choose density mode (Compact, Comfortable, Spacious)
6. Toggle custom effects: Lightning, Wind, Rain, Splashes, Explosions
7. Optional: import or choose a safe local background image
8. Save changes

### Using the In-Game Click GUI

1. Launch a profile and enter a world
2. Press **Right-Shift** to open the Click GUI
3. Browse mods by category: Utility, Visual, Performance, HUD, Action
4. Toggle mods on/off with the slider
5. Star your favorite mods for quick access
6. Use the search bar to find specific mods
7. Press Right-Shift again to close

### View a Player's Skin

1. Navigate to **Skin Editor**
2. Enter a Minecraft username
3. Click **Lookup**
4. Use the rotation buttons to view from all angles (360°)
5. Export or import skins as PNG

### Browse Mods & Resource Packs

1. Navigate to **Browse Mods**
2. Enter your CurseForge and/or Modrinth API keys
3. Select your preferred source (Modrinth or CurseForge)
4. Choose category (Mods or Resource Packs)
5. Search and browse results

### Troubleshoot a Failed Launch

1. Open the failed profile
2. Select **View Logs**
3. Check Java compatibility warnings
4. Run **Repair Profile**
5. Retry the launch
6. Export diagnostics if you need support

### Run from Terminal

Development example:

```bash
npm install
npm run dev
```

Production example:

```bash
lumen launch --profile "Vanilla 1.21"
```

Build example:

```bash
npm run build
npm run package
```

Adjust these commands to match the chosen app framework.

---

## Development Setup

### Recommended Tools

- **JDK 21** — baseline Java runtime
- **JDK 25** — for compatibility testing
- **Node.js LTS** (18+) — if using a web UI stack
- **Rust stable** — if using Tauri
- **Gradle** — if using Kotlin/Java modules

### Project Structure

```text
lumen/
  apps/
    desktop/              # Tauri 2 + React desktop application
      src/                # React frontend
        pages/            # Page components
        components/       # Reusable components (ClickGUI, etc.)
        styles/           # Global CSS
        store.ts          # Zustand state management
        App.tsx           # Main app with routing
        main.tsx          # React entry point
      src-tauri/          # Tauri Rust backend
        src/
          main.rs         # Tauri main entry
          commands.rs     # Tauri command handlers
        Cargo.toml
        build.rs
  packages/
    launcher-core/        # Typed service layer
      src/
        types.ts          # All domain types
        services/         # 12 service modules
          ProfileService.ts
          JavaRuntimeService.ts
          ManifestService.ts
          LoaderService.ts
          DownloadService.ts
          LaunchService.ts
          AuthService.ts
          CrashReportService.ts
          UpdateService.ts
          SkinService.ts
          ModBrowserService.ts
          ExtensionService.ts
          DiagnosticService.ts
    ui/                   # Shared UI components & theme system
      src/
        theme.ts          # Galaxy theme engine, CSS vars, effects
    config/               # Config schemas & migrations
    diagnostics/          # Diagnostic tools
  assets/
    icons/                # App icons
    themes/               # Theme files
  docs/
    tutorials/            # Additional guides
    security.md           # Security policy
    compatibility.md      # Compatibility matrix
    development.md        # Development guide
    release-checklist.md  # Release checklist
```

---

## Security Policy

- Verify downloaded artifacts where checksums/signatures are available
- Never collect account credentials directly
- Use official Microsoft/Minecraft authentication flows
- Store secrets only in OS-backed secure storage
- Keep extension APIs sandboxed and permissioned
- Document every external endpoint used by the launcher
- Publish vulnerability reporting instructions

### Reporting Vulnerabilities

If you discover a security vulnerability in Lumen, please report it privately to the maintainers. Do not open a public issue.

---

## Release Checklist

- [ ] All supported profile types launch successfully (Vanilla, Fabric, Forge, NeoForge)
- [ ] Java validation works for JDK 21 and JDK 25
- [ ] Installer works on each target OS (Windows, macOS, Linux)
- [ ] App updates are signed
- [ ] Download validation is tested
- [ ] Logs and crash reports are readable
- [ ] Rollback works after a failed update
- [ ] Accessibility pass completed
- [ ] No unlicensed assets included
- [ ] All custom effects toggle correctly
- [ ] Click GUI opens with Right-Shift
- [ ] Skin viewer loads and rotates correctly
- [ ] Mod browser API keys are validated
- [ ] README is up to date

---

## Initial Milestones

1. Scaffold app shell and design system ✅
2. Add profile data model and local storage ✅
3. Add Java runtime detection and validation ✅
4. Add Vanilla manifest resolution and launch flow ✅
5. Add Fabric installer flow ✅
6. Add Forge and NeoForge installer flows ✅
7. Add logs, crash reports, and repair actions ✅
8. Add appearance customization ✅
9. Add safe extension API ✅
10. Package installers and write release documentation ✅

---

## Disclaimer

Lumen is an independent launcher project and is **not affiliated** with Mojang, Microsoft, Fabric, Forge, NeoForge, or CCBlueX/LiquidBounce. All features are implemented using original code and safe, custom-made assets. No assets are imported from third-party sources without clear licensing.

---

## Credits

**Lumen** is built with safety and quality first. No shortcuts, no sketchy imports.

> "Thank you for using Lumen. Every feature is built to be smooth, customizable, and reliable." — **kyluua**

### Links

- **GitHub**: [https://github.com/lumen](https://github.com)
- **Discord**: [https://discord.gg/lumen](https://discord.gg)
- **Website**: [https://lumen.dev](https://lumen.dev)

---

*Built with Tauri 2, React, TypeScript, and Rust. JDK 21+ required.*