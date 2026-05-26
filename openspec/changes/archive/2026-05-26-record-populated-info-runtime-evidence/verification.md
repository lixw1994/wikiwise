## Verification

Date: 2026-05-26

Commands run:

- `node --test apps/electron/test/runtime-parity-audit.test.js` failed before implementation, with the new populated INFO audit test missing `info-runtime.md` evidence.
- `node --test apps/electron/test/runtime-parity-audit.test.js` passed after implementation.
- `npm run electron:audit:runtime` passed all runtime audit scenarios.
- Runtime audit report check confirmed `project-light` and `project-dark` captured `Verify populated INFO runtime evidence`, linked text containing `home`, restored `home.md`, and `infoPopulatedRestoredEditorMode: true`.
- `openspec validate record-populated-info-runtime-evidence --strict` passed.
- `openspec validate --all --strict` passed.
- `git diff --check` passed.
- `npm test` passed.
- `swift build` passed.
- `npm run electron:package:mac` passed and produced `apps/electron/out/Wikiwise.app` as an unsigned local bundle.
- `npm run electron:audit:runtime` passed again after packaging.

Retained runtime evidence:

- Populated INFO fixture: `info-runtime.md`
- Expected directions: `Verify populated INFO runtime evidence`
- Expected linked target: `home`
- Restored selected file: `home.md`
- Restored editor state: FILE mode with editor visible and preview hidden
