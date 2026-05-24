# Wikiwise Electron

This package is the OpenSpec-driven cross-platform desktop workspace for Wikiwise.
It is intentionally small: the current production app remains the SwiftUI macOS
app under `Sources/Wikiwise/`.

## Commands

```sh
npm --prefix apps/electron test
npm run electron:dev
npm run electron:package:mac
npm run electron:audit:runtime
```

`npm run electron:dev` requires dependencies to be installed first:

```sh
npm install
```

The Electron app loads the renderer through a narrow preload bridge and reuses
the shared `@wikiwise/core` package for native-compatible project behavior.

## Local macOS package

`npm run electron:package:mac` assembles a local Electron app bundle at
`apps/electron/out/Wikiwise.app` using the installed Electron runtime from
`node_modules/electron/dist/Electron.app`.

This app bundle is unsigned and intended for local migration verification. A
signed, notarized DMG remains a separate release gate and must not bypass the
existing release signing, notarization, and DMG packaging checks.

## Runtime parity audit

`npm run electron:audit:runtime` launches Electron with the current renderer and
preload bridge, captures welcome and opened-project states in light and dark
appearance, and writes retained evidence to
`apps/electron/out/runtime-audit/report.json`.

Screenshots are written under `apps/electron/out/runtime-audit/screenshots/`.
The audit is a local runtime check for migration parity evidence; final release
hardening still requires the signed and notarized DMG gate.
