## Verification

Checked at 2026-05-28 03:47:01 CST.

## Source Evidence

- Native `Sources/Wikiwise/ContentView.swift` keeps active-file tracking best-effort via `try? relativePath.write(to: activeFile, atomically: true, encoding: .utf8)`.
- Electron renderer `setActiveSelectedFile()` still delegates to `window.wikiwise.setActiveFile(...)`, but rejected selection side-effect writes now return `null` without calling global `setError`.
- Electron main process `setActiveFile(payload)` still validates `projectRoot` and `filePath` with `assertProjectRoot` and `assertProjectPath` before delegating to shared core `writeActiveFile(projectRoot, filePath)`.

## RED

- `node --test apps/electron/test/project-lifecycle.test.js`
- Failed as expected before implementation:
  - `renderer active-file selection failures stay silent like native try-optional writes`
  - Assertion rejected the existing `setError(error)` call inside `setActiveSelectedFile()`.

## GREEN

- `node --test apps/electron/test/project-lifecycle.test.js`
  - 11 tests passed, 0 failed.

## Broader Checks

- `openspec validate align-electron-active-file-error-silence-parity --strict`
  - Change valid.
- `openspec validate --all --strict`
  - 34 passed, 0 failed.
- `npm test`
  - Electron app: 249 tests passed.
  - Core package: 42 tests passed.
- `swift build`
  - Build complete.
- `npm run electron:package:mac`
  - Packaged `apps/electron/out/Wikiwise.app`.
  - Bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime`
  - PASS `welcome-light`
  - PASS `welcome-dark`
  - PASS `new-wiki-light`
  - PASS `new-wiki-dark`
  - PASS `standalone-file-light`
  - PASS `project-light`
  - PASS `project-dark`
  - Runtime report: `apps/electron/out/runtime-audit/report.json`.
- `npm run electron:release:readiness`
  - Exited non-zero with retained blocked readiness evidence.
  - Report path: `apps/electron/out/release-readiness/report.json`.
  - Blockers: missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` and missing or unusable Apple notarization keychain profile `notarytool`.
  - `artifactProduction.releaseArtifactsProduced` is `false`.
  - `artifactProduction.signedOrNotarizedReleaseProduced` is `false`.

## Post-Archive Checks

- `openspec archive align-electron-active-file-error-silence-parity --yes`
  - Archived as `openspec/changes/archive/2026-05-27-align-electron-active-file-error-silence-parity/`.
  - Synced `electron-project-lifecycle` and `electron-native-parity-roadmap`.
- `openspec validate --all --strict`
  - 33 passed, 0 failed.
- `npm test`
  - Electron app: 249 tests passed.
  - Core package: 42 tests passed.
