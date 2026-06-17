# Lumen Release Checklist

Use this checklist for every production release of Lumen.

## Pre-Release

- [ ] All supported profile types launch successfully (Vanilla, Fabric, Forge, NeoForge)
- [ ] Java validation works for JDK 21 and JDK 25
- [ ] Java compatibility warnings appear for mismatched JDK versions
- [ ] Installer works on each target OS (Windows 10/11, macOS, Linux)
- [ ] App updates are signed and verified
- [ ] Download checksum validation is tested
- [ ] Logs and crash reports are human-readable
- [ ] Rollback works after a failed update
- [ ] Accessibility pass completed (keyboard nav, focus states, contrast)
- [ ] No unlicensed assets included
- [ ] All custom effects toggle correctly (lightning, wind, rain, splashes, explosions)
- [ ] Click GUI opens with Right-Shift and all mods toggle correctly
- [ ] Skin viewer loads and rotates correctly (360°)
- [ ] Mod browser API keys are validated
- [ ] Profile import/export works correctly
- [ ] Profile repair function restores profiles to working state
- [ ] README is up to date with current version
- [ ] Changelog is complete and accurate
- [ ] All network endpoints documented

## Build

```bash
npm run build
npm run package
```

## Post-Release

- [ ] Tag release in Git
- [ ] Upload installers to release page
- [ ] Update website/changelog
- [ ] Announce on Discord
- [ ] Monitor crash reports for 48 hours