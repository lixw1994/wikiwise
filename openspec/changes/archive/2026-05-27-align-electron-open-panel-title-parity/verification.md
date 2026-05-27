## Verification

### RED

- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js test/new-wiki-scaffold.test.js` exited 1 before implementation. The new tests failed because Electron still set `title: "Choose a markdown file or a folder"` in `openExistingProject` and `title: "Choose where to create your wiki"` in `chooseNewWikiLocation`.

### GREEN

- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js test/new-wiki-scaffold.test.js` exited 0 after implementation, with 35/35 targeted lifecycle and new-wiki tests passing.

### Full Checks

- `openspec validate --all --strict` exited 0 before archive, with 34/34 items passing.
- `git diff --check` exited 0.
- `npm test` exited 0, with 225/225 Electron tests and 31/31 core tests passing.
- `swift build` exited 0.
- `npm run electron:package:mac` exited 0 and packaged `apps/electron/out/Wikiwise.app` at version 0.1.9.

### Release Gate Evidence

- `npm run electron:release:readiness` exited 1 at the expected credential gate and wrote `apps/electron/out/release-readiness/report.json`.
- The readiness report recorded `version` as `0.1.9`, `status` as `blocked`, no release artifacts produced, no signed/notarized release produced, and blockers for the missing Developer ID signing identity `Developer ID Application: Readwise, Inc (QV36BMA4LN)` plus missing or unusable Apple notarization keychain profile `notarytool`.

### Post-Archive Checks

- `openspec validate --all --strict` exited 0 after archive, with 33/33 specs passing.
- `openspec list --json` returned `{"changes":[]}` after archive.
- `git diff --check` exited 0 after trimming synced spec EOF blank lines.
- `npm --workspace @wikiwise/electron-app test -- test/project-lifecycle.test.js test/new-wiki-scaffold.test.js test/openspec-purpose-hygiene.test.js` exited 0 after archive, with 36/36 targeted lifecycle, new-wiki, and OpenSpec hygiene tests passing.
