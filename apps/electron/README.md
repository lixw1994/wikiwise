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
npm run electron:release:preflight
npm run electron:release:readiness
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

This app bundle is unsigned and intended for local migration verification.
Production release distribution uses `bash scripts/build-release.sh <version>`,
which runs the Electron runtime audit, signs the Electron app with a Developer ID
identity, creates `Wikiwise-macOS.dmg`, submits Apple notarization, staples the
ticket, assesses the final DMG, and only then reports a notarized release.
`bash scripts/build-release.sh --preflight <version>` checks release tooling,
Developer ID signing identity, and Apple notarization profile availability
without producing app, DMG, signed, or notarized release artifacts.
`npm run electron:release:readiness` runs the same preflight with retained JSON
evidence at `apps/electron/out/release-readiness/report.json`. A blocked report
lists prerequisite blocker names and messages, records that no release artifacts
were produced, and keeps the final gate explicit: Electron migration completion
still requires an actual signed and notarized release run, or an accepted OpenSpec deviation.

## Runtime parity audit

`npm run electron:audit:runtime` launches Electron with the current renderer and
preload bridge, captures welcome and opened-project states in light and dark
appearance, and writes retained evidence to
`apps/electron/out/runtime-audit/report.json`.

Screenshots are written under `apps/electron/out/runtime-audit/screenshots/`.
The audit is a local runtime check for migration parity evidence and is also
part of the canonical Electron release gate.
