## Verification

### RED

- `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - Failed as expected in `generated page navigation uses existing output without compiling like native`.
  - Failure showed `openGeneratedPage()` still called `compiler.compileAll()`.

### GREEN

- `node --test apps/electron/test/preview-navigation-map-graph.test.js`
  - 11 passed, 0 failed.
- `openspec validate align-electron-generated-page-existing-output-parity --strict`
  - Change valid.
- `openspec validate --all --strict`
  - 34 passed, 0 failed before archive.
- `openspec validate --all --strict`
  - 33 passed, 0 failed after archive.
- `openspec list --json`
  - `{"changes":[]}` after archive.
- `git diff --check`
  - Passed with no whitespace errors.
- `npm test`
  - Electron app: 258 passed, 0 failed.
  - Core package: 42 passed, 0 failed.
- `swift build`
  - Build complete.
- `npm run electron:package:mac`
  - Packaged `apps/electron/out/Wikiwise.app`.
  - Bundle identifier `com.readwise.wikiwise`, version `0.1.9`, bundle version `1`.
- `npm run electron:audit:runtime`
  - 7 runtime audit scenarios passed.
  - Report: `apps/electron/out/runtime-audit/report.json`.
  - Screenshots: `apps/electron/out/runtime-audit/screenshots`.
- `npm run electron:release:readiness`
  - Expected exit 1 because this machine lacks the Developer ID signing identity and usable `notarytool` profile.
  - Readiness report written under `apps/electron/out/release-readiness/report.json`.

## Parity Evidence

- Native folder open calls `c.scanPages()` before background compilation.
- Native toolbar map navigation checks `FileManager.default.fileExists(atPath: mapFile.path)` and does not call `compileAll()`.
- Native generated-link fallback checks `FileManager.default.fileExists(atPath: htmlFile.path)` and does not call `compileAll()`.
- Electron `createProjectResult()` still runs `getCompiler(projectRoot).scanPages()` for folder opens.
- Electron `openGeneratedPage()` and `resolvePreviewNavigation()` now check existing generated output and return `null` if absent without triggering `compileAll()`.

## Known Gaps

- Final migration completion still requires actual signed and notarized release execution, or an explicitly accepted OpenSpec deviation.
