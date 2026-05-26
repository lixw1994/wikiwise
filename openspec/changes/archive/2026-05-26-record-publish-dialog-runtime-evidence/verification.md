## Verification

Date: 2026-05-27

Commands run:

- `node --test apps/electron/test/runtime-parity-audit.test.js` failed before implementation, with the new first-publish dialog audit test missing `capturePublishDialogRuntimeEvidence`.
- `node --check scripts/audit-electron-runtime.mjs` failed after the first implementation because an embedded renderer script used a nested template literal inside the audit script template string.
- `npm run electron:audit:runtime` failed after the first runtime implementation because the publish capture re-clicked `home.md`, racing an async markdown selection restore that returned the final audit state to WIKI mode.
- `node --check scripts/audit-electron-runtime.mjs` passed after replacing the embedded URL-shape template literal with string concatenation and making the publish restore idempotent.
- `node --test apps/electron/test/runtime-parity-audit.test.js` passed after implementation.
- `npm run electron:audit:runtime` passed all runtime audit scenarios.
- Runtime audit report check confirmed `project-light` and `project-dark` captured `Publish your wiki`, a generated `https://<subdomain>.wiki-wise.com` URL, availability state `checking`, disabled `Publish`, hidden `Unpublish...`, cancel closure, restored `home.md`, and `publishDialogRestoredEditorMode: true`.
- `openspec validate record-publish-dialog-runtime-evidence --strict` passed.
- `openspec validate --all --strict` passed.
- `git diff --check` passed.
- `npm test` passed.
- `swift build` passed.
- `npm run electron:package:mac` passed and produced `apps/electron/out/Wikiwise.app` as an unsigned local bundle.
- `npm run electron:audit:runtime` passed again after packaging.

Retained runtime evidence:

- Dialog title: `Publish your wiki`
- URL shape: generated `https://<subdomain>.wiki-wise.com`
- Availability state: `checking`
- Publish action disabled before availability permits publishing: true
- First-publish `Unpublish...` action hidden: true
- Dialog closed through cancel path: true
- Restored selected file: `home.md`
- Restored editor state: FILE mode with editor visible and preview hidden

Scope note:

- This evidence covers first-publish dialog opening, visible surface, disabled state, cancel closure, and restore state.
- It does not claim runtime coverage for publish success, publish error, publish result feedback, or unpublish confirmation flows.
