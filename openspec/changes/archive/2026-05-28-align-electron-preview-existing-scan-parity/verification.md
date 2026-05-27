## Verification

### RED

- `node --test apps/electron/test/compiler-preview.test.js`
  - Failed as expected in `selected markdown preview compilation uses existing scan lifecycle like native`.
  - Failure showed `compileMarkdownFile()` still called `compiler.scanPages()`.

### GREEN

- `node --test apps/electron/test/compiler-preview.test.js`
  - 9 passed, 0 failed.
- `openspec validate align-electron-preview-existing-scan-parity --strict`
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
  - Electron app: 259 passed, 0 failed.
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

- Native folder open calls `c.scanPages()` before `loadFile(_:)` can compile the selected home page.
- Native `loadFile(_:)` uses `compileSingle(slug:)` and `compileAdhoc(filePath:outputPath:)` without `scanPages()` or `rescan()`.
- Native watcher markdown, rebuild, and structure events call `c.rescan()` before affected selected-page refreshes.
- Electron folder open still runs `getCompiler(projectRoot).scanPages()` before compiling `wiki/home.md`.
- Electron watcher summaries still call `compiler.rescan()` for markdown, rebuild, and structure changes.
- Electron `compileMarkdownFile()` now compiles the selected page from existing compiler state without per-preview `scanPages()`.

## Known Gaps

- Final migration completion still requires actual signed and notarized release execution, or an explicitly accepted OpenSpec deviation.
