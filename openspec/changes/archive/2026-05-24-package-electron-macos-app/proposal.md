## Why

The Electron migration has functional parity for the main app workflows, but there is not yet a reproducible way to assemble the Electron workspace into a launchable macOS `.app`. Packaging is the next roadmap phase before a final parity audit because native equivalence must include a concrete app bundle, metadata, embedded code, and release checks.

## What Changes

- Add a dependency-light macOS Electron app packaging script that assembles `apps/electron/out/Wikiwise.app` from the installed Electron runtime.
- Package the Electron app source, preload/renderer files, and `@wikiwise/core` workspace package inside `Contents/Resources/app`.
- Rewrite app bundle metadata to use Wikiwise product naming, bundle identifier, version, executable name, and icon reference.
- Add npm scripts for root and Electron workspace packaging.
- Add structural tests for packaging scripts, app metadata, embedded app layout, and release guardrails.
- Document the local package command and its relationship to the existing signed/notarized Swift release script.

## Capabilities

### New Capabilities

- `electron-macos-packaging`: Electron macOS app bundle assembly, product metadata, embedded workspace layout, and local package verification.

### Modified Capabilities

- `cross-platform-electron-workspace`: Add packaging commands and script expectations to the Electron workspace contract.
- `electron-native-parity-roadmap`: Record packaging/release as an implemented migration phase while leaving final parity audit open.

## Impact

- Affected code: root `package.json`, `apps/electron/package.json`, `scripts/`, Electron packaging tests, `apps/electron/README.md`, and OpenSpec specs.
- The script writes generated output under ignored `apps/electron/out/`.
- No Swift source changes are planned.
- This phase does not bypass the existing signed, notarized, DMG Swift release process; final release signing/notarization remains a later gate.
