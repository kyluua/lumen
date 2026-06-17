# Lumen Development Setup

## Prerequisites

- **JDK 21** installed and `JAVA_HOME` set
- **JDK 25** for compatibility testing (optional)
- **Node.js 18+** (LTS recommended)
- **Rust stable** (for Tauri)
- **Git**

## Getting Started

```bash
# Clone the repository
git clone https://github.com/lumen/lumen.git
cd lumen

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Architecture

Lumen is a monorepo using npm workspaces:

- **apps/desktop** — Tauri 2 + React desktop application
  - `src/` — React frontend (TypeScript + JSX)
  - `src-tauri/` — Rust backend
- **packages/launcher-core** — Typed service layer (pure TypeScript)
- **packages/ui** — Shared UI components and theme system
- **packages/config** — Configuration schemas and migrations
- **packages/diagnostics** — Diagnostic tools

## Tech Stack

- **Frontend**: React 18, TypeScript, Zustand (state management), Framer Motion
- **Backend**: Tauri 2, Rust, reqwest, serde
- **Build**: Vite, Tauri CLI
- **UI Icons**: Lucide React

## Support

For development questions, join the [Discord](https://discord.gg/lumen).