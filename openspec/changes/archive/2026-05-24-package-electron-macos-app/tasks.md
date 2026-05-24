## 1. Packaging Tests

- [x] 1.1 Add failing structural tests for Electron package scripts, package implementation, bundle metadata, embedded app layout, and local-release guardrails.
- [x] 1.2 Verify `npm --prefix apps/electron test` fails for the new package expectations before implementation.

## 2. Packaging Implementation

- [x] 2.1 Implement `scripts/package-electron-macos.mjs` to assemble `apps/electron/out/Wikiwise.app` from the installed Electron runtime.
- [x] 2.2 Add root and Electron workspace npm package scripts.
- [x] 2.3 Update Electron README with local unsigned app packaging and signed-release guardrail notes.
- [x] 2.4 Verify `npm --prefix apps/electron test` passes.

## 3. Package Artifact Verification

- [x] 3.1 Run the Electron macOS package command and verify `apps/electron/out/Wikiwise.app` exists.
- [x] 3.2 Verify packaged `Info.plist` metadata and embedded app/core files.

## 4. Validation

- [x] 4.1 Verify `npm test` passes.
- [x] 4.2 Verify `openspec validate package-electron-macos-app --strict` passes.
- [x] 4.3 Verify Swift source files are untouched and `swift build` passes.
- [x] 4.4 Verify `git diff --check` passes.
- [x] 4.5 Record retained verification evidence.
