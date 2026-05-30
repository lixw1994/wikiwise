# Wikiwise

An Electron-only desktop wiki reader with a sidebar file browser, rendered markdown preview, editor, terminal, publishing, and macOS packaging.

## Development

- Install: `npm install`
- Test: `npm test`
- Run Electron: `npm run electron:dev`
- Package macOS app: `npm run electron:package:mac`
- Release: `bash scripts/build-release.sh <version>` — **always use this for releases.** It runs the Electron runtime audit, packages the Electron app, signs with the Readwise Developer ID, creates `Wikiwise-macOS.dmg`, notarizes with Apple, staples the ticket, and assesses the final DMG. Never build releases manually or skip this script.
- Release preflight: `bash scripts/build-release.sh --preflight <version>` checks release tooling, Developer ID signing identity, and Apple notarization profile before any audit, packaging, signing, or DMG artifact work. Preflight evidence is useful when credentials are unavailable, but it is not a signed or notarized release.

## Architecture

- Electron app under `apps/electron/`, built with a main process, preload bridge, and renderer shell
- `@wikiwise/core` under `packages/wikiwise-core/` owns reusable wiki filesystem, scaffold, compiler, watcher, and publishing behavior
- Three-pane desktop shell: sidebar file tree + detail content pane + right info/terminal sidebar
- File tree built from scanning a user-selected folder for `.md` files
- Markdown rendering and generated static site output use bundled JavaScript resources from `apps/electron/resources/`

## Wiki scaffold

When users create a new wiki, the app copies the template from `apps/electron/resources/scaffold/`. This is the source of truth for the default wiki structure, including:

- `CLAUDE.md` — the wiki schema (conventions, writing style, workflows)
- `AGENTS.md` — cross-agent instructions for Cursor, Codex, etc.
- `llm-wiki.md` — Karpathy's original pattern description
- `skills/` — Claude Code skills (ingest, lint, import-readwise, digest, etc.)
- `wiki/` — seed pages (home.md, index.md, log.md)
