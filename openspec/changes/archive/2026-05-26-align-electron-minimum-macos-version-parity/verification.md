## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/macos-packaging.test.js` failed after adding the minimum macOS metadata parity contract because `scripts/package-electron-macos.mjs` did not write `LSMinimumSystemVersion: "14.0"`.
- Green: after adding `LSMinimumSystemVersion: "14.0"` to the package script's `Info.plist` rewrite map, the same focused command passed with 13 tests, 0 failures.

## Native Minimum macOS Evidence

Commands:

```bash
plutil -p Wikiwise.app/Contents/Info.plist
rg -n "LSMinimumSystemVersion|minimum|macOS|14\.0|11\.0" Package.swift README.md openspec/project.md
```

Result:

- Native app bundle declares `LSMinimumSystemVersion` as `14.0`.
- `Package.swift` declares `platforms: [.macOS(.v14)]`.
- README states Wikiwise requires macOS 14+.
- OpenSpec project context states the SwiftUI app targets macOS 14+.

## Packaged Electron Plist Evidence

Commands:

```bash
npm run electron:package:mac
plutil -p apps/electron/out/Wikiwise.app/Contents/Info.plist
rg -n "LSMinimumSystemVersion|CFBundleDisplayName|CFBundleIdentifier|CFBundleExecutable|CFBundleIconFile" apps/electron/out/Wikiwise.app/Contents/Info.plist
```

Result:

- Local unsigned Electron app bundle was packaged at `apps/electron/out/Wikiwise.app`.
- Packaged Electron `Info.plist` declares `LSMinimumSystemVersion` as `14.0`.
- Wikiwise product metadata remains present in the packaged app bundle.

## Runtime Evidence

Command:

```bash
npm run electron:audit:runtime
```

Result:

- Runtime audit captured and passed `welcome-light`, `welcome-dark`, `new-wiki-light`, `new-wiki-dark`, `standalone-file-light`, `project-light`, and `project-dark`.
- Report path: `apps/electron/out/runtime-audit/report.json`.
- Screenshot path: `apps/electron/out/runtime-audit/screenshots`.

## Full Verification Commands

```bash
node --test apps/electron/test/macos-packaging.test.js
npm run electron:package:mac
npm test
swift build
openspec validate align-electron-minimum-macos-version-parity --strict
openspec validate --all --strict
git diff --check
npm run electron:audit:runtime
```

Results:

- Focused macOS packaging test passed with 13 tests, 0 failures.
- `npm test` passed with 170 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Runtime audit passed all 7 retained scenarios.

## Residual Migration Gate

This phase closes the minimum macOS metadata mismatch in the local packaged app.
It does not complete the Electron migration by itself; final completion still
requires a successful `bash scripts/build-release.sh <version>` signed and
notarized release run, or an explicitly accepted OpenSpec deviation.
