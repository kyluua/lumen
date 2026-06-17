# Lumen Security Policy

## Principles

Lumen is built with a security-first mindset. All features are designed to be transparent, safe, and respectful of user privacy.

## Authentication

- Uses official Microsoft OAuth2 flow for Minecraft account authentication
- No credentials are stored in plaintext
- Access tokens are stored only in OS-backed secure storage (Keychain on macOS, Credential Manager on Windows, libsecret on Linux)
- No account passwords are ever collected or stored

## Network Security

- All network requests are documented and explicit
- No hidden telemetry or background data collection
- CSP (Content Security Policy) enforced in the webview
- Only connects to official Mojang, Fabric, Forge, NeoForge, CurseForge, and Modrinth APIs
- HTTPS enforced for all network communication

## Extension Security

- Extensions run in a sandboxed environment
- Extensions CANNOT: modify gameplay, intercept credentials, bypass server rules, tamper with packets, or hide behavior from users
- All extension permissions must be explicitly granted by the user
- Each extension is validated before activation

## Asset Integrity

- All assets are custom-made original works or clearly licensed open-source assets
- Downloaded artifacts are verified with checksums (SHA-1, SHA-256) where available
- No unlicensed or suspicious third-party assets are bundled

## Data Privacy

- No telemetry by default
- User-controlled diagnostic export
- Local-first data storage (JSON/TOML configs in app data directory)
- No cloud-synced profiles or settings without explicit user action

## Reporting Vulnerabilities

Report security issues privately to the maintainers. Do not open public issues for security vulnerabilities.

## Supported Versions

| Version | Supported |
| --- | --- |
| 1.0.x (stable) | ✅ Full support |
| Beta | ⚠️ Best effort |
| Nightly | ❌ No security guarantees |