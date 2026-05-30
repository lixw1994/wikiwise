# Project Context

Wikiwise is an Electron-only desktop app that turns folders of Markdown files into a browsable, publishable wiki maintained by a coding agent.

## Stack

- Electron app targeting macOS 14+ packaging
- Node/npm workspace with `apps/electron` and `packages/wikiwise-core`
- Bundled JavaScript resources for Markdown compilation
- Chromium renderer and CodeMirror editor surfaces behind a preload bridge
- node-pty and xterm.js embedded terminal for coding agents
- Filesystem watching and live recompilation
- Wiki scaffold source: `apps/electron/resources/scaffold/`

## Key Paths

- Electron app source: `apps/electron/src/`
- Bundled app/wiki resources: `apps/electron/resources/`
- Wiki scaffold template: `apps/electron/resources/scaffold/`
- Shared core package: `packages/wikiwise-core/`
- Release script: `scripts/build-release.sh`

## Commands

- Install: `npm install`
- Test: `npm test`
- Run: `npm run electron:dev`
- Package macOS app: `npm run electron:package:mac`
- Release: `bash scripts/build-release.sh <version>`
- Release preflight: `bash scripts/build-release.sh --preflight <version>`

Release builds must use `scripts/build-release.sh`; do not manually build, sign, notarize, or package release artifacts. The canonical release path packages the Electron app, signs with a Developer ID identity, creates `Wikiwise-macOS.dmg`, submits Apple notarization, staples the ticket, and assesses the final DMG.
Release preflight checks tooling, Developer ID signing identity, and the Apple notarization keychain profile without producing release artifacts. It can retain blocker evidence, but final Electron release completion still requires an actual signed and notarized release run or an explicitly accepted OpenSpec deviation.

## OpenSpec Schema Selection

Default schema: spec-driven.

Use spec-driven-superpowers automatically for changes involving:

- file watching or live rebuild behavior
- Markdown compilation, `build.js`, `app.js`, `graph.js`, or bundled web resources
- renderer preview/editor integration or JavaScript bridge behavior
- terminal embedding or agent workflow integration
- wiki scaffold structure, `CLAUDE.md`, `AGENTS.md`, bundled skills, or seed wiki pages
- release builds, signing, notarization, DMG packaging, or update distribution
- macOS sandboxing, file permissions, user-selected folders, or security-sensitive behavior
- cross-cutting Electron + core + scaffold changes
- behavior requiring retained verification evidence

For simple local UI, copy, README, or narrowly scoped Electron changes, use the default spec-driven schema.

For high-risk changes, create the change with:
openspec new change <name> --schema spec-driven-superpowers

Do not modify openspec/config.yaml just to handle one high-risk change.
