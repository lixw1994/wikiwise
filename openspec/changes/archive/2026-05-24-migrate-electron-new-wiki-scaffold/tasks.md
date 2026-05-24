## 1. Core Scaffold Helpers

- [x] 1.1 Add failing core tests for wiki name slugging, directory structure, template replacement, version marker, `.gitignore`, settings, skills, and bundled build-tool copying.
- [x] 1.2 Implement native-compatible scaffold helpers in `@wikiwise/core`.
- [x] 1.3 Verify `npm --prefix packages/wikiwise-core test` passes.

## 2. Electron New Wiki Flow

- [x] 2.1 Add failing Electron structural tests for scaffold IPC, preload APIs, renderer dialog state, create flow, post-create guide, and created project opening.
- [x] 2.2 Implement main-process default location, location picker, create-new-wiki IPC, and created project result wiring.
- [x] 2.3 Implement preload scaffold APIs.
- [x] 2.4 Implement renderer new-wiki dialog, create flow, post-create guide, and guide dismissal.
- [x] 2.5 Update renderer HTML/CSS to support the dialog and guide without deferred messaging.
- [x] 2.6 Verify `npm --prefix apps/electron test` passes.

## 3. Validation

- [x] 3.1 Verify `npm test` passes.
- [x] 3.2 Verify `openspec validate migrate-electron-new-wiki-scaffold --strict` passes.
- [x] 3.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 3.4 Verify `git diff --check` passes.
- [x] 3.5 Record retained verification evidence.
