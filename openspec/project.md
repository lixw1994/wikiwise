# Project Context

Wikiwise is a native macOS app that turns folders of Markdown files into a browsable, publishable wiki maintained by a coding agent.

## Stack

- SwiftUI macOS app targeting macOS 14+
- SwiftPM package, no Xcode project
- JavaScriptCore and bundled JavaScript resources for Markdown compilation
- WKWebView-based rendering and editor surfaces
- SwiftTerm embedded terminal for coding agents
- FSEvents-based file watching and live recompilation
- Wiki scaffold source: `Sources/Wikiwise/Resources/scaffold/`

## Key Paths

- App source: `Sources/Wikiwise/`
- Bundled web resources: `Sources/Wikiwise/Resources/`
- Wiki scaffold template: `Sources/Wikiwise/Resources/scaffold/`
- Editor bundle source: `editor/`
- Release script: `scripts/build-release.sh`

## Commands

- Build: `swift build`
- Run: `.build/arm64-apple-macosx/debug/Wikiwise`
- Release: `bash scripts/build-release.sh <version>`

Release builds must use `scripts/build-release.sh`; do not manually build, sign, notarize, or package release artifacts.

## OpenSpec Schema Selection

Default schema: spec-driven.

Use spec-driven-superpowers automatically for changes involving:

- file watching, FSEvents, or live rebuild behavior
- Markdown compilation, `build.js`, `app.js`, `graph.js`, or bundled web resources
- WKWebView rendering, editor integration, or JavaScript bridge behavior
- SwiftTerm terminal embedding or agent workflow integration
- wiki scaffold structure, `CLAUDE.md`, `AGENTS.md`, bundled skills, or seed wiki pages
- release builds, signing, notarization, DMG packaging, or update distribution
- macOS sandboxing, file permissions, user-selected folders, or security-sensitive behavior
- cross-cutting Swift + JavaScript + scaffold changes
- behavior requiring retained verification evidence

For simple local UI, copy, README, or narrowly scoped Swift changes, use the default spec-driven schema.

For high-risk changes, create the change with:
openspec new change <name> --schema spec-driven-superpowers

Do not modify openspec/config.yaml just to handle one high-risk change.
