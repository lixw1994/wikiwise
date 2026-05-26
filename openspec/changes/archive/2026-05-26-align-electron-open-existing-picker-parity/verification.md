## Verification

Date: 2026-05-26

## Red / Green

- Red: `node --test apps/electron/test/project-lifecycle.test.js` failed after adding the picker parity contract because Electron still advertised `Wikiwise files` with `css`, `js`, `json`, `html`, plus an `All Files` filter.
- Green: after narrowing the Electron open-existing dialog to markdown/plain-text extensions, the same focused command passed with 6 tests, 0 failures.

## Picker Parity Evidence

- Native SwiftUI source retains `canChooseDirectories = true`, `canChooseFiles = true`, `allowedContentTypes = [.folder, .plainText]`, `allowsMultipleSelection = false`, and the message "Choose a markdown file or a folder".
- Electron main-process source now retains `properties: ["openFile", "openDirectory"]`.
- Electron open-existing filters now expose only `Markdown or text files` with `md`, `markdown`, `txt`, and `text`.
- Regression coverage rejects Electron `css`, `js`, `json`, `html`, `All Files`, and `multiSelections` in the open-existing dialog contract.

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
node --test apps/electron/test/project-lifecycle.test.js
npm test
swift build
openspec validate align-electron-open-existing-picker-parity --strict
openspec validate --all --strict
git diff --check
npm run electron:package:mac
npm run electron:audit:runtime
```

Results:

- Focused project lifecycle test passed with 6 tests, 0 failures.
- `npm test` passed with 168 Electron tests and 28 core tests.
- `swift build` completed successfully.
- Change-specific and all-spec OpenSpec validation passed.
- `git diff --check` reported no whitespace errors.
- Local unsigned Electron macOS bundle was packaged at `apps/electron/out/Wikiwise.app`.
- Runtime audit passed all 7 retained scenarios.

## Residual Migration Gate

This phase closes the open-existing picker filter mismatch. It does not
complete the Electron migration by itself; final completion still requires a
successful `bash scripts/build-release.sh <version>` signed and notarized
release run, or an explicitly accepted OpenSpec deviation.
