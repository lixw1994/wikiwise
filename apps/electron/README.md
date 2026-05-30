# Wikiwise Electron

This package is the Electron-only desktop app for Wikiwise. It owns the desktop
runtime, renderer shell, bundled resources, macOS packaging path, and release
audit entry points.

## Commands

```sh
npm --prefix apps/electron test
npm run electron:dev
npm run electron:package:mac
npm run electron:audit:runtime
npm run electron:audit:packaged
npm run electron:release:preflight
npm run electron:release:readiness
npm run electron:release:evidence
```

`npm run electron:dev` requires dependencies to be installed first:

```sh
npm install
```

The Electron app loads the renderer through a narrow preload bridge and reuses
the shared `@wikiwise/core` package for project behavior. Bundled compiler,
editor, graph/map, KaTeX, icon, and scaffold assets live in
`apps/electron/resources/`.

## Local macOS package

`npm run electron:package:mac` assembles a local Electron app bundle at
`apps/electron/out/Wikiwise.app` using the installed Electron runtime from
`node_modules/electron/dist/Electron.app`.

This app bundle is unsigned and intended for local migration verification.
During packaging, the script audits the packaged `Info.plist` against a reviewed
Electron key allowlist. The command fails if an unexpected plist key remains
before any signed and notarized release is produced.
Production release distribution uses `bash scripts/build-release.sh <version>`,
which runs the Electron runtime audit, packages the app, runs packaged runtime
smoke against `apps/electron/out/Wikiwise.app`, signs the Electron app with a
Developer ID identity, creates `Wikiwise-macOS.dmg`, submits Apple notarization,
staples the ticket, assesses the final DMG, and only then reports a notarized release.
`bash scripts/build-release.sh --preflight <version>` checks release tooling,
Developer ID signing identity, and Apple notarization profile availability
without producing app, DMG, signed, or notarized release artifacts.
`npm run electron:release:readiness` runs the same preflight with retained JSON
evidence at `apps/electron/out/release-readiness/report.json`. A blocked report
lists prerequisite blocker names and messages, records that no release artifacts
were produced, and keeps the final gate explicit: Electron release completion
still requires an actual signed and notarized release run, or an accepted OpenSpec deviation.
`npm run electron:release:evidence` runs the full production release command with
a retained release success report at `apps/electron/out/release/report.json`.
That report is written only after runtime audit, packaging, packaged runtime smoke, signing, notarization, stapling, and assessment complete,
and it records the DMG path plus SHA-256 checksum. It is not a substitute for a completed production release;
it is the structured evidence retained by that completed release.

## GitHub release workflow

The manual `Electron Release` workflow at
`.github/workflows/electron-release.yml` runs on macOS and executes the same
canonical release path. It installs dependencies, runs `npm test`, imports Apple
release credentials from GitHub secrets, stores a
`notarytool` keychain profile, then runs `bash scripts/build-release.sh
--release-report apps/electron/out/release/report.json` or
`npm run electron:release:evidence` when the workflow release-version input is
left empty.

Required secrets:

- `APPLE_SIGNING_CERTIFICATE_BASE64`: base64-encoded Developer ID Application
  PKCS#12 certificate.
- `APPLE_SIGNING_CERTIFICATE_PASSWORD`: password for the PKCS#12 certificate.
- `APPLE_NOTARY_KEY_ID`: Apple notarization API key ID.
- `APPLE_NOTARY_ISSUER_ID`: Apple notarization issuer ID.
- `APPLE_NOTARY_KEY_BASE64`: base64-encoded notarization API private key.

After a successful signed and notarized release run, the workflow uploads
`Wikiwise-macOS.dmg`, `apps/electron/out/release/report.json`,
`apps/electron/out/runtime-audit/report.json`,
`apps/electron/out/runtime-audit/screenshots/`, and
`apps/electron/out/packaged-runtime-audit/report.json` as artifacts.
Final Electron release completion still requires that successful signed and
notarized release run, or an accepted OpenSpec deviation.

## Runtime parity audit

`npm run electron:audit:runtime` launches Electron with the current renderer and
preload bridge, captures welcome and opened-project states in light and dark
appearance, and writes retained evidence to
`apps/electron/out/runtime-audit/report.json`.

Screenshots are written under `apps/electron/out/runtime-audit/screenshots/`.
The audit is a local runtime check for migration parity evidence and is also
part of the canonical Electron release gate.

`npm run electron:audit:packaged` launches the packaged app bundle at
`apps/electron/out/Wikiwise.app` after `npm run electron:package:mac` and writes
retained smoke evidence to `apps/electron/out/packaged-runtime-audit/report.json`.
It verifies the packaged renderer, preload bridge, shared core package, Electron
resources, and `node-pty` helper permissions before release signing mutates the bundle.
