# Lumen

Lumen is a safe, polished Minecraft launcher and client-management desktop app built with Java 21, JavaFX, and Gradle.

Lumen focuses on legitimate launcher qualities: smooth UX, multi-version profiles, official loader setup paths, Java runtime validation, transparent logs, rollback planning, customization, searchable settings, and safe extension policy. It does not include cheats, hacks, exploit modules, anti-cheat bypasses, unfair automation, X-ray, kill aura, scaffold, packet abuse, server bypass configs, account stealing, token scraping, obfuscation for evasion, piracy, cracked account flows, or malicious behavior.

## Supported Targets

- Minecraft 1.21.x
- Lumen runtime/release lines 26.1.x and 26.2.x
- Vanilla
- Fabric
- Forge
- NeoForge
- JDK 21 baseline
- JDK 25 supported runtime line

## Implementation Direction

Lumen uses Java + JavaFX + Gradle.

Tradeoff:
- JavaFX keeps the app in the Java ecosystem, close to Minecraft launch/runtime tooling.
- Gradle makes JavaFX dependencies, builds, distributions, and CI straightforward.
- JDK 21 is enough for development and baseline launch validation; JDK 25 is modeled as a supported runtime for newer Lumen compatibility lines.

## Run From Terminal

```cmd
cd C:\Users\kylev\lumen
.\gradlew.bat run
```

Build:

```cmd
.\gradlew.bat build
```

Create an installable app distribution:

```cmd
.\gradlew.bat installDist
```

Create a local desktop app image with `jpackage`:

```cmd
.\gradlew.bat lumenAppImage
```

## User Tutorial

### Create a Profile

1. Open the Profiles tab.
2. Choose Vanilla, Fabric, Forge, or NeoForge.
3. Choose Minecraft 1.21.x or Lumen 26.1.x/26.2.x compatibility line.
4. Choose JDK 21 or JDK 25.
5. Run Launch Check.

### Loader Setup

- Vanilla uses Mojang's official version manifest.
- Fabric uses official Fabric metadata and Fabric API where required.
- Forge uses official Forge installer metadata.
- NeoForge uses official NeoForge installer metadata.

### Java Setup

- JDK 21 is the baseline.
- JDK 25 is supported for 26.1.x and 26.2.x.
- Newer JDKs require compatibility warnings/checks.
- Older JDKs are blocked when selected profile requires a newer runtime.

### Customization

Use Settings to choose theme, density, accent color, and reduced motion.

### Troubleshooting

Use Logs to inspect validation stages, artifact plans, launch commands, and crash/rollback guidance.

## Safe Feature List

- Profile management
- Loader/API planning
- Java detection and validation
- Launch command planning
- Transparent logs
- Crash report summary model
- Rollback and backup design
- Theme customization
- Safe extension policy for themes, launch hooks, and UI widgets only
- Explicit network policy and checksum/signature hooks

## Documentation

- [Compatibility](docs/compatibility.md)
- [Security](docs/security.md)
- [Development](docs/development.md)
- [Release Checklist](docs/release-checklist.md)
- [Network Policy](docs/network.md)
